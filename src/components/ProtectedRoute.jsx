import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute() {
  const { currentUser, loading } = useAuth()

  // Wait for session restore before deciding to redirect
  if (loading) return null

  return currentUser ? <Outlet /> : <Navigate to="/login" replace />
}
