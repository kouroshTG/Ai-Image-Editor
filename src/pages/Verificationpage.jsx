import { useState } from 'react'

import {
  sendOtp,
  verifyOtp,
} from '../services/api/otpApi'

function Verification({ onVerified }) {
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState('phone')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // ====================
  // Send OTP
  // ====================

  const handlePhoneSubmit = async (event) => {
    event.preventDefault()

    const cleanPhone = phone
      .replace(/\D/g, '')
      .trim()

    if (!/^09\d{9}$/.test(cleanPhone)) {
      setError(
        'شماره موبایل را به‌صورت ۱۱ رقمی و با ۰۹ وارد کنید.',
      )
      return
    }

    try {
      setIsLoading(true)
      setError('')

      await sendOtp(cleanPhone)

      setPhone(cleanPhone)
      setCode('')
      setStep('code')
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
      setIsLoading(false)
    }
  }

  // ====================
  // Verify OTP
  // ====================

  const handleCodeSubmit = async (event) => {
    event.preventDefault()

    const cleanCode = code
      .replace(/\D/g, '')
      .trim()

    if (!/^\d{4}$/.test(cleanCode)) {
      setError(
        'کد تأیید باید دقیقاً ۴ رقم باشد.',
      )
      return
    }

    try {
      setIsLoading(true)
      setError('')

      await verifyOtp(
        phone,
        cleanCode,
      )

      console.log(
        '✅ Demo OTP verified successfully',
      )

      onVerified()
    } catch (error) {
      console.error(
        'Verify OTP error:',
        error,
      )

      setError(
        error.message ||
          'کد وارد شده صحیح نیست یا منقضی شده است.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  // ====================
  // Back To Phone
  // ====================

  const handleBackToPhone = () => {
    setStep('phone')
    setCode('')
    setError('')
  }

  return (
    <section
      dir="rtl"
      className="flex h-full items-center justify-center overflow-hidden px-4"
    >
      {step === 'phone' ? (
        <form
          onSubmit={handlePhoneSubmit}
          className="w-full max-w-md rounded-3xl border border-purple-100 bg-white p-6 shadow-xl shadow-purple-500/50 sm:p-8"
        >
          {/* Header */}

          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-violet-100 shadow-sm">
              <span className="text-2xl">
                📱
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              ورود به نسخه دمو
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-gray-700">
              شماره تلفن خود را وارد کنید تا کد
              تأیید برای شما ارسال شود.
            </p>
          </div>

          {/* Phone */}

          <div className="relative">
            <input
              type="tel"
              value={phone}
              onChange={(event) => {
                const value =
                  event.target.value
                    .replace(/\D/g, '')
                    .slice(0, 11)

                setPhone(value)
                setError('')
              }}
              maxLength={11}
              autoComplete="tel"
              aria-label="شماره تلفن"
              className="absolute inset-0 z-10 w-full cursor-text opacity-0"
            />

            <div
              className="flex w-full justify-center gap-1.5 sm:gap-2"
              dir="ltr"
            >
              {Array.from({
                length: 11,
              }).map((_, index) => (
                <div
                  key={index}
                  className="flex h-10 w-5 items-center justify-center border-b-2 border-gray-200 text-sm font-semibold text-gray-800 transition sm:h-11 sm:w-7 sm:text-base"
                >
                  {phone[index] || ''}
                </div>
              ))}
            </div>
          </div>

          {/* Error */}

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-center text-sm text-red-500">
              {error}
            </p>
          )}

          {/* Submit */}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 px-5 py-3.5 font-medium text-white shadow-md shadow-purple-200 transition hover:scale-[1.02] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            {isLoading
              ? 'در حال ارسال...'
              : 'دریافت کد تأیید'}
          </button>
        </form>
      ) : (
        <form
          onSubmit={handleCodeSubmit}
          className="w-full max-w-md rounded-3xl border border-purple-100 bg-white p-6 shadow-xl shadow-purple-500/50 sm:p-8"
        >
          {/* Header */}

          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-violet-100 shadow-sm">
              <span className="text-2xl">
                🔐
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              تأیید شماره
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-gray-500">
              کد تأیید ارسال‌شده به شماره زیر را
              وارد کنید.
            </p>

            <p
              dir="ltr"
              className="mt-2 font-semibold text-purple-600"
            >
              {phone}
            </p>
          </div>

          {/* OTP */}

          <input
            type="text"
            inputMode="numeric"
            value={code}
            onChange={(event) => {
              setCode(
                event.target.value
                  .replace(/\D/g, '')
                  .slice(0, 4),
              )

              setError('')
            }}
            placeholder="کد تأیید را وارد کنید"
            maxLength={4}
            autoFocus
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3.5 text-center text-lg tracking-widest outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
          />

          {/* Error */}

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-center text-sm text-red-500">
              {error}
            </p>
          )}

          {/* Verify */}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 px-5 py-3.5 font-medium text-white shadow-md shadow-purple-200 transition hover:scale-[1.02] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            {isLoading
              ? 'در حال بررسی...'
              : 'تأیید و ادامه'}
          </button>

          {/* Change Phone */}

          <button
            type="button"
            onClick={handleBackToPhone}
            disabled={isLoading}
            className="mt-4 w-full text-sm font-medium text-gray-500 transition hover:text-purple-600 disabled:opacity-50"
          >
            تغییر شماره تلفن
          </button>
        </form>
      )}
    </section>
  )
}

export default Verification