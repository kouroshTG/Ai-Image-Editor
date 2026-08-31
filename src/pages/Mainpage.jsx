import { useState } from 'react'

import ImageUploader from '../Components/images/ImageUploader'
import ImageResults from '../Components/images/ImageResults'
import ImagePreviewModal from '../Components/images/ImagePreviewModal'
import PromptOptions from '../Components/PromptOptions'
import useImageEditor from '../hooks/useImageEditor'
import ImageEditor from '../Components/images/ImageEditor'


function MainPage() {
  const [previewImage, setPreviewImage] =
    useState(null)

  const [editingImage, setEditingImage] = 
    useState(null)

  const {
    category,
    setCategory,

    type,
    setType,

    optionOne,
    setOptionOne,

    optionTwo,
    setOptionTwo,

    optionThree,
    setOptionThree,

    description,
    setDescription,

    images,
    setImages,

    results,

    imageStatuses,

    isLoading,
    error,
    loadingMessage,

    isFormComplete,
    handleImageEdit,
  } = useImageEditor()

  const isEditDisabled =
    images.length === 0 ||
    !isFormComplete ||
    isLoading

  return (
    <main
      dir="rtl"
      className="h-full overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 md:px-8"
    >
      <div className="mx-auto w-full max-w-4xl px-2 sm:px-4">

        {/* Page Header */}
        <header className="mb-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-purple-300 px-4 py-2 text-base font-semibold text-black shadow-xl shadow-purple-400/50">
            پنل اصلی
          </span>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
            ثبت اطلاعات
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-gray-700 sm:text-base">
            اطلاعات مورد نیاز را تکمیل کنید.
          </p>
        </header>

        {/* Main Form */}
        <section className="space-y-5 rounded-3xl border border-purple-100/80 bg-white/95 p-4 text-gray-700 shadow-xl shadow-purple-500/50">

          {/* Prompt Options */}
          <PromptOptions
            category={category}
            setCategory={setCategory}
            type={type}
            setType={setType}
            optionOne={optionOne}
            setOptionOne={setOptionOne}
            optionTwo={optionTwo}
            setOptionTwo={setOptionTwo}
            optionThree={optionThree}
            setOptionThree={setOptionThree}
            description={description}
            setDescription={setDescription}
          />

          {/* Image Upload */}
          <ImageUploader
            images={images}
            onImagesChange={setImages}
            onEdit={setEditingImage}
            imageStatuses={imageStatuses}
            disabled={
              !isFormComplete ||
              isLoading
            }
          />

          {/* Edit Button */}
          <button
            type="button"
            onClick={handleImageEdit}
            disabled={isEditDisabled}
            className="w-full rounded-xl bg-purple-600 px-4 py-3 font-semibold text-white transition-all duration-200 hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading
              ? 'در حال پردازش...'
              : 'ویرایش تصاویر'}
          </button>

        

          {/* Error */}
          {error && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600"
            >
              {error}
            </p>
          )}

        {editingImage && (
        <ImageEditor
          image={editingImage}
          onSave={(editedImage) => {
            setImages((currentImages) =>
              currentImages.map((currentImage) =>
                currentImage === editingImage
                  ? editedImage
                  : currentImage
              )
            )
          }}
          onClose={() => setEditingImage(null)}
        />
      )}

        
          <ImageResults
            results={results}
            onPreview={setPreviewImage}
          />

          <ImagePreviewModal
            image={previewImage}
            onClose={() => setPreviewImage(null)}
          />
        </section>
      </div>
    </main>
  )
}

export default MainPage