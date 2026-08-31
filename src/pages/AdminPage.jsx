import useAdminUsers from '../hooks/useAdminUsers'
import UsersOverview from '../Components/admin/UsersOverview'
import { UserDetailsModal, UserHistoryModal } from '../Components/admin/UserModals'

function AdminPage() {
  const {
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
  } = useAdminUsers()

  if (isLoading) {
    return (
      <main
        dir="rtl"
        className="flex min-h-full items-center justify-center px-4"
      >
        <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-lg">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
          <span className="text-sm font-medium text-gray-700">
            در حال دریافت اطلاعات پنل...
          </span>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main
        dir="rtl"
        className="flex min-h-full items-center justify-center px-4"
      >
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-6 text-center shadow-lg">
          <h1 className="text-lg font-bold text-red-600">
            خطا در دریافت اطلاعات
          </h1>
          <p className="mt-2 text-sm text-gray-600">{error}</p>
        </div>
      </main>
    )
  }

  return (
    <main
      dir="rtl"
      className="relative h-full overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 md:px-8"
    >
      <UsersOverview
        admin={admin}
        users={users}
        adminCount={adminCount}
        userCount={userCount}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filteredUsers={filteredUsers}
        actionLoading={actionLoading}
        onViewUser={handleViewUser}
        onViewHistory={handleViewHistory}
        onChangeRole={handleChangeRole}
        onDeleteUser={handleDeleteUser}
      />

      <UserDetailsModal
        isOpen={isDetailsOpen}
        isLoading={isDetailsLoading}
        user={selectedUser}
        adminId={admin?._id}
        actionLoading={actionLoading}
        onClose={handleCloseDetails}
        onChangeRole={handleChangeRole}
        onViewHistory={handleViewHistory}
        onDeleteUser={handleDeleteUser}
      />

      <UserHistoryModal
        isOpen={isHistoryOpen}
        isLoading={isHistoryLoading}
        historyUser={historyUser}
        userHistory={userHistory}
        actionLoading={actionLoading}
        onClose={handleCloseHistory}
        onDeleteHistoryItem={handleDeleteHistoryItem}
      />
    </main>
  )
}

export default AdminPage