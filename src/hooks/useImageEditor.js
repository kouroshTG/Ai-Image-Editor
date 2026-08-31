import { useEffect, useState } from 'react'

import { generatePrompt } from '../services/api/promptapi'
import { processImage } from '../services/imageProcessing'

import { getFriendlyErrorMessage } from '../utils/errorHandler'
import { buildPrompt } from '../utils/promptBuilder'

const LOADING_MESSAGES = [
  'در حال آماده‌سازی تصویر...',
  'هوش مصنوعی داره فکر می‌کنه...',
  'نور و رنگ رو تنظیم می‌کنیم...',
  'داریم جزئیات رو دقیق می‌کنیم...',
  'کمی صبر کن، تقریباً تمومه...',
]

function useImageEditor() {
  const [category, setCategory] = useState('')
  const [type, setType] = useState('')
  const [optionOne, setOptionOne] = useState('')
  const [optionTwo, setOptionTwo] = useState('')
  const [optionThree, setOptionThree] = useState('')
  const [description, setDescription] = useState('')

  const [images, setImages] = useState([])
  const [results, setResults] = useState([])
  const [imageStatuses, setImageStatuses] =
    useState({})

  const [isLoading, setIsLoading] =
    useState(false)

  const [error, setError] = useState('')

  const [
    loadingMessageIndex,
    setLoadingMessageIndex,
  ] = useState(0)

  const isFormComplete =
    category !== '' &&
    type !== '' &&
    optionOne !== '' &&
    optionTwo !== '' &&
    optionThree !== ''

  // ====================
  // Loading Messages
  // ====================

  useEffect(() => {
    if (!isLoading) {
      setLoadingMessageIndex(0)
      return
    }

    const interval = setInterval(() => {
      setLoadingMessageIndex(
        (previousIndex) =>
          (previousIndex + 1) %
          LOADING_MESSAGES.length,
      )
    }, 2200)

    return () => {
      clearInterval(interval)
    }
  }, [isLoading])

  // ====================
  // Handle Image Edit
  // ====================

  const handleImageEdit = async () => {
    if (
      images.length === 0 ||
      !isFormComplete ||
      isLoading
    ) {
      return
    }

    setIsLoading(true)
    setError('')
    setResults([])

    // Set all images to processing
    setImageStatuses(
      Object.fromEntries(
        images.map((_, index) => [
          index,
          'processing',
        ]),
      ),
    )

    try {
      // ====================
      // 1. Build Raw Prompt
      // ====================

      const rawPrompt = buildPrompt({
        category,
        type,
        style: optionOne,
        lighting: optionTwo,
        editStrength: optionThree,
        description,
      })

      // ====================
      // 2. Generate AI Prompt
      // ====================

      const promptResult =
        await generatePrompt(rawPrompt)

      const prompt =
        promptResult?.prompt

      if (!prompt) {
        throw new Error(
          'Generated prompt was not returned.',
        )
      }

      // ====================
      // 3. Process All Images
      // ====================

      const processedResults =
        await Promise.all(
          images.map(
            async (image, index) => {
              try {
                const result =
                  await processImage({
                    image,
                    prompt,
                  })

                // Mark image as successful
                setImageStatuses(
                  (previous) => ({
                    ...previous,
                    [index]: 'success',
                  }),
                )

                return {
                  index,
                  result,
                }
              } catch (imageError) {
                console.error(
                  `Image ${
                    index + 1
                  } processing failed:`,
                  imageError,
                )

                // Mark image as failed
                setImageStatuses(
                  (previous) => ({
                    ...previous,
                    [index]: 'error',
                  }),
                )

                return {
                  index,
                  result: null,
                }
              }
            },
          ),
        )

      // ====================
      // 4. Store Successful Results
      // ====================

      const successfulResults =
        processedResults
          .filter(
            ({ result }) =>
              result !== null,
          )
          .sort(
            (a, b) =>
              a.index - b.index,
          )
          .map(
            ({ result }) =>
              result,
          )

      setResults(successfulResults)

    } catch (requestError) {
        setError(getFriendlyErrorMessage(requestError))
        setImageStatuses(prev =>
          Object.fromEntries(Object.keys(prev).map(k => [k, 'error']))
        )
      } finally {
        setIsLoading(false)
      }
        }

  return {
    // ====================
    // Prompt State
    // ====================

    category,
    setCategory,

    type,
    setType,

    optionOne,
    setOptionOne,

    optionTwo,
    setOptionTwo,

    optionThree,
    setOptionThree,

    description,
    setDescription,

    // ====================
    // Image State
    // ====================

    images,
    setImages,

    imageStatuses,
    results,

    // ====================
    // UI State
    // ====================

    isLoading,
    error,

    loadingMessage:
      LOADING_MESSAGES[
        loadingMessageIndex
      ],

    isFormComplete,

    // ====================
    // Actions
    // ====================

    handleImageEdit,
  }
}

export default useImageEditor