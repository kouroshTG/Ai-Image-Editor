import {
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react'

function LandingPage() {
  return (
    <section
      dir="rtl"
      className="relative h-full overflow-hidden"
    >
      {/* Background */}
      <div className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-purple-400/20 blur-3xl" />

      <div className="pointer-events-none absolute -left-32 bottom-10 h-96 w-96 rounded-full bg-violet-400/20 blur-3xl" />

      {/* Header Hint */}
<div className="pointer-events-none absolute left-0 top-[-20px] z-10 scale-75 sm:right-10 md:right-[calc(50%-2rem)]">
  <div className="relative flex flex-col items-center">

    <div className="rounded-xl border border-purple-200 bg-white/95 px-4 py-2 text-sm font-bold text-purple-700 shadow-lg">
      برای شروع، کلیک کنید.
    </div>

    <svg
      width="90"
      height="110"
      viewBox="0 0 90 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mt-1 text-purple-600"
    >
      {/* Curved arrow */}
      <path
        d="M15 105
           C15 75, 25 55, 45 40
           C58 30, 68 18, 70 5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Arrow head pointing UP */}
      <path
        d="M62 10L70 4L76 12"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>

  </div>
</div>

      {/* Hero */}
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/80 px-3 py-2 text-xs font-medium text-purple-700 shadow-sm backdrop-blur sm:px-4 sm:text-sm">
            <Sparkles size={16} />
            ابزار هوشمند و خلاقانه
          </div>

          {/* Title */}
          <h1 className="mt-5 max-w-4xl text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:mt-6 sm:text-5xl md:text-6xl">
            ویرایش تصاویر
            <span className="block bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
              ساده‌تر از همیشه
            </span>
          </h1>

          {/* Description */}
          <p className="mt-4 max-w-2xl font-bold leading-7 text-gray-700 sm:mt-6 sm:text-lg sm:leading-8">
            تصاویر خود را با ابزارهای هوشمند ویرایش کنید و با کمک فناوری
            هوش مصنوعی، ایده‌های خود را به تصاویر جذاب تبدیل کنید.
          </p>

          {/* Features */}
          <div className="mt-7 grid w-full max-w-2xl grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-3">

            <div className="rounded-2xl border border-purple-100 bg-white/70 p-4 shadow-sm backdrop-blur">
              <Zap
                className="mx-auto text-purple-600"
                size={22}
              />

              <p className="mt-3 text-sm font-semibold text-gray-800">
                سریع و ساده
              </p>
            </div>

            <div className="rounded-2xl border border-purple-100 bg-white/70 p-4 shadow-sm backdrop-blur">
              <ShieldCheck
                className="mx-auto text-purple-600"
                size={22}
              />

              <p className="mt-3 text-sm font-semibold text-gray-800">
                کیفیت و دقت بالا
              </p>
            </div>

            <div className="rounded-2xl border border-purple-100 bg-white/70 p-4 shadow-sm backdrop-blur">
              <Sparkles
                className="mx-auto text-purple-600"
                size={22}
              />

              <p className="mt-3 text-sm font-semibold text-gray-800">
                خلاقیت بدون محدودیت
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}

export default LandingPage