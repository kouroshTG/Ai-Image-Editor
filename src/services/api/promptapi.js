import { apiRequest } from './apiClient'

// ====================
// Generate Prompt
// ====================

export function generatePrompt(
  prompt,
) {
  return apiRequest(
    '/api/generate-prompt',
    {
      method: 'POST',

      headers: {
        'Content-Type':
          'application/json',
      },

      body: JSON.stringify({
        prompt,
      }),
    },
  )
}