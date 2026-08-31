export function cropImage(
  imageSrc,
  crop,
  imageWidth,
  imageHeight,
) {
  return new Promise((resolve, reject) => {
    const image = new Image()

    image.onload = () => {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      const scaleX = image.naturalWidth / imageWidth
      const scaleY = image.naturalHeight / imageHeight

      const cropX = crop.x * scaleX
      const cropY = crop.y * scaleY
      const cropWidth = crop.width * scaleX
      const cropHeight = crop.height * scaleY

      canvas.width = cropWidth
      canvas.height = cropHeight

      context.drawImage(
        image,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight,
      )

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(
              new Error('ساخت تصویر جدید انجام نشد'),
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

          resolve(file)
        },
        'image/jpeg',
        0.95,
      )
    }

    image.onerror = () => {
      reject(
        new Error('بارگذاری تصویر انجام نشد'),
      )
    }

    image.src = imageSrc
  })
}