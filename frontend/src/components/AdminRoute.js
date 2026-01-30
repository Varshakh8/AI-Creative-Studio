import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const isAdminLocal = localStorage.getItem("is_admin"); // 🔥 from login response

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    // ✅ Double verification (JWT + localStorage)
    const isAdmin =
      decoded.is_admin === true ||
      decoded.is_admin === "true" ||
      isAdminLocal === "true";

    if (!isAdmin) {
      return <Navigate to="/dashboard" replace />;
    }

    return children;
  } catch (err) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }
};

export default AdminRoute;
