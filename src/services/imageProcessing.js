import {
  editImage,
  uploadOriginalImage,
  saveEditHistory,
} from './api/imageapi'

// ====================
// Process Image
// ====================

export async function processImage({
  image,
  prompt,
}) {
  // ====================
  // 1. Save original image
  // ====================

  const originalResult =
    await uploadOriginalImage(image)

  // ====================
  // 2. Edit + Save image
  // ====================

  const editedResult =
    await editImage({
      image,
      prompt,
      model: 'gpt-image-1-mini',
    })

  if (
    !editedResult?.imageUrl ||
    !editedResult?.fileName
  ) {
    throw new Error(
      'Edited image was not saved correctly.',
    )
  }

  // ====================
  // 3. Save history
  // ====================

  await saveEditHistory({
    originalImage:
      originalResult.imageUrl,

    originalFileName:
      originalResult.fileName,

    editedImage:
      editedResult.imageUrl,

    editedFileName:
      editedResult.fileName,

    prompt,
  })

  // ====================
  // 4. Return result
  // ====================

  return {
    originalImage: image,

    originalImageUrl:
      originalResult.imageUrl,

    editedImage:
      editedResult.imageUrl,

    prompt,
  }
}