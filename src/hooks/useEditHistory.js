import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  getEditHistory,
  deleteHistoryItem,
  deleteAllHistory,
} from '../services/api/imageapi'

function useEditHistory() {
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] =
    useState(true)
  const [error, setError] = useState('')

  // ====================
  // Get History
  // ====================

  const fetchHistory = useCallback(
    async () => {
      setIsLoading(true)
      setError('')

      try {
        const data =
          await getEditHistory()

        setHistory(data)
      } catch (requestError) {
        console.error(
          'Get edit history error:',
          requestError,
        )

        setHistory([])

        setError(
          requestError.message ||
            'دریافت تاریخچه با مشکل مواجه شد.',
        )
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  // ====================
  // Delete One Item
  // ====================

  const deleteItem = useCallback(
    async (historyId) => {
      try {
        setError('')

        await deleteHistoryItem(
          historyId,
        )

        setHistory(
          (previousHistory) =>
            previousHistory.filter(
              (item) =>
                item._id !== historyId,
            ),
        )
      } catch (requestError) {
        console.error(
          'Delete history error:',
          requestError,
        )

        setError(
          requestError.message ||
            'حذف تاریخچه با مشکل مواجه شد.',
        )
      }
    },
    [],
  )

  // ====================
  // Delete All
  // ====================

  const deleteAll =
    useCallback(async () => {
      try {
        setError('')

        await deleteAllHistory()

        setHistory([])
      } catch (requestError) {
        console.error(
          'Delete all history error:',
          requestError,
        )

        setError(
          requestError.message ||
            'حذف تاریخچه با مشکل مواجه شد.',
        )
      }
    }, [])

  // ====================
  // Initial Fetch
  // ====================

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  return {
    history,
    isLoading,
    error,
    refetchHistory: fetchHistory,
    deleteItem,
    deleteAll,
  }
}

export default useEditHistory