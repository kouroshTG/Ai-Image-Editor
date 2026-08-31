import {
  RotateCw,
} from 'lucide-react'

function EditorControls({
  activeTool,
  brightness,
  onBrightnessChange,
  hue,
  onHueChange,
  onRotate,
}) {
  if (activeTool === 'brightness') {
    return (
      <div className="mt-4 rounded-2xl bg-gray-50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700">
            میزان نور
          </p>

          <span className="text-xs text-gray-500">
            {brightness}
          </span>
        </div>

        <input
          type="range"
          min="-50"
          max="50"
          value={brightness}
          onChange={(event) =>
            onBrightnessChange(
              Number(event.target.value),
            )
          }
          className="w-full accent-purple-600"
        />
      </div>
    )
  }

  if (activeTool === 'color') {
    return (
      <div className="mt-4 rounded-2xl bg-gray-50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700">
            تغییر رنگ
          </p>

          <span className="text-xs text-gray-500">
            {hue}°
          </span>
        </div>

        <input
          type="range"
          min="-180"
          max="180"
          step="1"
          value={hue}
          onChange={(event) =>
            onHueChange(
              Number(event.target.value),
            )
          }
          className="w-full accent-purple-600"
        />
      </div>
    )
  }

  if (activeTool === 'rotate') {
    return (
      <div className="mt-4 flex justify-center rounded-2xl bg-gray-50 p-4">
        <button
          type="button"
          onClick={onRotate}
          className="flex items-center gap-2 rounded-xl bg-purple-100 px-4 py-2 text-sm font-medium text-purple-600 transition hover:bg-purple-200"
        >
          <RotateCw size={16} />

          چرخش ۹۰ درجه
        </button>
      </div>
    )
  }

  return null
}

export default EditorControls