function useHeader({
  isAuthenticated,
  currentPage,
  enteredViaDemo,
}) {
  const isLandingPage =
    currentPage === 'landing'

  const isVerificationPage =
    currentPage === 'verification'

  const isMainPage =
    currentPage === 'main'

  const isHistoryPage =
    currentPage === 'history'

  const showDemo =
    isLandingPage

  const showAuth =
    isLandingPage ||
    isVerificationPage ||
    (
      isMainPage &&
      !isAuthenticated &&
      enteredViaDemo
    )

  const showProfile =
    isAuthenticated &&
    (
      isMainPage ||
      isHistoryPage
    )

  const showHistory =
    isAuthenticated &&
    (
      isMainPage ||
      isHistoryPage
    )

  return {
    showDemo,
    showAuth,
    showProfile,
    showHistory,
  }
}

export default useHeader