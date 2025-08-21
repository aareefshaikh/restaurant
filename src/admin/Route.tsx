import type React from "react";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const admin = localStorage.getItem("admin");
  if (!admin) return <Navigate to="/admin/login" replace />;
  return children;
}
