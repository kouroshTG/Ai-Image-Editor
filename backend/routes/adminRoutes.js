const express = require('express')
const path = require('path')
const fs = require('fs')

const User = require('../models/User')
const EditHistory = require('../models/EditHistory')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

// ====================
// Upload Directories
// ====================

const uploadsDirectory = path.join(
  __dirname,
  '..',
  'uploads',
)

const originalUploadDirectory = path.join(
  uploadsDirectory,
  'original',
)

const editedUploadDirectory = path.join(
  uploadsDirectory,
  'edited',
)

// ====================
// Get Backend URL
// ====================

function getBackendUrl(req) {
  return (
    process.env.BACKEND_URL ||
    `${req.protocol}://${req.get('host')}`
  ).replace(/\/$/, '')
}

// ====================
// Build Image URL
// ====================

function buildImageUrl(
  backendUrl,
  folder,
  fileName,
  existingImage,
) {
  // اگر قبلاً URL کامل وجود دارد
  if (
    existingImage &&
    typeof existingImage === 'string' &&
    (
      existingImage.startsWith('http://') ||
      existingImage.startsWith('https://') ||
      existingImage.startsWith('data:')
    )
  ) {
    return existingImage
  }

  // اگر filename داریم، URL را خودمان می‌سازیم
  if (fileName) {
    return `${backendUrl}/uploads/${folder}/${encodeURIComponent(
      fileName,
    )}`
  }

  // اگر هیچ‌کدام وجود نداشت
  return existingImage || ''
}

// ====================
// Admin Middleware
// ====================

function adminMiddleware(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      message:
        'برای دسترسی به این بخش باید وارد حساب شوید.',
    })
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      message:
        'شما دسترسی لازم برای ورود به پنل مدیریت را ندارید.',
    })
  }

  next()
}

// ====================
// Get Admin Profile
// ====================

router.get(
  '/profile',
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const admin = await User.findById(
        req.user.userId,
      ).select('-password')

      if (!admin) {
        return res.status(404).json({
          message:
            'اطلاعات مدیر پیدا نشد.',
        })
      }

      return res.status(200).json({
        user: admin,
      })
    } catch (error) {
      console.error(
        'Get admin profile error:',
        error.message,
      )

      return res.status(500).json({
        message:
          'خطا در دریافت اطلاعات مدیر.',
      })
    }
  },
)

// ====================
// Get All Users
// ====================

router.get(
  '/users',
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const users = await User.find()
        .select('-password')
        .sort({
          createdAt: -1,
        })

      return res.status(200).json({
        users,
      })
    } catch (error) {
      console.error(
        'Get admin users error:',
        error.message,
      )

      return res.status(500).json({
        message:
          'خطا در دریافت کاربران.',
      })
    }
  },
)

// ====================
// Get User Details
// ====================

router.get(
  '/users/:id',
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const user = await User.findById(
        req.params.id,
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
        'Get user details error:',
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
// Get User History
// ====================

router.get(
  '/users/:id/history',
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const userId = req.params.id

      const user = await User.findById(
        userId,
      ).select('_id name phone')

      if (!user) {
        return res.status(404).json({
          message:
            'کاربر پیدا نشد.',
        })
      }

      const history =
        await EditHistory.find({
          userId,
        }).sort({
          createdAt: -1,
        })

      const backendUrl =
        getBackendUrl(req)

      const historyWithImages =
        history.map((item) => {
          const historyObject =
            item.toObject()

          historyObject.originalImage =
            buildImageUrl(
              backendUrl,
              'original',
              historyObject.originalFileName,
              historyObject.originalImage,
            )

          historyObject.editedImage =
            buildImageUrl(
              backendUrl,
              'edited',
              historyObject.editedFileName,
              historyObject.editedImage,
            )

          return historyObject
        })

      return res.status(200).json({
        user,
        history: historyWithImages,
      })
    } catch (error) {
      console.error(
        'Get user history error:',
        error.message,
      )

      return res.status(500).json({
        message:
          'خطا در دریافت تاریخچه کاربر.',
      })
    }
  },
)

// ====================
// Delete User History Item
// ====================

router.delete(
  '/users/:userId/history/:historyId',
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const {
        userId,
        historyId,
      } = req.params

      const history =
        await EditHistory.findOne({
          _id: historyId,
          userId,
        })

      if (!history) {
        return res.status(404).json({
          message:
            'رکورد تاریخچه پیدا نشد.',
        })
      }

      // ====================
      // Delete Original Image
      // ====================

      if (history.originalFileName) {
        const originalPath =
          path.join(
            originalUploadDirectory,
            history.originalFileName,
          )

        if (
          fs.existsSync(
            originalPath,
          )
        ) {
          fs.unlinkSync(
            originalPath,
          )
        }
      }

      // ====================
      // Delete Edited Image
      // ====================

      if (history.editedFileName) {
        const editedPath =
          path.join(
            editedUploadDirectory,
            history.editedFileName,
          )

        if (
          fs.existsSync(
            editedPath,
          )
        ) {
          fs.unlinkSync(
            editedPath,
          )
        }
      }

      // ====================
      // Delete History
      // ====================

      await EditHistory.findByIdAndDelete(
        historyId,
      )

      return res.status(200).json({
        message:
          'رکورد تاریخچه با موفقیت حذف شد.',
      })
    } catch (error) {
      console.error(
        'Delete admin history item error:',
        error.message,
      )

      return res.status(500).json({
        message:
          'خطا در حذف رکورد تاریخچه.',
      })
    }
  },
)

// ====================
// Change User Role
// ====================

router.patch(
  '/users/:id/role',
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { role } = req.body

      if (
        role !== 'user' &&
        role !== 'admin'
      ) {
        return res.status(400).json({
          message:
            'نقش کاربر نامعتبر است.',
        })
      }

      if (
        req.params.id ===
        req.user.userId
      ) {
        return res.status(400).json({
          message:
            'نمی‌توانید نقش حساب خودتان را تغییر دهید.',
        })
      }

      const user =
        await User.findById(
          req.params.id,
        )

      if (!user) {
        return res.status(404).json({
          message:
            'کاربر پیدا نشد.',
        })
      }

      user.role = role

      await user.save()

      const updatedUser =
        await User.findById(
          user._id,
        ).select('-password')

      return res.status(200).json({
        message:
          'نقش کاربر با موفقیت تغییر کرد.',
        user: updatedUser,
      })
    } catch (error) {
      console.error(
        'Change user role error:',
        error.message,
      )

      return res.status(500).json({
        message:
          'خطا در تغییر نقش کاربر.',
      })
    }
  },
)

// ====================
// Delete User
// ====================

router.delete(
  '/users/:id',
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      if (
        req.params.id ===
        req.user.userId
      ) {
        return res.status(400).json({
          message:
            'نمی‌توانید حساب خودتان را حذف کنید.',
        })
      }

      const user =
        await User.findById(
          req.params.id,
        )

      if (!user) {
        return res.status(404).json({
          message:
            'کاربر پیدا نشد.',
        })
      }

      const history =
        await EditHistory.find({
          userId: req.params.id,
        })

      for (const item of history) {
        // Delete original image

        if (
          item.originalFileName
        ) {
          const originalPath =
            path.join(
              originalUploadDirectory,
              item.originalFileName,
            )

          if (
            fs.existsSync(
              originalPath,
            )
          ) {
            fs.unlinkSync(
              originalPath,
            )
          }
        }

        // Delete edited image

        if (
          item.editedFileName
        ) {
          const editedPath =
            path.join(
              editedUploadDirectory,
              item.editedFileName,
            )

          if (
            fs.existsSync(
              editedPath,
            )
          ) {
            fs.unlinkSync(
              editedPath,
            )
          }
        }
      }

      await EditHistory.deleteMany({
        userId: req.params.id,
      })

      await User.findByIdAndDelete(
        req.params.id,
      )

      return res.status(200).json({
        message:
          'کاربر و تاریخچه او با موفقیت حذف شدند.',
      })
    } catch (error) {
      console.error(
        'Delete user error:',
        error.message,
      )

      return res.status(500).json({
        message:
          'خطا در حذف کاربر.',
      })
    }
  },
)

module.exports = router