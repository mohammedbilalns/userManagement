import { ReactElement } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { Navigate } from "react-router-dom";

export default function AdminPublic({ children }: { children: ReactElement }) {
  const { admin } = useSelector((state: RootState) => state.admin);

  if (admin) {
    return <Navigate to="/admin/dashboard" />;
  }
  return children;
}
