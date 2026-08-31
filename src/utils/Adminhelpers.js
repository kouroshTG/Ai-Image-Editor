const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'


export function getImageUrl(image, fileName, folder) {
  if (image) {
    if (
      image.startsWith('http://') ||
      image.startsWith('https://') ||
      image.startsWith('data:')
    ) {
      return image
    }

    if (image.startsWith('/')) {
      return `${BACKEND_URL}${image}`
    }

    return `${BACKEND_URL}/${image}`
  }

  if (!fileName) {
    return ''
  }

  return `${BACKEND_URL}/uploads/${folder}/${encodeURIComponent(fileName)}`
}


export function formatDate(dateString) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('fa-IR')
}