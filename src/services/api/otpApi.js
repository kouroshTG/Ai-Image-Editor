// ====================
// Normalize Phone
// ====================

function normalizePhone(phone) {
  const normalizedPhone = String(phone || '')
    .trim()
    .replace(/\D/g, '')

  if (!/^09\d{9}$/.test(normalizedPhone)) {
    throw new Error(
      'شماره موبایل را به‌صورت ۱۱ رقمی و با ۰۹ وارد کنید.',
    )
  }

  return normalizedPhone
}

// ====================
// Send OTP
// ====================

export async function sendOtp(phone) {
  const normalizedPhone =
    normalizePhone(phone)

  console.log(
    '📤 Sending OTP for:',
    normalizedPhone,
  )

  const response = await fetch(
    '/dev/api/auth/otpsms',
    {
      method: 'POST',

      credentials: 'include',

      headers: {
        'Content-Type':
          'application/json',
      },

      body: JSON.stringify({
        phone: normalizedPhone,
      }),
    },
  )

  const data =
    await response.json().catch(() => null)

  console.log(
    '📥 Send OTP status:',
    response.status,
  )

  console.log(
    '📥 Send OTP response:',
    data,
  )

  if (!response.ok) {
    throw new Error(
      data?.message ||
        'ارسال کد تأیید با خطا مواجه شد.',
    )
  }

  return data
}

// ====================
// Verify OTP
// ====================

export async function verifyOtp(
  phone,
  otp,
) {
  const normalizedPhone =
    normalizePhone(phone)

  const normalizedOtp =
    String(otp || '')
      .trim()
      .replace(/\D/g, '')

  if (!/^\d{4}$/.test(normalizedOtp)) {
    throw new Error(
      'کد تأیید باید دقیقاً ۴ رقم باشد.',
    )
  }

  console.log(
    '🔐 Verifying OTP:',
    {
      phone: normalizedPhone,
      otp: normalizedOtp,
    },
  )

  const response = await fetch(
    '/dev/api/auth/otpsms',
    {
      method: 'POST',

      credentials: 'include',

      headers: {
        'Content-Type':
          'application/json',
      },

      body: JSON.stringify({
        phone: normalizedPhone,
        otp: normalizedOtp,
        redirect: '/dev/panel',
      }),
    },
  )

  const data =
    await response.json().catch(() => null)

  console.log(
    '📥 Verify OTP status:',
    response.status,
  )

  console.log(
    '📥 Verify OTP response:',
    data,
  )

  if (!response.ok) {
    throw new Error(
      data?.message ||
        'کد تأیید صحیح نیست یا منقضی شده است.',
    )
  }

  return data
}