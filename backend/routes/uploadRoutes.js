const express = require('express')
const axios = require('axios')
const fs = require('fs')
const path = require('path')

const authMiddleware =
  require('../middleware/authMiddleware')

const {
  upload,
  editedUploadDirectory,
} = require('../config/upload')

const router = express.Router()

const BACKEND_URL =
  process.env.BACKEND_URL

// ====================
// Helpers
// ====================

function generateFileName(
  extension = '.png',
) {
  return `${Date.now()}-${Math.round(
    Math.random() * 1e9,
  )}${extension}`
}

function getExtensionFromContentType(
  contentType,
) {
  if (!contentType) {
    return '.png'
  }

  const type =
    contentType
      .split(';')[0]
      .trim()
      .toLowerCase()

  const extensions = {
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/webp': '.webp',
    'image/gif': '.gif',
  }

  return (
    extensions[type] ||
    '.png'
  )
}

// ====================
// Upload Original Image
// ====================

router.post(
  '/upload',
  authMiddleware,
  upload.single('image'),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message:
            'هیچ تصویری ارسال نشده است.',
        })
      }

      const imageUrl =
        `${BACKEND_URL}/uploads/original/${req.file.filename}`

      return res.status(201).json({
        message:
          'تصویر با موفقیت ذخیره شد.',
        imageUrl,
        fileName:
          req.file.filename,
      })
    } catch (error) {
      console.error(
        'Original image upload error:',
        error,
      )

      return res.status(500).json({
        message:
          'خطا در ذخیره تصویر اصلی.',
      })
    }
  },
)

// ====================
// Save Edited Image
// ====================

router.post(
  '/save-edited-image',
  authMiddleware,
  async (req, res) => {
    try {
      const {
        editedImageUrl,
      } = req.body

      // ====================
      // Validate URL
      // ====================

      if (!editedImageUrl) {
        return res.status(400).json({
          message:
            'آدرس تصویر ادیت‌شده ارسال نشده است.',
        })
      }

      if (
        typeof editedImageUrl !==
        'string'
      ) {
        return res.status(400).json({
          message:
            'آدرس تصویر نامعتبر است.',
        })
      }

      // ====================
      // Ensure Directory Exists
      // ====================

      await fs.promises.mkdir(
        editedUploadDirectory,
        {
          recursive: true,
        },
      )

      console.log(
        'Downloading edited image:',
        editedImageUrl,
      )

      // ====================
      // Download Edited Image
      // ====================

      const response =
        await axios.get(
          editedImageUrl,
          {
            responseType:
              'arraybuffer',

            timeout: 120000,

            maxContentLength:
              50 * 1024 * 1024,

            maxBodyLength:
              50 * 1024 * 1024,

            validateStatus: (
              status,
            ) =>
              status >= 200 &&
              status < 300,
          },
        )

      // ====================
      // Validate Response
      // ====================

      if (!response.data) {
        throw new Error(
          'Edited image response is empty.',
        )
      }

      const contentType =
        response.headers[
          'content-type'
        ]

      console.log(
        'Edited image content-type:',
        contentType,
      )

      // ====================
      // Generate File Name
      // ====================

      const extension =
        getExtensionFromContentType(
          contentType,
        )

      const fileName =
        generateFileName(
          extension,
        )

      const filePath =
        path.join(
          editedUploadDirectory,
          fileName,
        )

      // ====================
      // Save File
      // ====================

      await fs.promises.writeFile(
        filePath,
        response.data,
      )

      // ====================
      // Build Public URL
      // ====================

      const imageUrl =
        `${BACKEND_URL}/uploads/edited/${fileName}`

      console.log(
        'Edited image saved successfully:',
        filePath,
      )

      return res.status(201).json({
        message:
          'تصویر ادیت‌شده با موفقیت ذخیره شد.',
        imageUrl,
        fileName,
      })
    } catch (error) {
      console.error(
        'Edited image save error:',
      )

      console.error(
        'Message:',
        error.message,
      )

      console.error(
        'Status:',
        error.response?.status,
      )

      console.error(
        'Response:',
        error.response?.data,
      )

      return res.status(500).json({
        message:
          'خطا در ذخیره تصویر ادیت‌شده.',
      })
    }
  },
)

module.exports = router