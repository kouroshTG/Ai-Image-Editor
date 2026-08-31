import { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom'

import Header from './Components/Header'
import ProtectedRoute from './Components/ProtectedRoute'
import AdminRoute from './Components/AdminRoute'

import {
  getCurrentUser,
  logoutUser,
} from './services/api/authApi'

import LandingPage from './pages/LandingPage'
import Verification from './pages/Verificationpage'
import MainPage from './pages/Mainpage'
import AuthPage from './pages/AuthPage'
import HistoryPage from './pages/HistoryPage'
import AdminPage from './pages/AdminPage'

import useHeader from './hooks/useHeader'

function AppContent() {
  const navigate = useNavigate()
  const location = useLocation()

  const [isAuthenticated, setIsAuthenticated] =
    useState(false)

  const [currentUser, setCurrentUser] =
    useState(null)

  const [isAuthLoading, setIsAuthLoading] =
    useState(true)

  const [enteredViaDemo, setEnteredViaDemo] =
    useState(() => {
      return (
        sessionStorage.getItem(
          'enteredViaDemo',
        ) === 'true'
      )
    })

  // ====================
  // Check Authentication
  // ====================

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const data = await getCurrentUser()

        const user = data?.user || data

        if (!user) {
          throw new Error(
            'User not found',
          )
        }

        setCurrentUser(user)
        setIsAuthenticated(true)

        localStorage.setItem(
          'user',
          JSON.stringify(user),
        )
      } catch (error) {
        console.error(
          'Authentication check failed:',
          error,
        )

        setCurrentUser(null)
        setIsAuthenticated(false)

        localStorage.removeItem('user')
      } finally {
        setIsAuthLoading(false)
      }
    }

    checkAuthentication()
  }, [])

  // ====================
  // Logout
  // ====================

  const handleLogout = async () => {
    try {
      await logoutUser()
    } catch (error) {
      console.error(
        'Logout failed:',
        error,
      )
    } finally {
      setIsAuthenticated(false)
      setCurrentUser(null)

      setEnteredViaDemo(false)

      sessionStorage.removeItem(
        'enteredViaDemo',
      )

      localStorage.removeItem('user')

      navigate('/', {
        replace: true,
      })
    }
  }

  // ====================
  // Demo
  // ====================

  const handleDemoClick = () => {
    sessionStorage.setItem(
      'enteredViaDemo',
      'true',
    )

    setEnteredViaDemo(true)

    navigate('/verification')
  }

  // ====================
  // Auth
  // ====================

  const handleAuthClick = () => {
    sessionStorage.removeItem(
      'enteredViaDemo',
    )

    setEnteredViaDemo(false)

    navigate('/auth')
  }

  // ====================
  // Verification
  // ====================

  const handleVerificationComplete = () => {
    navigate('/main', {
      replace: true,
    })
  }

  // ====================
  // Login
  // ====================

  const handleLogin = async () => {
    try {
      const data = await getCurrentUser()

      const user = data?.user || data

      setCurrentUser(user)
      setIsAuthenticated(true)

      localStorage.setItem(
        'user',
        JSON.stringify(user),
      )

      sessionStorage.removeItem(
        'enteredViaDemo',
      )

      setEnteredViaDemo(false)

      navigate('/main', {
        replace: true,
      })
    } catch (error) {
      console.error(
        'Failed to load authenticated user:',
        error,
      )

      setIsAuthenticated(false)
      setCurrentUser(null)
    }
  }

  // ====================
  // Profile
  // ====================

  const handleProfileClick = () => {
    console.log(
      'Profile clicked:',
      currentUser,
    )
  }

  // ====================
  // History
  // ====================

  const handleHistoryClick = () => {
    navigate('/history')
  }

  // ====================
  // Home
  // ====================

  const handleHomeClick = () => {
    navigate('/main', {
      replace: true,
    })
  }


  // ====================
// Admin
// ====================

const handleAdminClick = () => {
  navigate('/admin')
}

  // ====================
  // Loading
  // ====================

  if (isAuthLoading) {
    return null
  }

  // ====================
  // Current Page
  // ====================

  const currentPage =
    location.pathname === '/'
      ? 'landing'
      : location.pathname.slice(1)

  // ====================
  // Header
  // ====================

  const {
    showDemo,
    showAuth,
    showProfile,
  } = useHeader({
    isAuthenticated,
    currentPage,
    enteredViaDemo,
  })

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-gradient-to-br from-purple-300 via-purple-50 to-violet-300">
      <Header
      onDemoClick={handleDemoClick}
      onAuthClick={handleAuthClick}
      onProfileClick={handleProfileClick}
      onHistoryClick={handleHistoryClick}
      onLogout={handleLogout}
      onHomeClick={handleHomeClick}
      onAdminClick={handleAdminClick}
      showDemo={showDemo}
      showAuth={showAuth}
      showProfile={showProfile}
    />

      <main className="min-h-0 flex-1 overflow-auto">
        <Routes>

          {/* Landing */}

          <Route
            path="/"
            element={<LandingPage />}
          />

          {/* Verification */}

          <Route
            path="/verification"
            element={
              <Verification
                onVerified={
                  handleVerificationComplete
                }
              />
            }
          />

          {/* Authentication */}

          <Route
            path="/auth"
            element={
              <AuthPage
                onLogin={handleLogin}
              />
            }
          />

          {/* Main */}

          <Route
            path="/main"
            element={
              <ProtectedRoute
                isAuthenticated={
                  isAuthenticated
                }
                allowDemo={true}
                isDemo={enteredViaDemo}
              >
                <MainPage />
              </ProtectedRoute>
            }
          />

          {/* History */}

          <Route
            path="/history"
            element={
              <ProtectedRoute
                isAuthenticated={
                  isAuthenticated
                }
              >
                <HistoryPage />
              </ProtectedRoute>
            }
          />

          {/* Admin */}

          <Route
            path="/admin"
            element={
              <AdminRoute
                user={currentUser}
              >
                <AdminPage />
              </AdminRoute>
            }
          />

          {/* Not Found */}

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App