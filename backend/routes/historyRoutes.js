const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const fs = require('fs')

const EditHistory = require('../models/EditHistory')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

const uploadsDirectory = path.join(
  __dirname,
  '..',
  'uploads',
)

const originalUploadDirectory =
  path.join(
    uploadsDirectory,
    'original',
  )

const editedUploadDirectory =
  path.join(
    uploadsDirectory,
    'edited',
  )

// ====================
// File Helpers
// ====================

function deleteFile(
  directory,
  fileName,
) {
  if (!fileName) {
    return
  }

  const filePath =
    path.join(
      directory,
      fileName,
    )

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }
}

function deleteHistoryImages(
  history,
) {
  deleteFile(
    originalUploadDirectory,
    history.originalFileName,
  )

  deleteFile(
    editedUploadDirectory,
    history.editedFileName,
  )
}

// ====================
// Save Edit History
// ====================

router.post(
  '/',
  authMiddleware,
  async (req, res) => {
    try {
      const {
        originalImage,
        originalFileName,
        editedImage,
        editedFileName,
        prompt,
      } = req.body

      const userId =
        req.user.userId

      if (
        !originalImage ||
        !originalFileName ||
        !editedImage ||
        !editedFileName ||
        !prompt
      ) {
        return res.status(400).json({
          message:
            'اطلاعات تاریخچه ناقص است.',
        })
      }

      const history =
        await EditHistory.create({
          userId,
          originalImage,
          originalFileName,
          editedImage,
          editedFileName,
          prompt,
        })

      return res.status(201).json({
        message:
          'تاریخچه با موفقیت ذخیره شد.',
        history,
      })
    } catch (error) {
      console.error(
        'Save history error:',
        error.message,
      )

      return res.status(500).json({
        message:
          'خطا در ذخیره تاریخچه.',
      })
    }
  },
)

// ====================
// Get Current User History
// ====================

router.get(
  '/',
  authMiddleware,
  async (req, res) => {
    try {
      const history =
        await EditHistory.find({
          userId:
            req.user.userId,
        }).sort({
          createdAt: -1,
        })

      return res.status(200).json(
        history,
      )
    } catch (error) {
      console.error(
        'Get history error:',
        error.message,
      )

      return res.status(500).json({
        message:
          'خطا در دریافت تاریخچه.',
      })
    }
  },
)

// ====================
// Delete One History
// ====================

router.delete(
  '/item/:id',
  authMiddleware,
  async (req, res) => {
    try {
      const { id } =
        req.params

      if (
        !mongoose.Types.ObjectId.isValid(
          id,
        )
      ) {
        return res.status(400).json({
          message:
            'شناسه تاریخچه نامعتبر است.',
        })
      }

      const history =
        await EditHistory.findOne({
          _id: id,
          userId:
            req.user.userId,
        })

      if (!history) {
        return res.status(404).json({
          message:
            'رکورد تاریخچه پیدا نشد.',
        })
      }

      deleteHistoryImages(history)

      await EditHistory.findByIdAndDelete(
        id,
      )

      return res.status(200).json({
        message:
          'رکورد تاریخچه و تصاویر با موفقیت حذف شدند.',
      })
    } catch (error) {
      console.error(
        'Delete history error:',
        error.message,
      )

      return res.status(500).json({
        message:
          'خطا در حذف تاریخچه و تصاویر.',
      })
    }
  },
)

// ====================
// Delete All Current User History
// ====================

router.delete(
  '/',
  authMiddleware,
  async (req, res) => {
    try {
      const userId =
        req.user.userId

      const history =
        await EditHistory.find({
          userId,
        })

      for (const item of history) {
        deleteHistoryImages(item)
      }

      const result =
        await EditHistory.deleteMany({
          userId,
        })

      return res.status(200).json({
        message:
          'تمام تاریخچه و تصاویر با موفقیت حذف شدند.',
        deletedCount:
          result.deletedCount,
      })
    } catch (error) {
      console.error(
        'Delete all history error:',
        error.message,
      )

      return res.status(500).json({
        message:
          'خطا در حذف تاریخچه و تصاویر.',
      })
    }
  },
)

module.exports = router