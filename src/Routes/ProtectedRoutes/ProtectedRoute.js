import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { getIsAYA } from "../../Utils/academivYear";
import { toast } from "react-hot-toast";

const ProtectRoute = ({ Component, allowedRoles }) => {
  const isSignedIn = useSelector((store) => store.common.auth.isLoggedIn);
  const userRole = useSelector((store) => store.common.auth.role);
  const groupedRoles = useSelector((store) => store.common.auth.userRoles);
  const isAcademicYearActive = getIsAYA(); // This now returns a boolean value
  const location = useLocation();

  // Redirect to login if not signed in
  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  // Check allowed roles if defined
  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  // Admin-specific redirections:
  // - Force to /create_academicYear if academic year is inactive.
  // - If already on /create_academicYear but academic year is active, redirect away.
  if (userRole === "admin") {
    if (!isAcademicYearActive && location.pathname !== "/create_academicYear") {
      return <Navigate to="/create_academicYear" replace />;
    }
    if (isAcademicYearActive && location.pathname === "/create_academicYear") {
      return <Navigate to="/select_branch" replace />;
    }
  }

  // Handling /select_role for non-admin users
  if (location.pathname === "/select_role") {
    if (userRole === "admin") {
      return <Navigate to="/select_branch" replace />;
    }
    if (groupedRoles && groupedRoles.length > 1 && !userRole) {
      return <Component />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  // For users with multiple roles and no selected role, force role selection
  if (groupedRoles && groupedRoles.length > 1 && !userRole) {
    return <Navigate to="/select_role" replace />;
  }

  // Otherwise, render the protected component
  return <Component />;
};

export default ProtectRoute;
