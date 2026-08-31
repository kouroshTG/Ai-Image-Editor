import { History, Image as ImageIcon, Shield, Trash2, X } from 'lucide-react'

import { getImageUrl, formatDate } from '../../utils/adminHelpers'

export function UserDetailsModal({
  isOpen,
  isLoading,
  user,
  adminId,
  actionLoading,
  onClose,
  onChangeRole,
  onViewHistory,
  onDeleteUser,
}) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        dir="rtl"
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">جزئیات کاربر</h2>
            <p className="mt-1 text-xs text-gray-500">اطلاعات حساب کاربری</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
          </div>
        )}

        {!isLoading && user && (
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-purple-50 p-4">
              <p className="text-xs text-gray-400">نام</p>
              <p className="mt-1 font-bold text-gray-800">{user.name}</p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs text-gray-400">شماره تلفن</p>
              <p dir="ltr" className="mt-1 text-left font-medium text-gray-800">
                {user.phone}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs text-gray-400">نقش</p>
              <div className="mt-2">
                {user.role === 'admin' ? (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    مدیر
                  </span>
                ) : (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                    کاربر
                  </span>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs text-gray-400">تاریخ ثبت‌نام</p>
              <p className="mt-1 text-sm font-medium text-gray-800">
                {formatDate(user.createdAt)}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => onChangeRole(user)}
                disabled={user._id === adminId || actionLoading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:opacity-50"
              >
                <Shield size={17} />
                {user.role === 'admin' ? 'تبدیل به کاربر' : 'تبدیل به مدیر'}
              </button>

              <button
                type="button"
                onClick={() => onViewHistory(user)}
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-50 px-4 py-3 text-indigo-600 transition hover:bg-indigo-100"
              >
                <History size={18} />
              </button>

              <button
                type="button"
                onClick={() => onDeleteUser(user)}
                disabled={user._id === adminId || actionLoading}
                className="flex items-center justify-center rounded-xl bg-red-50 px-4 py-3 text-red-500 transition hover:bg-red-100 disabled:opacity-50"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ImageSlot({ label, url, tone }) {
  const isPurple = tone === 'purple'

  return (
    <div
      className={`overflow-hidden rounded-xl border bg-white ${
        isPurple ? 'border-purple-100' : 'border-gray-100'
      }`}
    >
      <div
        className={`px-2 py-2 text-center text-xs font-semibold ${
          isPurple ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'
        }`}
      >
        {label}
      </div>

      {url ? (
        <div
          className={`relative flex min-h-52 items-center justify-center ${
            isPurple ? 'bg-purple-50' : 'bg-gray-100'
          }`}
        >
          <img
            src={url}
            alt={label}
            className="max-h-64 w-full object-contain"
            onError={(event) => {
              event.currentTarget.style.display = 'none'
              const parent = event.currentTarget.parentElement
              if (parent) {
                parent.innerHTML =
                  '<div class="flex min-h-52 items-center justify-center text-xs text-gray-400">تصویر موجود نیست</div>'
              }
            }}
          />
        </div>
      ) : (
        <div
          className={`flex min-h-52 items-center justify-center text-xs text-gray-400 ${
            isPurple ? 'bg-purple-50' : 'bg-gray-100'
          }`}
        >
          تصویر موجود نیست
        </div>
      )}
    </div>
  )
}

function HistoryItemCard({ item, actionLoading, onDelete }) {
  const originalImageUrl = getImageUrl(
    item.originalImage,
    item.originalFileName,
    'original',
  )
  const editedImageUrl = getImageUrl(
    item.editedImage,
    item.editedFileName,
    'edited',
  )

  return (
    <div className="overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm">
      <div className="grid grid-cols-1 gap-3 bg-gray-50 p-3 sm:grid-cols-2">
        <ImageSlot label="تصویر اصلی" url={originalImageUrl} tone="gray" />
        <ImageSlot label="تصویر ویرایش‌شده" url={editedImageUrl} tone="purple" />
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">تاریخ ویرایش</p>
          <p className="text-xs font-medium text-gray-600">
            {formatDate(item.createdAt)}
          </p>
        </div>

        {item.prompt && (
          <div className="mt-4 rounded-xl bg-gray-50 p-3">
            <p className="text-xs font-semibold text-gray-400">پرامپت</p>
            <p
              dir="ltr"
              className="mt-2 max-h-32 overflow-y-auto whitespace-pre-wrap break-words text-left text-xs leading-6 text-gray-700"
            >
              {item.prompt}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={onDelete}
          disabled={actionLoading}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 size={16} />
          حذف این رکورد
        </button>
      </div>
    </div>
  )
}

export function UserHistoryModal({
  isOpen,
  isLoading,
  historyUser,
  userHistory,
  actionLoading,
  onClose,
  onDeleteHistoryItem,
}) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        dir="rtl"
        className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-purple-100 px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
              <History size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">تاریخچه کاربر</h2>
              <p className="mt-1 text-xs text-gray-500">
                {historyUser?.name || 'کاربر'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-5 sm:p-6">
          {isLoading && (
            <div className="flex min-h-64 flex-col items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
              <p className="mt-4 text-sm text-gray-500">
                در حال دریافت تاریخچه...
              </p>
            </div>
          )}

          {!isLoading && userHistory.length === 0 && (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-purple-200 bg-purple-50/30 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
                <ImageIcon size={25} />
              </div>

              <h3 className="mt-4 text-base font-bold text-gray-800">
                تاریخچه‌ای وجود ندارد
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                این کاربر هنوز تصویری ویرایش نکرده است.
              </p>
            </div>
          )}

          {!isLoading && userHistory.length > 0 && (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {userHistory.map((item) => (
                <HistoryItemCard
                  key={item._id}
                  item={item}
                  actionLoading={actionLoading}
                  onDelete={() => onDeleteHistoryItem(item)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}