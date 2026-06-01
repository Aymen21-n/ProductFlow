import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthContext'
import type { User } from '../types'

interface PrivateRouteProps {
  children: ReactNode
  role?: User['role']
}

export function PrivateRoute({ children, role }: PrivateRouteProps) {
  const { state } = useAuth()

  console.log('PrivateRoute state:', state)

  if (!state.user || !state.token) {
    return <Navigate to="/login" replace />
  }

  if (role && state.user.role !== role) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}

export default PrivateRoute
