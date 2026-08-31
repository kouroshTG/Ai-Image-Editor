import { RotateCcw } from 'lucide-react'

function EditorActions({
  isSaving,
  hasChanges,
  onReset,
  onCancel,
  onSave,
}) {
  return (
    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-3">
      <button
        type="button"
        onClick={onReset}
        disabled={!hasChanges}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-1"
      >
        <RotateCcw size={16} />

        بازنشانی تغییرات
      </button>

      <button
        type="button"
        onClick={onCancel}
        className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
      >
        لغو
      </button>

      <button
        type="button"
        onClick={onSave}
        disabled={isSaving}
        className="flex-1 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSaving
          ? 'در حال ذخیره...'
          : 'ذخیره تغییرات'}
      </button>
    </div>
  )
}

export default EditorActions