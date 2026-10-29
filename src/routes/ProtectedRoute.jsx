import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  let currentUser = {}
  try {
    currentUser = JSON.parse(
      localStorage.getItem("currentUser") || "{}"
    );
  } catch {
    currentUser = {};
  }
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    if (currentUser.role === "owner") {
      return <Navigate to="/owner-dashboard" replace />;
    }

    if (currentUser.role === "admin") {
      return <Navigate to="/admin-dashboard" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;