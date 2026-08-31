import ImageResultCard from './ImageResultCard'

function ImageResults({
  results,
  onPreview,
}) {
  if (results.length === 0) {
    return null
  }

  return (
    <section className="space-y-6 pt-6">
      {/* Header */}
      <div className="border-b border-purple-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 rounded-full bg-gradient-to-b from-purple-600 to-violet-600" />

          <div>
            <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              نتایج ویرایش
            </h2>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              تصاویر اصلی و نسخه‌های ویرایش‌شده را مشاهده و مقایسه کنید.
            </p>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-5">
        {results.map((result, index) => (
          <ImageResultCard
            key={`${result.originalImage?.name || 'image'}-${index}`}
            result={result}
            index={index}
            onPreview={onPreview}
          />
        ))}
      </div>
    </section>
  )
}

export default ImageResults