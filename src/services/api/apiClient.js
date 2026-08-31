const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL

export async function apiRequest(
  endpoint,
  options = {},
) {
  const response =
    await fetch(
      `${BACKEND_URL}${endpoint}`,
      {
        credentials: 'include',
        ...options,
      },
    )

  const contentType =
    response.headers.get(
      'content-type',
    )

  const data =
    contentType?.includes(
      'application/json',
    )
      ? await response.json()
      : null

  if (!response.ok) {
    throw new Error(
      data?.message ||
        `Request failed: ${response.status}`,
    )
  }

  return data
}