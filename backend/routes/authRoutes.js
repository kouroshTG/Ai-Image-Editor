const express = require('express')

const User = require('../models/User')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure:
    process.env.NODE_ENV === 'production',
  sameSite:
    process.env.NODE_ENV === 'production'
      ? 'none'
      : 'lax',
}

// ====================
// Get Current User
// ====================

router.get(
  '/me',
  authMiddleware,
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.user.userId,
        ).select('-password')

      if (!user) {
        return res.status(404).json({
          message:
            'کاربر پیدا نشد.',
        })
      }

      return res.status(200).json({
        user,
      })
    } catch (error) {
      console.error(
        'Get current user error:',
        error.message,
      )

      return res.status(500).json({
        message:
          'خطا در دریافت اطلاعات کاربر.',
      })
    }
  },
)

// ====================
// Logout User
// ====================

router.post(
  '/logout',
  (req, res) => {
    res.clearCookie(
      'token',
      COOKIE_OPTIONS,
    )

    return res.status(200).json({
      message:
        'خروج از حساب با موفقیت انجام شد.',
    })
  },
)

module.exports = router