import { useEffect, useState } from 'react'
import { Trash2, LoaderCircle, } from 'lucide-react'

function ImageCard({
  image,
  index,
  onEdit,
  status,
  onPreview,
  onRemove,
}) {
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    const url = URL.createObjectURL(image)

    setImageUrl(url)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [image])



  return (
    <div className="group relative overflow-hidden rounded-2xl border-2 border-purple-500 bg-white shadow-md shadow-purple-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      
     
      {/* Selected Indicator */}
      <div className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white shadow-md">
        ✓
      </div>

      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={`تصویر ${index + 1}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}

        {/* در حال پردازش */}
        {status === 'processing' && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-lg">
              <LoaderCircle
                size={16}
                className="animate-spin text-purple-600"
              />

              در حال پردازش...
            </div>
          </div>
        )}

        {/* موفق */}
        {status === 'success' && (
          <div className="absolute bottom-2 left-2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-green-500 text-white shadow-md">
            ✓
          </div>
        )}

        {/* خطا */}
        {status === 'error' && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-red-500/20 backdrop-blur-[2px]">
            <div className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-red-600 shadow-lg">
              خطا در پردازش
            </div>
          </div>
        )}
      </div>

      {/* Preview */}
      <button
        type="button"
        onClick={() => onPreview(image)}
        className="absolute bottom-14 left-2 rounded-lg bg-black/60 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 backdrop-blur transition-opacity duration-200 group-hover:opacity-100"
      >
        نمایش
      </button>

      {/* Remove */}
      <button
        type="button"
        onClick={() => onRemove(image)}
        className="absolute left-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/90 text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-red-600"
        aria-label={`حذف تصویر ${index + 1}`}
      >
        <Trash2 size={16} />
      </button>

      {/* Info */}
      <div className="flex items-center justify-between px-3 py-2.5">
      <div>
        <p className="truncate text-xs font-medium text-gray-700">
          تصویر {index + 1}
        </p>

        <p className="mt-0.5 text-[11px] text-purple-500">
          برای ویرایش انتخاب شده
        </p>
      </div>

      <button
        type="button"
        onClick={onEdit}
        className="rounded-full bg-purple-500 px-2.5 py-1 text-[10px] font-semibold text-white transition hover:bg-purple-600"
      >
        ویرایش
      </button>

    </div>
    </div>
  )
}

export default ImageCard