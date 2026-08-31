import { useEffect, useState } from 'react'
import { Camera, Image } from 'lucide-react'

import ImageCard from './ImageCard'
import ImagePreviewModal from './ImagePreviewModal'

function ImageUploader({
  images,
  onImagesChange,
  disabled,
  imageStatuses,
  onEdit,
}) {
  const [previewImage, setPreviewImage] =
    useState(null)

  const [previewUrl, setPreviewUrl] =
    useState('')

  useEffect(() => {
    if (!previewImage) {
      setPreviewUrl('')
      return
    }

    const url =
      URL.createObjectURL(previewImage)

    setPreviewUrl(url)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [previewImage])

  const handleImageChange = (event) => {
    const selectedFiles = Array.from(
      event.target.files,
    )

    if (selectedFiles.length === 0) {
      return
    }

    onImagesChange((previousImages) => [
      ...previousImages,
      ...selectedFiles,
    ])

    event.target.value = ''
  }

  const handleImageRemove = (imageToRemove) => {
    onImagesChange((previousImages) =>
      previousImages.filter(
        (image) => image !== imageToRemove,
      ),
    )

    if (previewImage === imageToRemove) {
      setPreviewImage(null)
    }
  }

  const getUploadButtonClassName = (
    isPrimary = false,
  ) =>
    [
      'flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 font-medium transition-all duration-200',

      isPrimary
        ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-md'
        : 'border border-purple-200 bg-white text-purple-700 shadow-sm',

      disabled
        ? 'pointer-events-none cursor-not-allowed opacity-40'
        : isPrimary
          ? 'cursor-pointer hover:scale-[1.01] hover:shadow-lg'
          : 'cursor-pointer hover:scale-[1.01] hover:border-purple-300 hover:bg-purple-50 hover:shadow-lg',
    ].join(' ')

  const previewData = previewImage
    ? {
        src: previewUrl,
        title: `تصویر ${
          images.indexOf(previewImage) + 1
        }`,
      }
    : null

  return (
    <section className="border-t border-purple-100 pt-8">
      <h2 className="text-lg font-semibold text-gray-900">
        تصاویر
      </h2>

      <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
        تصاویر مورد نیاز خود را انتخاب یا با دوربین ثبت کنید.
      </p>

      {/* Upload Area */}
      <div className="mt-5 rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/50 p-5 sm:p-6">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
            <Image size={28} />
          </div>

          <h3 className="mt-4 font-bold text-gray-800">
            افزودن تصاویر
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            تصاویر موردنظر خود را از گالری انتخاب کنید یا با دوربین ثبت کنید.
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          {/* Gallery */}
          <label
            className={getUploadButtonClassName()}
          >
            <Image size={20} />

            <span>
              انتخاب از گالری
            </span>

            <input
              type="file"
              accept="image/*"
              multiple
              disabled={disabled}
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {/* Camera */}
          <label
            className={getUploadButtonClassName(true)}
          >
            <Camera size={20} />

            <span>
              گرفتن عکس
            </span>

            <input
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              disabled={disabled}
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Selected Images */}
      {images.length > 0 && (
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">
              تصاویر شما
            </p>

            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
              {images.length} تصویر انتخاب شده
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-3">
            {images.map((image, index) => (
              <ImageCard
                key={`${image.name}-${image.lastModified}-${index}`}
                image={image}
                index={index}
                status={imageStatuses[index]}
                onPreview={setPreviewImage}
                onRemove={handleImageRemove}
                onEdit={() => onEdit(image)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Preview Modal */}
      <ImagePreviewModal
        image={previewData}
        onClose={() => setPreviewImage(null)}
      />
    </section>
  )
}

export default ImageUploader