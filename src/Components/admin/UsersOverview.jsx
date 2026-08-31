import {
  Eye,
  History,
  Search,
  Shield,
  ShieldCheck,
  Trash2,
  UserRound,
  Users,
} from 'lucide-react'

import { formatDate } from '../../utils/adminHelpers'

const STAT_TONE_CLASSES = {
  purple: 'bg-purple-100 text-purple-600',
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
}

function StatCard({ label, value, icon, tone }) {
  return (
    <div className="rounded-3xl border border-purple-100 bg-white p-5 shadow-lg shadow-purple-100/40">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${STAT_TONE_CLASSES[tone]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}

function RoleBadge({ role, size = 'md' }) {
  const isAdmin = role === 'admin'
  const sizeClasses =
    size === 'sm' ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1 text-xs'
  const toneClasses = isAdmin
    ? 'bg-green-100 text-green-700'
    : 'bg-gray-100 text-gray-600'

  return (
    <span className={`rounded-full font-semibold ${sizeClasses} ${toneClasses}`}>
      {isAdmin ? 'Admin' : 'User'}
    </span>
  )
}

function UserActionButtons({
  user,
  adminId,
  actionLoading,
  onViewUser,
  onViewHistory,
  onChangeRole,
  onDeleteUser,
  variant = 'desktop',
}) {
  const isRoleOrDeleteDisabled = user._id === adminId || actionLoading

  if (variant === 'mobile') {
    return (
      <div className="mt-4 grid grid-cols-4 gap-2 border-t border-gray-200 pt-3">
        <button
          type="button"
          onClick={() => onViewUser(user._id)}
          className="flex items-center justify-center gap-1 rounded-xl bg-blue-50 px-2 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
        >
          <Eye size={15} />
          جزئیات
        </button>

        <button
          type="button"
          onClick={() => onViewHistory(user)}
          className="flex items-center justify-center gap-1 rounded-xl bg-indigo-50 px-2 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100"
        >
          <History size={15} />
          تاریخچه
        </button>

        <button
          type="button"
          onClick={() => onChangeRole(user)}
          disabled={isRoleOrDeleteDisabled}
          className="flex items-center justify-center rounded-xl bg-purple-50 px-2 py-2 text-purple-600 transition hover:bg-purple-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Shield size={15} />
        </button>

        <button
          type="button"
          onClick={() => onDeleteUser(user)}
          disabled={isRoleOrDeleteDisabled}
          className="flex items-center justify-center rounded-xl bg-red-50 px-2 py-2 text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Trash2 size={15} />
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onViewUser(user._id)}
        className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
        title="مشاهده جزئیات"
      >
        <Eye size={17} />
      </button>

      <button
        type="button"
        onClick={() => onViewHistory(user)}
        className="rounded-lg p-2 text-indigo-600 transition hover:bg-indigo-50"
        title="مشاهده تاریخچه"
      >
        <History size={17} />
      </button>

      <button
        type="button"
        onClick={() => onChangeRole(user)}
        disabled={isRoleOrDeleteDisabled}
        className="rounded-lg p-2 text-purple-600 transition hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-40"
        title={user.role === 'admin' ? 'تبدیل به کاربر' : 'تبدیل به مدیر'}
      >
        <Shield size={17} />
      </button>

      <button
        type="button"
        onClick={() => onDeleteUser(user)}
        disabled={isRoleOrDeleteDisabled}
        className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
        title="حذف کاربر"
      >
        <Trash2 size={17} />
      </button>
    </div>
  )
}

export default function UsersOverview({
  admin,
  users,
  adminCount,
  userCount,
  searchTerm,
  onSearchChange,
  filteredUsers,
  actionLoading,
  onViewUser,
  onViewHistory,
  onChangeRole,
  onDeleteUser,
}) {
  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Header */}
      <header className="mb-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-purple-300 px-4 py-2 text-sm font-semibold text-black shadow-lg shadow-purple-400/40">
          پنل مدیریت
        </span>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          داشبورد مدیریت
        </h1>

        <p className="mt-2 text-sm text-gray-600 sm:text-base">
          مدیریت کاربران و مشاهده اطلاعات سیستم
        </p>
      </header>

      {/* Admin Info */}
      <section className="mb-6 rounded-3xl border border-purple-100 bg-white p-5 shadow-lg shadow-purple-100/50 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
              <ShieldCheck size={25} />
            </div>

            <div>
              <p className="text-xs text-gray-400">مدیر واردشده</p>
              <h2 className="mt-1 text-base font-bold text-gray-900">
                {admin?.name || 'مدیر'}
              </h2>
            </div>
          </div>

          <span className="w-fit rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700">
            مدیر سیستم
          </span>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="کل کاربران"
          value={users.length}
          icon={<Users size={24} />}
          tone="purple"
        />
        <StatCard
          label="کاربران عادی"
          value={userCount}
          icon={<UserRound size={24} />}
          tone="blue"
        />
        <StatCard
          label="مدیران"
          value={adminCount}
          icon={<ShieldCheck size={24} />}
          tone="green"
        />
      </section>

      {/* Users */}
      <section className="mt-6 overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-lg shadow-purple-100/40">
        <div className="border-b border-purple-100 px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">کاربران</h2>
              <p className="mt-1 text-sm text-gray-500">
                لیست کاربران ثبت‌نام‌شده در سیستم
              </p>
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Search
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="جستجوی نام یا شماره تلفن..."
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-10 pl-4 text-sm text-gray-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              />
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-right">
            <thead className="bg-purple-50/60">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500">
                  #
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500">
                  نام
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500">
                  شماره تلفن
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500">
                  نقش
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500">
                  تاریخ ثبت‌نام
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500">
                  عملیات
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user, index) => (
                <tr
                  key={user._id}
                  className="transition hover:bg-purple-50/30"
                >
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {index + 1}
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-800">
                      {user.name}
                    </span>
                  </td>

                  <td dir="ltr" className="px-6 py-4 text-sm text-gray-600">
                    {user.phone}
                  </td>

                  <td className="px-6 py-4">
                    <RoleBadge role={user.role} />
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>

                  <td className="px-6 py-4">
                    <UserActionButtons
                      user={user}
                      adminId={admin?._id}
                      actionLoading={actionLoading}
                      onViewUser={onViewUser}
                      onViewHistory={onViewHistory}
                      onChangeRole={onChangeRole}
                      onDeleteUser={onDeleteUser}
                      variant="desktop"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Users */}
        <div className="space-y-3 p-4 md:hidden">
          {filteredUsers.map((user, index) => (
            <div
              key={user._id}
              className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-gray-400">کاربر {index + 1}</p>
                  <p className="mt-1 text-sm font-bold text-gray-800">
                    {user.name}
                  </p>
                </div>

                <RoleBadge role={user.role} size="sm" />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-gray-400">شماره تلفن</p>
                  <p dir="ltr" className="mt-1 text-gray-700">
                    {user.phone}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">تاریخ ثبت‌نام</p>
                  <p className="mt-1 text-gray-700">
                    {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>

              <UserActionButtons
                user={user}
                adminId={admin?._id}
                actionLoading={actionLoading}
                onViewUser={onViewUser}
                onViewHistory={onViewHistory}
                onChangeRole={onChangeRole}
                onDeleteUser={onDeleteUser}
                variant="mobile"
              />
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="px-6 py-12 text-center text-sm text-gray-400">
            {searchTerm
              ? 'کاربری با این مشخصات پیدا نشد.'
              : 'هنوز کاربری ثبت‌نام نکرده است.'}
          </div>
        )}
      </section>
    </div>
  )
}