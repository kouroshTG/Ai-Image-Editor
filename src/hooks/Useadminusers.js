import { useEffect, useState } from 'react'

import {
  getAdminProfile,
  getAdminUsers,
  getAdminUserById,
  updateUserRole,
  deleteAdminUser,
  getAdminUserHistory,
  deleteAdminUserHistoryItem,
} from '../services/api/adminapi'


export default function useAdminUsers() {
  const [admin, setAdmin] = useState(null)
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const [selectedUser, setSelectedUser] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isDetailsLoading, setIsDetailsLoading] = useState(false)

  const [historyUser, setHistoryUser] = useState(null)
  const [userHistory, setUserHistory] = useState([])
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isHistoryLoading, setIsHistoryLoading] = useState(false)

  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        setIsLoading(true)
        setError('')

        const [profileResult, usersResult] = await Promise.all([
          getAdminProfile(),
          getAdminUsers(),
        ])

        setAdmin(profileResult?.user || null)
        setUsers(usersResult?.users || [])
      } catch (requestError) {
        console.error('Load admin data error:', requestError)
        setError(requestError.message || 'خطا در دریافت اطلاعات پنل مدیریت.')
      } finally {
        setIsLoading(false)
      }
    }

    loadAdminData()
  }, [])

  const adminCount = users.filter((user) => user.role === 'admin').length
  const userCount = users.filter((user) => user.role !== 'admin').length

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.trim().toLowerCase()

    if (!search) return true

    return (
      user.name?.toLowerCase().includes(search) ||
      user.phone?.toLowerCase().includes(search)
    )
  })

  const handleViewUser = async (userId) => {
    try {
      setIsDetailsLoading(true)
      setIsDetailsOpen(true)
      setSelectedUser(null)

      const result = await getAdminUserById(userId)
      setSelectedUser(result?.user || null)
    } catch (requestError) {
      console.error('Load user details error:', requestError)
      alert(requestError.message || 'خطا در دریافت اطلاعات کاربر.')
      setIsDetailsOpen(false)
    } finally {
      setIsDetailsLoading(false)
    }
  }

  const handleViewHistory = async (user) => {
    try {
      setIsHistoryLoading(true)
      setIsHistoryOpen(true)
      setHistoryUser(user)
      setUserHistory([])

      const result = await getAdminUserHistory(user._id)
      setHistoryUser(result?.user || user)
      setUserHistory(result?.history || [])
    } catch (requestError) {
      console.error('Load user history error:', requestError)
      alert(requestError.message || 'خطا در دریافت تاریخچه کاربر.')
      setIsHistoryOpen(false)
    } finally {
      setIsHistoryLoading(false)
    }
  }

  const handleDeleteHistoryItem = async (historyItem) => {
    if (!historyUser) return

    const confirmed = window.confirm(
      'آیا مطمئن هستید که می‌خواهید این رکورد تاریخچه را حذف کنید؟',
    )
    if (!confirmed) return

    try {
      setActionLoading(true)
      await deleteAdminUserHistoryItem(historyUser._id, historyItem._id)

      setUserHistory((previousHistory) =>
        previousHistory.filter((item) => item._id !== historyItem._id),
      )
    } catch (requestError) {
      console.error('Delete admin history item error:', requestError)
      alert(requestError.message || 'خطا در حذف رکورد تاریخچه.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleChangeRole = async (user) => {
    if (user._id === admin?._id) {
      alert('نمی‌توانید نقش حساب خودتان را تغییر دهید.')
      return
    }

    const newRole = user.role === 'admin' ? 'user' : 'admin'
    const newRoleLabel = newRole === 'admin' ? 'مدیر' : 'کاربر عادی'

    const confirmed = window.confirm(
      `آیا مطمئن هستید که نقش "${user.name}" به ${newRoleLabel} تغییر کند؟`,
    )
    if (!confirmed) return

    try {
      setActionLoading(true)
      const result = await updateUserRole(user._id, newRole)

      setUsers((previousUsers) =>
        previousUsers.map((previousUser) =>
          previousUser._id === user._id ? result.user : previousUser,
        ),
      )

      if (selectedUser?._id === user._id) setSelectedUser(result.user)
      if (historyUser?._id === user._id) setHistoryUser(result.user)
    } catch (requestError) {
      console.error('Change user role error:', requestError)
      alert(requestError.message || 'خطا در تغییر نقش کاربر.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteUser = async (user) => {
    if (user._id === admin?._id) {
      alert('نمی‌توانید حساب خودتان را حذف کنید.')
      return
    }

    const confirmed = window.confirm(
      `آیا مطمئن هستید که می‌خواهید کاربر "${user.name}" را حذف کنید؟\n\nتمام تاریخچه و تصاویر این کاربر نیز حذف خواهند شد.`,
    )
    if (!confirmed) return

    try {
      setActionLoading(true)
      await deleteAdminUser(user._id)

      setUsers((previousUsers) =>
        previousUsers.filter((previousUser) => previousUser._id !== user._id),
      )

      if (selectedUser?._id === user._id) {
        setSelectedUser(null)
        setIsDetailsOpen(false)
      }

      if (historyUser?._id === user._id) {
        setHistoryUser(null)
        setUserHistory([])
        setIsHistoryOpen(false)
      }
    } catch (requestError) {
      console.error('Delete user error:', requestError)
      alert(requestError.message || 'خطا در حذف کاربر.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleCloseDetails = () => {
    if (isDetailsLoading) return
    setIsDetailsOpen(false)
    setSelectedUser(null)
  }

  const handleCloseHistory = () => {
    if (isHistoryLoading) return
    setIsHistoryOpen(false)
    setHistoryUser(null)
    setUserHistory([])
  }

  return {
    admin,
    users,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    filteredUsers,
    adminCount,
    userCount,
    selectedUser,
    isDetailsOpen,
    isDetailsLoading,
    historyUser,
    userHistory,
    isHistoryOpen,
    isHistoryLoading,
    actionLoading,
    handleViewUser,
    handleViewHistory,
    handleDeleteHistoryItem,
    handleChangeRole,
    handleDeleteUser,
    handleCloseDetails,
    handleCloseHistory,
  }
}