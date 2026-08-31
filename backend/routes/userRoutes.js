const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/User')

const router = express.Router()

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure:
    process.env.NODE_ENV === 'production',
  sameSite:
    process.env.NODE_ENV === 'production'
      ? 'none'
      : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

const INVALID_CREDENTIALS_MESSAGE =
  'شماره تلفن یا رمز عبور اشتباه است.'

// ====================
// Create User
// ====================

router.post(
  '/',
  async (req, res) => {
    try {
      const {
        name,
        phone,
        password,
      } = req.body

      if (
        !name ||
        !phone ||
        !password
      ) {
        return res.status(400).json({
          message:
            'نام، شماره تلفن و رمز عبور الزامی هستند.',
        })
      }

      const existingUser =
        await User.findOne({
          phone,
        })

      if (existingUser) {
        return res.status(409).json({
          message:
            'این شماره تلفن قبلاً ثبت شده است.',
        })
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          12,
        )

      const user =
        await User.create({
          name,
          phone,
          password:
            hashedPassword,
        })

      // ====================
      // Create JWT
      // ====================

      const token =
        jwt.sign(
          {
            userId:
              user._id.toString(),

            role:
              user.role,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: '7d',
          },
        )

      // ====================
      // Set Authentication Cookie
      // ====================

      res.cookie(
        'token',
        token,
        COOKIE_OPTIONS,
      )

      const userResponse =
        user.toObject()

      delete userResponse.password

      return res.status(201).json({
        message:
          'حساب کاربری با موفقیت ایجاد شد.',

        user:
          userResponse,
      })
    } catch (error) {
      console.error(
        'Create user error:',
        error.message,
      )

      return res.status(500).json({
        message:
          'خطا در ایجاد حساب کاربری.',
      })
    }
  },
)

// ====================
// Login User
// ====================

router.post(
  '/login',
  async (req, res) => {
    try {
      const {
        phone,
        password,
      } = req.body

      if (
        !phone ||
        !password
      ) {
        return res.status(400).json({
          message:
            'شماره تلفن و رمز عبور الزامی هستند.',
        })
      }

      const user =
        await User.findOne({
          phone,
        })

      if (!user) {
        return res.status(401).json({
          message:
            INVALID_CREDENTIALS_MESSAGE,
        })
      }

      const isPasswordCorrect =
        await bcrypt.compare(
          password,
          user.password,
        )

      if (!isPasswordCorrect) {
        return res.status(401).json({
          message:
            INVALID_CREDENTIALS_MESSAGE,
        })
      }

      const token =
        jwt.sign(
          {
            userId:
              user._id.toString(),

            role:
              user.role,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: '7d',
          },
        )

      res.cookie(
        'token',
        token,
        COOKIE_OPTIONS,
      )

      const userResponse =
        user.toObject()

      delete userResponse.password

      return res.status(200).json({
        message:
          'ورود با موفقیت انجام شد.',

        user:
          userResponse,
      })
    } catch (error) {
      console.error(
        'Login user error:',
        error.message,
      )

      return res.status(500).json({
        message:
          'خطا در ورود به حساب کاربری.',
      })
    }
  },
)

module.exports = router