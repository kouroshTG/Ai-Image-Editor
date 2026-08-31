export function renderEditedImage({
  imageSrc,
  crop,
  imageWidth,
  imageHeight,
  rotation = 0,
  brightness = 0,
  hue = 0,
}) {
  return new Promise((resolve, reject) => {
    const image = new Image()

    image.onload = () => {
      try {
        let cropX
        let cropY
        let cropWidth
        let cropHeight

        if (crop.unit === '%') {
          cropX =
            (crop.x / 100) *
            image.naturalWidth

          cropY =
            (crop.y / 100) *
            image.naturalHeight

          cropWidth =
            (crop.width / 100) *
            image.naturalWidth

          cropHeight =
            (crop.height / 100) *
            image.naturalHeight
        } else {
          const scaleX =
            image.naturalWidth / imageWidth

          const scaleY =
            image.naturalHeight / imageHeight

          cropX = crop.x * scaleX
          cropY = crop.y * scaleY

          cropWidth =
            crop.width * scaleX

          cropHeight =
            crop.height * scaleY
        }

        cropX = Math.max(0, cropX)
        cropY = Math.max(0, cropY)

        cropWidth = Math.min(
          cropWidth,
          image.naturalWidth - cropX,
        )

        cropHeight = Math.min(
          cropHeight,
          image.naturalHeight - cropY,
        )

        /*
         * Crop
         */

        const cropCanvas =
          document.createElement('canvas')

        const cropContext =
          cropCanvas.getContext('2d')

        cropCanvas.width =
          Math.round(cropWidth)

        cropCanvas.height =
          Math.round(cropHeight)

        cropContext.drawImage(
          image,
          cropX,
          cropY,
          cropWidth,
          cropHeight,
          0,
          0,
          cropCanvas.width,
          cropCanvas.height,
        )

        /*
         * Rotation
         */

        const radians =
          (rotation * Math.PI) / 180

        const rotatedWidth =
          Math.abs(
            cropCanvas.width *
              Math.cos(radians),
          ) +
          Math.abs(
            cropCanvas.height *
              Math.sin(radians),
          )

        const rotatedHeight =
          Math.abs(
            cropCanvas.width *
              Math.sin(radians),
          ) +
          Math.abs(
            cropCanvas.height *
              Math.cos(radians),
          )

        const rotatedCanvas =
          document.createElement('canvas')

        const rotatedContext =
          rotatedCanvas.getContext('2d')

        rotatedCanvas.width =
          Math.ceil(rotatedWidth)

        rotatedCanvas.height =
          Math.ceil(rotatedHeight)

        rotatedContext.save()

        rotatedContext.translate(
          rotatedCanvas.width / 2,
          rotatedCanvas.height / 2,
        )

        rotatedContext.rotate(radians)

        rotatedContext.drawImage(
          cropCanvas,
          -cropCanvas.width / 2,
          -cropCanvas.height / 2,
        )

        rotatedContext.restore()

        /*
         * Brightness + Hue
         */

        if (
          brightness !== 0 ||
          hue !== 0
        ) {
          const imageData =
            rotatedContext.getImageData(
              0,
              0,
              rotatedCanvas.width,
              rotatedCanvas.height,
            )

          const data = imageData.data

          const brightnessAdjustment =
            brightness * 2.55

          /*
           * برای Hue از یک Canvas موقت
           * با filter استفاده می‌کنیم.
           */

          if (hue !== 0) {
            const filteredCanvas =
              document.createElement('canvas')

            const filteredContext =
              filteredCanvas.getContext('2d')

            filteredCanvas.width =
              rotatedCanvas.width

            filteredCanvas.height =
              rotatedCanvas.height

            filteredContext.filter = `
              brightness(${100 + brightness}%)
              hue-rotate(${hue}deg)
            `

            filteredContext.drawImage(
              rotatedCanvas,
              0,
              0,
            )

            rotatedCanvas.width =
              filteredCanvas.width

            rotatedCanvas.height =
              filteredCanvas.height

            rotatedContext.drawImage(
              filteredCanvas,
              0,
              0,
            )
          } else if (brightness !== 0) {
            for (
              let i = 0;
              i < data.length;
              i += 4
            ) {
              data[i] = Math.min(
                255,
                Math.max(
                  0,
                  data[i] +
                    brightnessAdjustment,
                ),
              )

              data[i + 1] = Math.min(
                255,
                Math.max(
                  0,
                  data[i + 1] +
                    brightnessAdjustment,
                ),
              )

              data[i + 2] = Math.min(
                255,
                Math.max(
                  0,
                  data[i + 2] +
                    brightnessAdjustment,
                ),
              )
            }

            rotatedContext.putImageData(
              imageData,
              0,
              0,
            )
          }
        }

        /*
         * تبدیل به File
         */

        rotatedCanvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(
                new Error(
                  'ساخت تصویر نهایی انجام نشد',
                ),
              )

              return
            }

            const file = new File(
              [blob],
              'edited-image.jpg',
              {
                type: 'image/jpeg',
              },
            )

            const url =
              URL.createObjectURL(blob)

            resolve({
              file,
              url,
            })
          },
          'image/jpeg',
          0.95,
        )
      } catch (error) {
        reject(error)
      }
    }

    image.onerror = () => {
      reject(
        new Error(
          'بارگذاری تصویر انجام نشد',
        ),
      )
    }

    image.src = imageSrc
  })
}