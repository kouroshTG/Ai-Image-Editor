import { useState } from 'react'

import {
  registerUser,
  loginUser,
} from '../services/api/authApi'

import {
  sendOtp,
  verifyOtp,
} from '../services/api/otpApi'

import {
  ArrowRight,
  CheckCircle2,
  KeyRound,
  LockKeyhole,
  Phone,
  RotateCcw,
  Sparkles,
  User,
} from 'lucide-react'

function AuthPage({ onLogin }) {
  const [mode, setMode] = useState('login')

  const [registerStep, setRegisterStep] =
    useState('phone')

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] =
    useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isLoginMode = mode === 'login'

  // ====================
  // Reset Register Flow
  // ====================

  const resetRegisterFlow = () => {
    setRegisterStep('phone')
    setOtp('')
    setPassword('')
    setConfirmPassword('')
    setError('')
  }

  // ====================
  // Change Auth Mode
  // ====================

  const handleModeChange = (newMode) => {
    setMode(newMode)
    setError('')

    if (newMode === 'register') {
      resetRegisterFlow()
    }
  }

  // ====================
  // Send OTP
  // ====================

  const handleSendOtp = async () => {
    setError('')

    const cleanPhone =
      phone.replace(/\D/g, '')

    if (!name.trim()) {
      setError(
        'لطفاً نام و نام خانوادگی خود را وارد کنید.',
      )
      return
    }

    if (!/^09\d{9}$/.test(cleanPhone)) {
      setError(
        'شماره موبایل را به‌صورت ۱۱ رقمی و با ۰۹ وارد کنید.',
      )
      return
    }

    try {
      setLoading(true)

      await sendOtp(cleanPhone)

      setRegisterStep('otp')
      setOtp('')

    } catch (error) {
      console.error(
        'Send OTP error:',
        error,
      )

      setError(
        error.message ||
          'ارسال کد تأیید با خطا مواجه شد.',
      )
    } finally {
      setLoading(false)
    }
  }

  // ====================
  // Verify OTP
  // ====================

  const handleVerifyOtp = async () => {
    setError('')

    const cleanOtp =
      otp.replace(/\D/g, '')

    if (!/^\d{4}$/.test(cleanOtp)) {
      setError(
        'کد تأیید باید دقیقاً ۴ رقم باشد.',
      )
      return
    }

    try {
      setLoading(true)

      await verifyOtp(
        phone,
        cleanOtp,
      )

      setRegisterStep('password')
      setOtp('')

    } catch (error) {
      console.error(
        'Verify OTP error:',
        error,
      )

      setError(
        error.message ||
          'کد تأیید صحیح نیست یا منقضی شده است.',
      )
    } finally {
      setLoading(false)
    }
  }

  // ====================
  // Create Account
  // ====================

  const handleCreateAccount = async () => {
    setError('')

    if (password.length < 6) {
      setError(
        'رمز عبور باید حداقل ۶ کاراکتر باشد.',
      )
      return
    }

    if (password !== confirmPassword) {
      setError(
        'رمز عبور و تکرار آن یکسان نیستند.',
      )
      return
    }

    try {
      setLoading(true)

      const data = await registerUser({
        name: name.trim(),
        phone,
        password,
      })

      localStorage.setItem(
        'user',
        JSON.stringify(data.user),
      )

      console.log(
        'Authenticated user:',
        data.user,
      )

      setError('')

      onLogin()

    } catch (error) {
      console.error(
        'Create account error:',
        error,
      )

      setError(
        error.message ||
          'خطایی در ایجاد حساب کاربری رخ داد.',
      )
    } finally {
      setLoading(false)
    }
  }

  // ====================
  // Login
  // ====================

  const handleLogin = async () => {
    setError('')

    if (!/^09\d{9}$/.test(phone)) {
      setError(
        'شماره موبایل را به‌صورت ۱۱ رقمی و با ۰۹ وارد کنید.',
      )
      return
    }

    if (!password) {
      setError(
        'لطفاً رمز عبور خود را وارد کنید.',
      )
      return
    }

    try {
      setLoading(true)

      const data = await loginUser({
        phone,
        password,
      })

      localStorage.setItem(
        'user',
        JSON.stringify(data.user),
      )

      console.log(
        'Authenticated user:',
        data.user,
      )

      setError('')

      onLogin()

    } catch (error) {
      console.error(
        'Login error:',
        error,
      )

      setError(
        error.message ||
          'خطایی در ورود به حساب کاربری رخ داد.',
      )
    } finally {
      setLoading(false)
    }
  }

  // ====================
  // Submit
  // ====================

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (isLoginMode) {
      await handleLogin()
      return
    }

    if (registerStep === 'phone') {
      await handleSendOtp()
      return
    }

    if (registerStep === 'otp') {
      await handleVerifyOtp()
      return
    }

    if (registerStep === 'password') {
      await handleCreateAccount()
    }
  }

  // ====================
  // Back
  // ====================

  const handleBack = () => {
    setError('')

    if (registerStep === 'otp') {
      setRegisterStep('phone')
      setOtp('')
      return
    }

    if (registerStep === 'password') {
      setRegisterStep('otp')
      setPassword('')
      setConfirmPassword('')
    }
  }

  // ====================
  // Title
  // ====================

  const getTitle = () => {
    if (isLoginMode) {
      return 'خوش آمدید'
    }

    if (registerStep === 'phone') {
      return 'ایجاد حساب کاربری'
    }

    if (registerStep === 'otp') {
      return 'تأیید شماره موبایل'
    }

    return 'ساخت رمز عبور'
  }

  // ====================
  // Description
  // ====================

  const getDescription = () => {
    if (isLoginMode) {
      return 'برای ورود اطلاعات حساب خود را وارد کنید.'
    }

    if (registerStep === 'phone') {
      return 'برای شروع، نام و شماره موبایل خود را وارد کنید.'
    }

    if (registerStep === 'otp') {
      return `کد تأیید ارسال‌شده به ${phone} را وارد کنید.`
    }

    return 'برای حساب کاربری خود یک رمز عبور امن انتخاب کنید.'
  }

  return (
    <section
      dir="rtl"
      className="relative flex h-full items-center justify-center overflow-hidden px-4"
    >
      {/* Background */}

      <div className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full blur-3xl" />

      <div className="pointer-events-none absolute -left-32 bottom-10 h-96 w-96 rounded-full blur-3xl" />

      {/* Card */}

      <div className="relative z-10 w-full max-w-md">
        <div className="w-full rounded-3xl border border-purple-100 bg-white/95 p-5 shadow-xl shadow-purple-500/50 backdrop-blur sm:p-8">

          {/* Logo */}

          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-violet-600 text-white shadow-lg shadow-purple-200">
              <Sparkles size={26} />
            </div>
          </div>

          {/* Title */}

          <div className="mt-5 text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {getTitle()}
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-700">
              {getDescription()}
            </p>
          </div>

          {/* Tabs */}

          <div className="mt-6 grid grid-cols-2 rounded-xl bg-purple-50 p-1">
            <button
              type="button"
              onClick={() =>
                handleModeChange('login')
              }
              className={`rounded-lg py-2.5 text-sm font-semibold transition-all duration-200 ${
                isLoginMode
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-gray-500 hover:text-purple-700'
              }`}
            >
              ورود
            </button>

            <button
              type="button"
              onClick={() =>
                handleModeChange('register')
              }
              className={`rounded-lg py-2.5 text-sm font-semibold transition-all duration-200 ${
                !isLoginMode
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-gray-500 hover:text-purple-700'
              }`}
            >
              ثبت نام
            </button>
          </div>

          {/* Register Progress */}

          {!isLoginMode && (
            <div className="mt-6 flex items-center justify-center gap-2">

              <div
                className={`h-2 w-16 rounded-full transition ${
                  registerStep === 'phone'
                    ? 'bg-purple-600'
                    : 'bg-purple-200'
                }`}
              />

              <div
                className={`h-2 w-16 rounded-full transition ${
                  registerStep === 'otp' ||
                  registerStep === 'password'
                    ? 'bg-purple-600'
                    : 'bg-purple-200'
                }`}
              />

              <div
                className={`h-2 w-16 rounded-full transition ${
                  registerStep === 'password'
                    ? 'bg-purple-600'
                    : 'bg-purple-200'
                }`}
              />

            </div>
          )}

          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5"
          >

            {/* ==================== */}
            {/* Register - Phone */}
            {/* ==================== */}

            {!isLoginMode &&
              registerStep === 'phone' && (
                <>
                  {/* Name */}

                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      نام و نام خانوادگی
                    </label>

                    <div className="relative">
                      <User
                        size={19}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(event) => {
                          setName(
                            event.target.value,
                          )
                          setError('')
                        }}
                        placeholder="مثلاً علی رضایی"
                        autoComplete="name"
                        className="w-full rounded-xl border border-gray-200 bg-white py-3 pr-11 pl-4 text-gray-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                      />
                    </div>
                  </div>

                  {/* Phone */}

                  <div>
                    <label
                      htmlFor="register-phone"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      شماره موبایل
                    </label>

                    <div className="relative">
                      <Phone
                        size={19}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        id="register-phone"
                        type="tel"
                        inputMode="numeric"
                        dir="ltr"
                        value={phone}
                        onChange={(event) => {
                          const value =
                            event.target.value
                              .replace(/\D/g, '')
                              .slice(0, 11)

                          setPhone(value)
                          setError('')
                        }}
                        placeholder="09123456789"
                        maxLength={11}
                        autoComplete="tel"
                        className="w-full rounded-xl border border-gray-200 bg-white py-3 pr-11 pl-4 text-center text-gray-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                      />
                    </div>
                  </div>
                </>
              )}

            {/* ==================== */}
            {/* Register - OTP */}
            {/* ==================== */}

            {!isLoginMode &&
              registerStep === 'otp' && (
                <>
                  <div>
                    <label
                      htmlFor="otp"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      کد تأیید
                    </label>

                    <div className="relative">
                      <KeyRound
                        size={19}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        id="otp"
                        type="text"
                        inputMode="numeric"
                        dir="ltr"
                        value={otp}
                        onChange={(event) => {
                          const value =
                            event.target.value
                              .replace(/\D/g, '')
                              .slice(0, 4)

                          setOtp(value)
                          setError('')
                        }}
                        placeholder="----"
                        maxLength={4}
                        autoComplete="one-time-code"
                        autoFocus
                        className="w-full rounded-xl border border-gray-200 bg-white py-3 pr-11 pl-4 text-center text-xl font-bold tracking-[0.5em] text-gray-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex w-full items-center justify-center gap-2 text-sm font-medium text-purple-600 transition hover:text-purple-800"
                  >
                    <ArrowRight size={17} />

                    تغییر شماره موبایل
                  </button>
                </>
              )}

            {/* ==================== */}
            {/* Register - Password */}
            {/* ==================== */}

            {!isLoginMode &&
              registerStep === 'password' && (
                <>
                  {/* Password */}

                  <div>
                    <label
                      htmlFor="register-password"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      رمز عبور
                    </label>

                    <div className="relative">
                      <LockKeyhole
                        size={19}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        id="register-password"
                        type="password"
                        value={password}
                        onChange={(event) => {
                          setPassword(
                            event.target.value,
                          )
                          setError('')
                        }}
                        placeholder="حداقل ۶ کاراکتر"
                        autoComplete="new-password"
                        className="w-full rounded-xl border border-gray-200 bg-white py-3 pr-11 pl-4 text-gray-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}

                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      تکرار رمز عبور
                    </label>

                    <div className="relative">
                      <LockKeyhole
                        size={19}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(event) => {
                          setConfirmPassword(
                            event.target.value,
                          )
                          setError('')
                        }}
                        placeholder="رمز عبور را دوباره وارد کنید"
                        autoComplete="new-password"
                        className="w-full rounded-xl border border-gray-200 bg-white py-3 pr-11 pl-4 text-gray-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex w-full items-center justify-center gap-2 text-sm font-medium text-purple-600 transition hover:text-purple-800"
                  >
                    <ArrowRight size={17} />

                    بازگشت
                  </button>
                </>
              )}

            {/* ==================== */}
            {/* Login */}
            {/* ==================== */}

            {isLoginMode && (
              <>
                {/* Phone */}

                <div>
                  <label
                    htmlFor="login-phone"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    شماره تلفن
                  </label>

                  <div className="relative">
                    <Phone
                      size={19}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="login-phone"
                      type="tel"
                      inputMode="numeric"
                      dir="ltr"
                      value={phone}
                      onChange={(event) => {
                        const value =
                          event.target.value
                            .replace(/\D/g, '')
                            .slice(0, 11)

                        setPhone(value)
                        setError('')
                      }}
                      placeholder="09123456789"
                      maxLength={11}
                      autoComplete="tel"
                      className="w-full rounded-xl border border-gray-200 bg-white py-3 pr-11 pl-4 text-center text-gray-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    />
                  </div>
                </div>

                {/* Password */}

                <div>
                  <label
                    htmlFor="login-password"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    رمز عبور
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={19}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="login-password"
                      type="password"
                      value={password}
                      onChange={(event) => {
                        setPassword(
                          event.target.value,
                        )
                        setError('')
                      }}
                      placeholder="رمز عبور خود را وارد کنید"
                      autoComplete="current-password"
                      className="w-full rounded-xl border border-gray-200 bg-white py-3 pr-11 pl-4 text-gray-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    />
                  </div>
                </div>

                {/* Forgot Password */}

                <div className="text-left">
                  <button
                    type="button"
                    className="text-sm font-medium text-purple-600 transition hover:text-purple-800"
                  >
                    رمز عبور را فراموش کرده‌اید؟
                  </button>
                </div>
              </>
            )}

            {/* Error */}

            {error && (
              <p
                role="alert"
                className="text-center text-sm text-red-500"
              >
                {error}
              </p>
            )}

            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-purple-200 transition-all duration-200 hover:scale-[1.01] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />

                  لطفاً صبر کنید...
                </>
              ) : isLoginMode ? (
                'ورود به حساب'
              ) : registerStep === 'phone' ? (
                <>
                  ارسال کد تأیید
                  <Phone size={18} />
                </>
              ) : registerStep === 'otp' ? (
                <>
                  تأیید کد
                  <CheckCircle2 size={18} />
                </>
              ) : (
                <>
                  ایجاد حساب
                  <CheckCircle2 size={18} />
                </>
              )}
            </button>
          </form>

          {/* Bottom Action */}

          <p className="mt-5 text-center text-sm text-gray-500">
            {isLoginMode
              ? 'حساب کاربری ندارید؟'
              : 'قبلاً حساب ساخته‌اید؟'}

            <button
              type="button"
              onClick={() =>
                handleModeChange(
                  isLoginMode
                    ? 'register'
                    : 'login',
                )
              }
              className="mr-1 font-semibold text-purple-600 transition hover:text-purple-800"
            >
              {isLoginMode
                ? 'ثبت نام کنید'
                : 'وارد شوید'}
            </button>
          </p>
        </div>
      </div>
    </section>
  )
}

export default AuthPage