const express = require('express')
const multer = require('multer')
const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
const path = require('path')

const authMiddleware =
  require('../middleware/authMiddleware')

const {
  editedUploadDirectory,
} = require('../config/upload')

const router = express.Router()

const IMAGE_EDIT_API_URL =
  'https://api.avalai.ir/v1/images/edits'

const IMAGE_MODEL =
  'gpt-image-1-mini'

const upload =
  multer({
    storage:
      multer.memoryStorage(),
  })

function generateFileName(
  extension = '.png',
) {
  return `${Date.now()}-${Math.round(
    Math.random() * 1e9,
  )}${extension}`
}

router.post(
  '/',
  authMiddleware,
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message:
            'هیچ تصویری ارسال نشده است.',
        })
      }

      const {
        model = IMAGE_MODEL,
        prompt,
      } = req.body

      if (!prompt) {
        return res.status(400).json({
          message:
            'پرامپت الزامی است.',
        })
      }

      const formData =
        new FormData()

      formData.append(
        'model',
        model,
      )

      formData.append(
        'image',
        req.file.buffer,
        {
          filename:
            req.file.originalname,
          contentType:
            req.file.mimetype,
        },
      )

      formData.append(
        'prompt',
        prompt,
      )

      // مهم:
      formData.append(
        'response_format',
        'b64_json',
      )

      const response =
        await axios.post(
          IMAGE_EDIT_API_URL,
          formData,
          {
            headers: {
              ...formData.getHeaders(),

              Authorization:
                `Bearer ${process.env.AVALAI_API_KEY}`,
            },

            timeout: 180000,
          },
        )

      const base64Image =
        response.data?.data?.[0]?.b64_json

      if (!base64Image) {
        console.error(
          'AvalAI response:',
          response.data,
        )

        throw new Error(
          'تصویر Base64 از AvalAI دریافت نشد.',
        )
      }

      // ====================
      // Convert Base64 -> Buffer
      // ====================

      const imageBuffer =
        Buffer.from(
          base64Image,
          'base64',
        )

      if (!imageBuffer.length) {
        throw new Error(
          'تصویر دریافت‌شده خالی است.',
        )
      }

      // ====================
      // Ensure Directory
      // ====================

      await fs.promises.mkdir(
        editedUploadDirectory,
        {
          recursive: true,
        },
      )

      // ====================
      // Save Image
      // ====================

      const fileName =
        generateFileName('.png')

      const filePath =
        path.join(
          editedUploadDirectory,
          fileName,
        )

      await fs.promises.writeFile(
        filePath,
        imageBuffer,
      )

      const imageUrl =
        `${process.env.BACKEND_URL}/uploads/edited/${fileName}`

      console.log(
        'Edited image saved:',
        filePath,
      )

      return res.status(200).json({
        message:
          'تصویر با موفقیت ادیت و ذخیره شد.',

        imageUrl,

        fileName,

        prompt,
      })
    } catch (error) {
      console.error(
        'Image edit error:',
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
          error.response?.data?.error
            ?.message ||
          error.response?.data?.message ||
          'خطا در ویرایش تصویر.',
      })
    }
  },
)

module.exports = router