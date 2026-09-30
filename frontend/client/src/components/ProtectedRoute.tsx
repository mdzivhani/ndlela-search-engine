import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <p role="status">Loading your account…</p>
  if (!user) {
    // Redirect to login while saving the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return <>{children}</>
}
