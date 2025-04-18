import { useSelector } from "react-redux"
import { RootState } from "../app/store" 
import { ReactElement } from "react"
import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children }: { children: ReactElement }) {
  const { user } = useSelector((state: RootState) => state.auth)

  if (!user) {
    return <Navigate to="/login" />
  }

  return children
}
