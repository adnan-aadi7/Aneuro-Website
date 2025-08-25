import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isJwtExpired } from "../utils/jwt";

export default function RequireAuth() {
  const location = useLocation();
  const tokenFromStore = useSelector((s) => s.user.token);
  const user = useSelector((s) => s.user.user);

  const token = tokenFromStore || localStorage.getItem("token");
  const authed = Boolean(token) && !isJwtExpired(token) && Boolean(user?.id || user?._id);

  // If token expired, clean up a bit (lightweight)
  useEffect(() => {
    if (token && isJwtExpired(token)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [token]);

  return authed ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
}
