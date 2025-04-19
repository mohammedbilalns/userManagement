import { RootState } from "../app/store";
import { ReactElement, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function AdminProtected({
  children,
}: {
  children: ReactElement;
}) {
  const { admin } = useSelector((state: RootState) => state.admin);
  const navigate = useNavigate();

  useEffect(() => {
    if (!admin) {
      navigate("/admin/login", { replace: true });
    }
  }, [admin, navigate]);

  if (!admin) {
    return null;
  }

  return children;
}
