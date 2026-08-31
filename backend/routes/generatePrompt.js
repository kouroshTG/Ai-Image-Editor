const express = require('express')
const axios = require('axios')

const authMiddleware =
  require('../middleware/authMiddleware')

const router = express.Router()

const PROMPT_API_URL =
  process.env.PROMPT_API_URL

const API_KEY =
  process.env.AVALAI_API_KEY

const PROMPT_MODEL =
  'gpt-5.6-luna'

const SYSTEM_PROMPT =
  'You are an expert image editing prompt engineer. Convert the user instruction into a detailed and effective prompt for an image editing AI. Return only the final image editing prompt. Do not add explanations, comments, or quotation marks.'

// ====================
// Generate Prompt
// ====================

router.post(
  '/',
  authMiddleware,
  async (req, res) => {
    try {
      const { prompt } =
        req.body

      if (!prompt) {
        return res.status(400).json({
          message:
            'پرامپت اولیه الزامی است.',
        })
      }

      const response =
        await axios.post(
          PROMPT_API_URL,
          {
            model:
              PROMPT_MODEL,

            messages: [
              {
                role: 'developer',
                content:
                  SYSTEM_PROMPT,
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
          },
          {
            headers: {
              'Content-Type':
                'application/json',

              Authorization:
                `Bearer ${API_KEY}`,
            },
          },
        )

      const generatedPrompt =
        response.data?.choices?.[0]
          ?.message?.content

      if (!generatedPrompt) {
        throw new Error(
          'Generated prompt was not returned.',
        )
      }

      return res.status(200).json({
        prompt:
          generatedPrompt.trim(),
      })
    } catch (error) {
      console.error(
        'Generate prompt error:',
        error.response?.data ||
          error.message,
      )

      const message =
        error.response?.data?.error
          ?.message ||
        error.response?.data?.message ||
        'خطا در تولید پرامپت.'

      return res.status(500).json({
        message,
      })
    }
  },
)

module.exports = router