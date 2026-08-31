import { useEffect, useState } from 'react'
import {
  Crop,
  Sun,
  Palette,
  RotateCw,
  RotateCcw,
  X,
} from 'lucide-react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { renderEditedImage } from '../../utils/renderEditedImage'
import EditorToolbar from './EditorToolbar'
import EditorControls from './EditorControls'
import EditorActions from './EditorActions'

const tools = [
  {
    id: 'crop',
    label: 'کراپ',
    icon: Crop,
  },
  {
    id: 'brightness',
    label: 'نور',
    icon: Sun,
  },
  {
    id: 'color',
    label: 'رنگ',
    icon: Palette,
  },
  {
    id: 'rotate',
    label: 'چرخش',
    icon: RotateCw,
  },
]


function ImageEditor({ 
  image, 
  onClose,
  onSave,
 }) {
 
  const [imageUrl, setImageUrl] = useState('')
  const [activeTool, setActiveTool] = useState(null)

  const [crop, setCrop] = useState({
    unit: '%',
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  })

  const [cropComplete, setCropComplete] =
    useState(null)

  const [rotation, setRotation] = useState(0)
  const [brightness, setBrightness] = useState(0)
  const [hue, setHue] = useState(0)

  const [isSaving, setIsSaving] = useState(false)

  const [previewUrl, setPreviewUrl] =
  useState('')

  useEffect(() => {
  if (!image) return

  const url = URL.createObjectURL(image)

  setImageUrl(url)

  setCrop({
    unit: '%',
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  })

  setCropComplete(null)
  setRotation(0)
  setBrightness(0)
  setHue(0)
  setActiveTool(null)

  return () => {
    URL.revokeObjectURL(url)
  }
}, [image])

 const handleSave = async () => {
  if (!imageUrl) {
    return
  }

  try {
    setIsSaving(true)

    const image = new Image()

    image.src = imageUrl

    await new Promise((resolve, reject) => {
      image.onload = resolve
      image.onerror = reject
    })

    const finalCrop = cropComplete || {
      unit: '%',
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    }

    const result =
      await renderEditedImage({
        imageSrc: imageUrl,
        crop: finalCrop,
        imageWidth: image.naturalWidth,
        imageHeight: image.naturalHeight,
        rotation,
        brightness,
        hue,
      })

    onSave(result.file)
    onClose()
  } catch (error) {
    console.error(
      'Save image error:',
      error,
    )
  } finally {
    setIsSaving(false)
  }
}

const handleReset = () => {
  setCrop({
    unit: '%',
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  })

  setCropComplete(null)
  setRotation(0)
  setBrightness(0)
  setHue(0)
  setActiveTool(null)
}

useEffect(() => {
  if (!imageUrl) return

  let cancelled = false
  let generatedUrl = null

  const updatePreview = async () => {
    try {
      const finalCrop = cropComplete || {
        unit: '%',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      }

      const imageElement =
        new Image()

      imageElement.src = imageUrl

      await new Promise(
        (resolve, reject) => {
          imageElement.onload = resolve
          imageElement.onerror = reject
        },
      )

      const result =
        await renderEditedImage({
          imageSrc: imageUrl,
          crop: finalCrop,
          imageWidth:
            imageElement.naturalWidth,
          imageHeight:
            imageElement.naturalHeight,
          rotation,
          brightness,
          hue,
        })

      if (cancelled) {
        URL.revokeObjectURL(result.url)
        return
      }

      generatedUrl = result.url

      setPreviewUrl(result.url)
    } catch (error) {
      console.error(
        'Preview error:',
        error,
      )
    }
  }

  updatePreview()

  return () => {
    cancelled = true

    if (generatedUrl) {
      URL.revokeObjectURL(generatedUrl)
    }
  }
}, [
  imageUrl,
  cropComplete,
  rotation,
  brightness,
  hue,
])

const imageFilter = `
  brightness(${100 + brightness}%)
  hue-rotate(${hue}deg)
`

const hasChanges =
  rotation !== 0 ||
  brightness !== 0 ||
  hue !== 0 ||
  cropComplete !== null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      dir="rtl"
    >
      <div className="flex max-h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:rounded-3xl">

        {/* Header */}
        <header className="flex items-center justify-between border-b border-gray-100 px-4 py-3 sm:px-5 sm:py-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              ویرایش عکس
            </h2>

            <p className="mt-0.5 text-xs text-gray-500">
              تصویر خود را ویرایش کنید
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-800"
            aria-label="بستن"
          >
            <X size={18} />
          </button>
        </header>

        {/* Image Preview */}
       <div className="flex min-h-[280px] flex-1 items-center justify-center overflow-hidden bg-gray-950 p-3 sm:min-h-[350px] sm:p-6">

          {imageUrl && activeTool === 'crop' ? (
            <div className="flex max-h-[55vh] max-w-full items-center justify-center">

             <ReactCrop
              crop={crop}
              onChange={(newCrop) => setCrop(newCrop)}
              onComplete={(completedCrop) =>
                setCropComplete(completedCrop)
              }
            >
             <img
              src={imageUrl}
              alt="تصویر برای ویرایش"
              className="max-h-[45vh] max-w-full object-contain sm:max-h-[55vh]"
              style={{
                filter: imageFilter,
                
              }}
            />
            </ReactCrop>

            </div>
          ) : (
            imageUrl && (
              <img
                src={previewUrl || imageUrl}
                alt="تصویر برای ویرایش"
                className="max-h-[45vh] max-w-full object-contain sm:max-h-[55vh]"
              />
            )
          )}

        </div>

        {/* Tools */}
        <div className="border-t border-gray-100 bg-white p-4">
          
        <EditorToolbar
          tools={tools}
          activeTool={activeTool}
          onToolChange={setActiveTool}
        />

        <EditorControls
          activeTool={activeTool}
          brightness={brightness}
          onBrightnessChange={setBrightness}
          hue={hue}
          onHueChange={setHue}
          onRotate={() =>
            setRotation(
              (current) => current + 90,
            )
          }
        />
          <EditorActions
          isSaving={isSaving}
          hasChanges={hasChanges}
          onReset={handleReset}
          onCancel={onClose}
          onSave={handleSave}
        />

        </div>
      </div>
    </div>
  )
}

export default ImageEditor