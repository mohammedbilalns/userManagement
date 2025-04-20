import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "../app/store" 
import { ReactElement, useEffect } from "react"
import { Navigate } from "react-router-dom"
import { verifyUser } from "../features/auth/authSlice"
import LoadingSpinner from "./LoadingSpinner"

export default function ProtectedRoute({ children }: { children: ReactElement }) {
  const dispatch = useDispatch<AppDispatch>()
  const { user, isLoading } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (user) {
      dispatch(verifyUser())
    }
  }, [dispatch, user])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return children
}
