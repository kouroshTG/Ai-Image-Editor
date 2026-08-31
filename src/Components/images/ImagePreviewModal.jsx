import { useEffect } from 'react'
import { Maximize2, X } from 'lucide-react'

function ImagePreviewModal({
  image,
  onClose,
}) {
  useEffect(() => {
    if (!image) {
      return
    }

    const previousOverflow =
      document.body.style.overflow

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener(
      'keydown',
      handleKeyDown,
    )

    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown,
      )

      document.body.style.overflow =
        previousOverflow
    }
  }, [image, onClose])

  if (!image?.src) {
    return null
  }

  const handleBackdropClick = (event) => {
    if (
      event.target === event.currentTarget
    ) {
      onClose()
    }
  }

  return (
    <div
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-label="پیش‌نمایش تصویر"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-6"
    >
      <div className="relative flex h-full w-full max-w-7xl items-center justify-center">
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="بستن پیش‌نمایش"
          className="absolute right-0 top-0 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-lg transition hover:scale-105 hover:bg-white"
        >
          <X size={22} />
        </button>

        {/* Image Container */}
        <div className="relative flex max-h-[90vh] max-w-[95vw] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Title */}
          {image.title && (
            <div className="flex shrink-0 items-center gap-2 border-b border-gray-100 bg-white px-4 py-3">
              <Maximize2
                size={17}
                className="text-purple-600"
              />

              <p className="text-sm font-semibold text-gray-800">
                {image.title}
              </p>
            </div>
          )}

          {/* Image */}
          <div className="flex max-h-[calc(90vh-60px)] items-center justify-center overflow-auto bg-black p-2 sm:p-4">
            <img
              src={image.src}
              alt={
                image.title ||
                'پیش‌نمایش تصویر'
              }
              className="max-h-[calc(90vh-80px)] max-w-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImagePreviewModal