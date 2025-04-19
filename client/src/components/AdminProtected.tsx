import { RootState } from "../app/store";
import { ReactElement } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function AdminProtected({
  children,
}: {
  children: ReactElement;
}) {
  const { admin } = useSelector((state: RootState) => state.admin);

  if (!admin) {
    return <Navigate to="/admin/login" />;
  }

  return children;
}
