import { Outlet } from 'react-router-dom'
import type { ReactNode } from 'react'

export function ProtectedRoute({ children }: { children?: ReactNode }) {
  return children ? <>{children}</> : <Outlet />
}

export default ProtectedRoute
