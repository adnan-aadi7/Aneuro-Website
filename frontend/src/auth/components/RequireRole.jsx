import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function RequireRole({ roles = [] }) {
  const location = useLocation();
  const userType = useSelector((s) => s.user.user?.userType);

  const allowed = roles.length === 0 ? true : roles.includes(userType);
  return allowed ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
}
