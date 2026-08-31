import { apiRequest } from './apiClient'
// ====================
// Edit Image
// ====================

export function editImage({
  image,
  prompt,
  model,
}) {
  const formData =
    new FormData()

  formData.append(
    'model',
    model,
  )

  formData.append(
    'image',
    image,
  )

  formData.append(
    'prompt',
    prompt,
  )

  return apiRequest(
    '/api/edit-image',
    {
      method: 'POST',
      body: formData,
    },
  )
}

// ====================
// Upload Original Image
// ====================

export function uploadOriginalImage(
  image,
) {
  const formData =
    new FormData()

  formData.append(
    'image',
    image,
  )

  return apiRequest(
    '/api/upload',
    {
      method: 'POST',
      body: formData,
    },
  )
}



// ====================
// Save Edit History
// ====================

export function saveEditHistory({
  originalImage,
  originalFileName,
  editedImage,
  editedFileName,
  prompt,
}) {
  return apiRequest(
    '/api/history',
    {
      method: 'POST',

      headers: {
        'Content-Type':
          'application/json',
      },

      body: JSON.stringify({
        originalImage,
        originalFileName,
        editedImage,
        editedFileName,
        prompt,
      }),
    },
  )
}

// ====================
// Get Edit History
// ====================

export function getEditHistory() {
  return apiRequest(
    '/api/history',
    {
      method: 'GET',
    },
  )
}

// ====================
// Delete One History
// ====================

export function deleteHistoryItem(
  historyId,
) {
  if (!historyId) {
    throw new Error(
      'History ID is required.',
    )
  }

  return apiRequest(
    `/api/history/item/${historyId}`,
    {
      method: 'DELETE',
    },
  )
}

// ====================
// Delete All History
// ====================

export function deleteAllHistory() {
  return apiRequest(
    '/api/history',
    {
      method: 'DELETE',
    },
  )
}