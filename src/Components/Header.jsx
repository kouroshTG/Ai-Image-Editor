import { useEffect, useRef, useState } from 'react'
import logo from '../assets/logo.jpg'
import {
  History,
  Settings,
  LogOut,
  User,
  Home,
  ShieldCheck,
} from 'lucide-react'

function Header({
  onDemoClick,
  onAuthClick,
  onProfileClick,
  onHistoryClick,
  onLogout,
  onHomeClick,
  onAdminClick,
  showDemo,
  showAuth,
  showProfile,
  showAdmin,
}) {
  const [isProfileOpen, setIsProfileOpen] =
    useState(false)

  const [user, setUser] = useState(null)

  const profileMenuRef = useRef(null)

  useEffect(() => {
    const storedUser =
      localStorage.getItem('user')

    if (!storedUser) {
      setUser(null)
      return
    }

    try {
      setUser(JSON.parse(storedUser))
    } catch (error) {
      console.error(
        'Failed to parse user:',
        error,
      )

      setUser(null)
    }
  }, [isProfileOpen])

  // بستن Popup با کلیک بیرون
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(
          event.target,
        )
      ) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener(
      'mousedown',
      handleClickOutside,
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside,
      )
    }
  }, [])

  // بستن Popup با Escape
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener(
      'keydown',
      handleKeyDown,
    )

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown,
      )
    }
  }, [])

  const handleProfileClick = () => {
    setIsProfileOpen(
      (previous) => !previous,
    )

    if (onProfileClick) {
      onProfileClick()
    }
  }

  const handleAdminClick = () => {
    setIsProfileOpen(false)

    if (onAdminClick) {
      onAdminClick()
    }
  }

  const handleHistoryClick = () => {
    setIsProfileOpen(false)

    if (onHistoryClick) {
      onHistoryClick()
    }
  }

  const handleLogout = () => {
    setIsProfileOpen(false)

    if (onLogout) {
      onLogout()
    }
  }

  return (
    <header
      dir="rtl"
      className="relative z-20 shrink-0"
    >
      <div className="mx-4 my-4 flex max-w-4xl items-center justify-between gap-3 rounded-3xl border border-purple-300/80 px-4 py-4 shadow-xl shadow-purple-300/50 sm:mx-auto sm:px-6 sm:py-5 lg:px-8">

        {/* Logo */}
        <h2 className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-lg font-bold text-transparent sm:text-xl md:text-2xl">
          <div className='flex items-center gap-3'>
            <img src={logo} alt="Logo" className="w-10 h-10 rounded-lg object-contain"/>
             <span className="text-2xl font-semibold">
              modernio 
              </span>
          </div>
          
        </h2>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Auth */}
          {showAuth && (
            <button
              type="button"
              onClick={onAuthClick}
              className="rounded-xl border border-purple-200 bg-white px-3 py-2 text-xs font-semibold text-purple-700 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:border-purple-300 hover:shadow-md sm:px-5 sm:py-2.5 sm:text-sm"
            >
              ثبت نام / ورود
            </button>
          )}

          {/* Demo */}
          {showDemo && (
            <button
              type="button"
              onClick={onDemoClick}
              className="rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 px-3 py-2 text-xs font-semibold text-white shadow-md shadow-purple-200 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg sm:px-5 sm:py-2.5 sm:text-sm"
            >
              درخواست دمو
            </button>
          )}

          {/* Home */}
          {showProfile && (
            <button
              type="button"
              onClick={onHomeClick}
              className="flex items-center gap-2 rounded-xl border border-purple-200 bg-white px-3 py-2 text-xs font-semibold text-purple-700 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:border-purple-300 hover:bg-purple-50 hover:shadow-md sm:px-4 sm:py-2.5 sm:text-sm"
            >
              <Home size={17} />

              <span className="hidden sm:inline">
                خانه
              </span>
            </button>
          )}

          {/* Profile */}
          {showProfile && (
            <div
              ref={profileMenuRef}
              className="relative"
            >
              <button
                type="button"
                onClick={handleProfileClick}
                className="rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 px-3 py-2 text-xs font-semibold text-white shadow-md shadow-purple-200 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg sm:px-5 sm:py-2.5 sm:text-sm"
              >
                پروفایل کاربری
              </button>

              {/* Profile Popup */}
              {isProfileOpen && (
                <div className="absolute left-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-2xl shadow-purple-200/50">

                  {/* Profile Header */}
                  <div className="border-b border-gray-100 bg-purple-50/60 p-4">
                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                        <User size={20} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-gray-800">
                          {user?.name || 'کاربر'}
                        </p>

                        {user?.role === 'admin' && (
                          <p className="mt-0.5 text-xs font-medium text-purple-600">
                            مدیر سیستم
                          </p>
                        )}
                      </div>

                    </div>
                  </div>

                  {/* Menu */}
                  <div className="p-2">

                    {/* Admin Panel */}
                    {user?.role === 'admin' && (
                      <button
                        type="button"
                        onClick={handleAdminClick}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-purple-700 transition hover:bg-purple-50"
                      >
                        <ShieldCheck size={18} />

                        <span>
                          پنل مدیریت
                        </span>
                      </button>
                    )}

                    {/* History */}
                    <button
                      type="button"
                      onClick={handleHistoryClick}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-purple-50 hover:text-purple-600"
                    >
                      <History size={18} />

                      <span>
                        تاریخچه تصاویر
                      </span>
                    </button>

                    {/* Settings */}
                    <button
                      type="button"
                      disabled
                      className="flex w-full cursor-not-allowed items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-400"
                    >
                      <Settings size={18} />

                      <span>
                        تنظیمات
                      </span>
                    </button>

                    <div className="my-2 h-px bg-gray-100" />

                    {/* Logout */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50"
                    >
                      <LogOut size={18} />

                      <span>
                        خروج از حساب
                      </span>
                    </button>

                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </header>
  )
}

export default Header