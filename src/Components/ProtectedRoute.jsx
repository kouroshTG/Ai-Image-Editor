import { Navigate } from 'react-router-dom'

function ProtectedRoute({
  isAuthenticated,
  allowDemo = false,
  isDemo = false,
  children,
}) {
  if (!isAuthenticated && !(allowDemo && isDemo)) {
    return <Navigate to="/auth" replace />
  }

  return children
}

export default ProtectedRoute