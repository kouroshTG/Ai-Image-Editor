import { Maximize2 } from 'lucide-react'

function ImageResultCard({
  result,
  index,
  onPreview,
}) {
  const {
    originalImage,
    originalImageUrl,
    editedImage,
  } = result

  const getOriginalImageSrc = () => {
    if (originalImageUrl) {
      return originalImageUrl
    }

    if (typeof originalImage === 'string') {
      return originalImage
    }

    return ''
  }

  const originalSrc =
    getOriginalImageSrc()

  const handleOriginalPreview = () => {
    if (!originalSrc) {
      return
    }

    onPreview({
      src: originalSrc,
      title: `تصویر اصلی ${index + 1}`,
    })
  }

  const handleEditedPreview = () => {
    if (!editedImage) {
      return
    }

    onPreview({
      src: editedImage,
      title: `تصویر ویرایش‌شده ${index + 1}`,
    })
  }

  return (
    <article className="overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-lg shadow-purple-100/40 transition-shadow duration-300 hover:shadow-xl hover:shadow-purple-100/60">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-purple-100 bg-gradient-to-l from-purple-50/80 to-white px-4 py-4 sm:px-5">
        <div>
          <p className="text-xs font-medium text-purple-500">
            نتیجه ویرایش
          </p>

          <h3 className="mt-1 text-sm font-bold text-gray-900 sm:text-base">
            تصویر {index + 1}
          </h3>
        </div>

        <span className="rounded-full border border-purple-100 bg-white px-3 py-1.5 text-xs font-semibold text-purple-600 shadow-sm">
          {editedImage
            ? 'ویرایش شده'
            : 'در انتظار پردازش'}
        </span>
      </div>

      {/* Images */}
      <div className="grid grid-cols-1 gap-px bg-purple-100 md:grid-cols-2">
        {/* Original */}
        <div className="bg-white p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800">
                تصویر اصلی
              </p>

              <p className="mt-0.5 text-xs text-gray-400">
                قبل از ویرایش
              </p>
            </div>

            <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-500">
              Original
            </span>
          </div>

          {originalSrc ? (
            <button
              type="button"
              onClick={handleOriginalPreview}
              className="group relative block w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50"
            >
              <img
                src={originalSrc}
                alt={`تصویر اصلی ${index + 1}`}
                className="aspect-video w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
              />

              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/20">
                <div className="flex translate-y-2 items-center gap-2 rounded-xl bg-black/70 px-3 py-2 text-xs font-medium text-white opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <Maximize2 size={15} />
                  نمایش بزرگ
                </div>
              </div>
            </button>
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50">
              <p className="text-xs text-gray-400">
                تصویر اصلی موجود نیست
              </p>
            </div>
          )}
        </div>

        {/* Edited */}
        <div className="bg-white p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800">
                تصویر ویرایش‌شده
              </p>

              <p className="mt-0.5 text-xs text-gray-400">
                نتیجه پردازش هوش مصنوعی
              </p>
            </div>

            <span className="rounded-lg bg-purple-50 px-2.5 py-1 text-[11px] font-medium text-purple-600">
              Edited
            </span>
          </div>

          {editedImage ? (
            <button
              type="button"
              onClick={handleEditedPreview}
              className="group relative block w-full overflow-hidden rounded-2xl border border-purple-100 bg-purple-50/30"
            >
              <img
                src={editedImage}
                alt={`تصویر ویرایش‌شده ${index + 1}`}
                className="aspect-video w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
              />

              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/20">
                <div className="flex translate-y-2 items-center gap-2 rounded-xl bg-black/70 px-3 py-2 text-xs font-medium text-white opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <Maximize2 size={15} />
                  نمایش بزرگ
                </div>
              </div>
            </button>
          ) : (
            <div className="flex aspect-video flex-col items-center justify-center rounded-2xl border border-dashed border-purple-200 bg-purple-50/40 px-4 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-100">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
              </div>

              <p className="mt-3 text-sm font-medium text-purple-600">
                در حال آماده‌سازی تصویر
              </p>

              <p className="mt-1 text-xs text-gray-400">
                نتیجه پس از پردازش نمایش داده می‌شود
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

export default ImageResultCard