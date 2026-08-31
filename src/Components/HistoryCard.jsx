import {
  CalendarDays,
  Maximize2,
  Trash2,
} from 'lucide-react'

function formatDate(date) {
  if (!date) {
    return 'تاریخ نامشخص'
  }

  return new Intl.DateTimeFormat(
    'fa-IR',
    {
      dateStyle: 'medium',
      timeStyle: 'short',
    },
  ).format(new Date(date))
}

function HistoryCard({
  item,
  onPreview,
  onDelete,
}) {
  const {
    originalImage,
    editedImage,
    prompt,
    createdAt,
  } = item

  const handlePreview = (
    image,
    title,
  ) => {
    if (!image) {
      return
    }

    onPreview({
      src: image,
      title,
    })
  }

  const handleDelete = () => {
  if (!onDelete) {
    return
  }

  onDelete(item._id)
}

  return (
    <article className="overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-lg shadow-purple-100/40 transition-shadow duration-300 hover:shadow-xl hover:shadow-purple-100/60">
      {/* Header */}
      <div className="border-b border-purple-100 bg-gradient-to-l from-purple-50/80 to-white px-4 py-4 sm:px-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-purple-500">
              ویرایش تصویر
            </p>

            <h2 className="mt-1 text-sm font-bold text-gray-900 sm:text-base">
              نتیجه پردازش هوش مصنوعی
            </h2>
          </div>

         <div className="flex shrink-0 items-center gap-2">
          {/* Date */}
          <div className="flex items-center gap-1.5 rounded-full border border-purple-100 bg-white px-2.5 py-1.5 text-[11px] font-medium text-gray-500 shadow-sm">
            <CalendarDays size={13} />

            <span>
              {formatDate(createdAt)}
            </span>
          </div>

          {/* Delete */}
          <button
            type="button"
            onClick={handleDelete}
            aria-label="حذف این ویرایش"
            title="حذف این ویرایش"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-500 transition-colors hover:bg-red-100 hover:text-red-600"
          >
            <Trash2 size={16} />
          </button>
        </div>
        </div>
      </div>

      {/* Images */}
    <div className="relative">
  

  {/* Images */}
  <div className="grid grid-cols-1 gap-px bg-purple-100 sm:grid-cols-2">
    <ImageBox
      image={originalImage}
      title="تصویر اصلی"
      subtitle="قبل از ویرایش"
      badge="Original"
      onPreview={() =>
        handlePreview(
          originalImage,
          'تصویر اصلی',
        )
      }
    />

    <ImageBox
      image={editedImage}
      title="تصویر ویرایش‌شده"
      subtitle="نتیجه نهایی"
      badge="Edited"
      edited
      onPreview={() =>
        handlePreview(
          editedImage,
          'تصویر ویرایش‌شده',
        )
      }
    />
  </div>
</div>

      {/* Prompt */}
      <div className="border-t border-purple-100 bg-white p-4 sm:p-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-800">
            پرامپت استفاده‌شده
          </p>

          <span className="rounded-lg bg-purple-50 px-2.5 py-1 text-[11px] font-medium text-purple-600">
            Prompt
          </span>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
          <p
            dir="ltr"
            className="max-h-32 overflow-y-auto whitespace-pre-wrap break-words text-left text-xs leading-6 text-gray-600"
          >
            {prompt || 'پرامپتی ثبت نشده است.'}
          </p>
        </div>
      </div>
    </article>
  )
}

function ImageBox({
  image,
  title,
  subtitle,
  badge,
  edited = false,
  onPreview,
}) {
  const badgeClassName = edited
    ? 'bg-purple-50 text-purple-600'
    : 'bg-gray-100 text-gray-500'

  return (
    <div className="bg-white p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-800">
            {title}
          </p>

          <p className="mt-0.5 text-xs text-gray-400">
            {subtitle}
          </p>
        </div>

        <span
          className={`rounded-lg px-2.5 py-1 text-[11px] font-medium ${badgeClassName}`}
        >
          {badge}
        </span>
      </div>

      <button
        type="button"
        onClick={onPreview}
        disabled={!image}
        className="group relative block aspect-video w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 disabled:cursor-default"
      >
        {image ? (
          <>
            <img
              src={image}
              alt={title}
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
            />

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/20">
              <div className="flex translate-y-2 items-center gap-2 rounded-xl bg-black/70 px-3 py-2 text-xs font-medium text-white opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <Maximize2 size={15} />
                نمایش بزرگ
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-gray-400">
            تصویر موجود نیست
          </div>
        )}
      </button>
    </div>
  )
}

export default HistoryCard