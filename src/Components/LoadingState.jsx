function LoadingState({ message }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="flex w-full max-w-md items-center gap-4 rounded-2xl border border-purple-100 bg-gradient-to-l from-purple-50 to-violet-50 px-5 py-5 shadow-2xl">
        <div className="relative h-10 w-10 shrink-0">
          <span className="absolute inset-0 animate-ping rounded-full bg-purple-400/50" />

          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-purple-600">
            <svg
              className="h-5 w-5 animate-spin text-white"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />

              <path
                className="opacity-90"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          </span>
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-purple-700">
            {message}
          </p>

          <p className="mt-0.5 text-xs text-purple-400">
            این فرآیند ممکن است چند ثانیه طول بکشد
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoadingState