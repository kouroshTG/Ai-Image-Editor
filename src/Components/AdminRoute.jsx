import { Navigate } from 'react-router-dom'

function AdminRoute({
  user,
  children,
}) {
  if (!user) {
    return (
      <Navigate
        to="/auth"
        replace
      />
    )
  }

  if (user.role !== 'admin') {
    return (
      <Navigate
        to="/main"
        replace
      />
    )
  }

  return children
}

export default AdminRoute