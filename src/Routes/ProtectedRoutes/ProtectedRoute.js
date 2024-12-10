// Components/ProtectedRoute.js
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { getIsAYA } from "../../Utils/academivYear";
import { toast } from "react-hot-toast";

const ProtectRoute = ({ Component, allowedRoles }) => {
  const isSignedIn = useSelector((store) => store.common.auth.isLoggedIn);
  const userRole = useSelector((store) => store.common.auth.role);
  const groupedRoles = useSelector((store) => store.common.auth.userRoles); // Access grouped roles from Redux
  const isAcademicYearActive = getIsAYA();

  const location = useLocation();

  // If user is not signed in, redirect to login page
  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  // If role is not allowed, redirect to login page
  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    toast.error("You do not have permission to access this page.");
    return <Navigate to="/" replace />;
  }

  // Admin-specific redirections
  if (userRole === "admin") {
    if (
      isAcademicYearActive === true &&
      location.pathname === "/create_academicYear"
    ) {
      return <Navigate to="/dashboard" replace />;
    }

    if (
      isAcademicYearActive === false &&
      location.pathname !== "/create_academicYear"
    ) {
      return <Navigate to="/create_academicYear" replace />;
    }
  }

  // If accessing /select_role
  if (location.pathname === "/select_role") {
    if (userRole === "admin") {
      toast.error("Admins do not need to select roles.");
      return <Navigate to="/dashboard" replace />;
    }
    if (!groupedRoles || groupedRoles.length === 0) {
      toast.error("No roles available to select.");
      return <Navigate to="/dashboard" replace />;
    }
  }

  // For users with multiple roles and no selected role, redirect to /select_role
  if (
    groupedRoles &&
    groupedRoles.length > 1 &&
    !userRole &&
    location.pathname !== "/select_role"
  ) {
    toast.error("Please select a role to continue.");
    return <Navigate to="/select_role" replace />;
  }

  // Otherwise, render the protected component
  return <Component />;
};

export default ProtectRoute;
