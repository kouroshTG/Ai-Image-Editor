import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import HistoryCard from '../Components/HistoryCard'
import ImagePreviewModal from '../Components/images/ImagePreviewModal'
import useEditHistory from '../hooks/useEditHistory'

function HistoryPage() {
  const {
    history,
    isLoading,
    error,
    deleteItem,
    deleteAll,
  } = useEditHistory()

  const [preview, setPreview] = useState(null)

  const handlePreview = ({
    src,
    title,
  }) => {
    setPreview({
      src,
      title,
    })
  }

  const handleClosePreview = () => {
    setPreview(null)
  }

  const handleDeleteAll = async () => {
  try {
    await deleteAll()
  } catch (error) {
    console.error(
      'Delete all history error:',
      error,
    )
  }
}

  const handleDelete = async (historyId) => {
  try {
    await deleteItem(historyId)
  } catch (error) {
    console.error(
      'Delete history error:',
      error,
    )
  }
}

  return (
    <section
      dir="rtl"
      className="min-h-full px-4 py-6 sm:px-6 sm:py-8"
    >
      <div className="mx-auto w-full max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between space-y-6 gap-4">
            {/* Title */}
            <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-purple-300 px-4 py-2 text-base font-semibold text-black shadow-xl shadow-purple-400/50">
              تصاویر شما
            </p>

              <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                تاریخچه ویرایش‌ها
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                تصاویر ویرایش‌شده و پرامپت‌هایی که برای
                پردازش استفاده کرده‌اید را مشاهده کنید.
              </p>
            </div>

            {/* Delete All */}
            {!isLoading &&
              !error &&
              history.length > 0 && (
                <button
                  type="button"
                  onClick={handleDeleteAll}
                  className="flex shrink-0 items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 hover:text-red-700"
                >
                  <Trash2 size={17} />

                  پاک کردن تاریخچه
                </button>
              )}
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-purple-100 bg-white/90 px-6 shadow-lg shadow-purple-100/40">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-100 border-t-purple-600" />

            <p className="mt-4 text-sm font-medium text-purple-600">
              در حال دریافت تاریخچه...
            </p>
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-red-100 bg-white/90 px-6 text-center shadow-lg shadow-red-100/30">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
              !
            </div>

            <h2 className="mt-4 text-base font-bold text-gray-800">
              دریافت تاریخچه ناموفق بود
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {error}
            </p>
          </div>
        )}

        {/* Empty */}
        {!isLoading &&
          !error &&
          history.length === 0 && (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-purple-200 bg-white/80 px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-2xl">
                🖼️
              </div>

              <h2 className="mt-4 text-base font-bold text-gray-800">
                هنوز تاریخی وجود ندارد
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                اولین تصویر خود را ویرایش کنید تا
                نتیجه اینجا نمایش داده شود.
              </p>
            </div>
          )}

        {/* History List */}
        {!isLoading &&
          !error &&
          history.length > 0 && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {history.map((item) => (
                <HistoryCard
                  key={item._id}
                  item={item}
                  onPreview={handlePreview}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
      </div>

      {/* Preview */}
      {preview && (
  <ImagePreviewModal
    image={preview}
    onClose={handleClosePreview}
  />
)}
    </section>
  )
}

export default HistoryPage