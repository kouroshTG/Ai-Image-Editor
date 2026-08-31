import { apiRequest } from './apiClient'

// ====================
// Register User
// ====================

export function registerUser({
  name,
  phone,
  password,
}) {
  return apiRequest(
    '/api/users',
    {
      method: 'POST',

      headers: {
        'Content-Type':
          'application/json',
      },

      body: JSON.stringify({
        name,
        phone,
        password,
      }),
    },
  )
}

// ====================
// Login User
// ====================

export function loginUser({
  phone,
  password,
}) {
  return apiRequest(
    '/api/users/login',
    {
      method: 'POST',

      headers: {
        'Content-Type':
          'application/json',
      },

      body: JSON.stringify({
        phone,
        password,
      }),
    },
  )
}

// ====================
// Get Current User
// ====================

export function getCurrentUser() {
  return apiRequest(
    '/api/auth/me',
    {
      method: 'GET',
    },
  )
}

// ====================
// Logout User
// ====================

export function logoutUser() {
  return apiRequest(
    '/api/auth/logout',
    {
      method: 'POST',
    },
  )
}