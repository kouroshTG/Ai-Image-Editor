import { apiRequest } from './apiClient'

// ====================
// Get Admin Profile
// ====================

export function getAdminProfile() {
  return apiRequest(
    '/api/admin/profile',
    {
      method: 'GET',
    },
  )
}

// ====================
// Get All Users
// ====================

export function getAdminUsers() {
  return apiRequest(
    '/api/admin/users',
    {
      method: 'GET',
    },
  )
}

// ====================
// Get User Details
// ====================

export function getAdminUserById(
  userId,
) {
  return apiRequest(
    `/api/admin/users/${userId}`,
    {
      method: 'GET',
    },
  )
}

// ====================
// Get User History
// ====================

export function getAdminUserHistory(
  userId,
) {
  return apiRequest(
    `/api/admin/users/${userId}/history`,
    {
      method: 'GET',
    },
  )
}

// ====================
// Delete User History Item
// ====================

export function deleteAdminUserHistoryItem(
  userId,
  historyId,
) {
  return apiRequest(
    `/api/admin/users/${userId}/history/${historyId}`,
    {
      method: 'DELETE',
    },
  )
}

// ====================
// Change User Role
// ====================

export function updateUserRole(
  userId,
  role,
) {
  return apiRequest(
    `/api/admin/users/${userId}/role`,
    {
      method: 'PATCH',

      headers: {
        'Content-Type':
          'application/json',
      },

      body: JSON.stringify({
        role,
      }),
    },
  )
}

// ====================
// Delete User
// ====================

export function deleteAdminUser(
  userId,
) {
  return apiRequest(
    `/api/admin/users/${userId}`,
    {
      method: 'DELETE',
    },
  )
}