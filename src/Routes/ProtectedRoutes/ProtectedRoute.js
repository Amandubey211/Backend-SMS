import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import Cookies from 'js-cookie'
const ProtectRoute = ({ Component, allowedRoles }) => {
  const isSignedIn = useSelector((store) => store.common.auth.isLoggedIn);
  const userRole = useSelector((store) => store.common.auth.role);
  console.log(isSignedIn, userRole,"-------");
  const isAcademicYearActive =  Cookies.get("isAcademicYearActive")

  const location = useLocation();

  // If user is not signed in or role is not allowed, redirect to login page
  if (!isSignedIn || (allowedRoles && !allowedRoles.includes(userRole))) {
    return <Navigate to="/" replace />;
  }

  // If the user is admin and trying to access the academic year creation page
  // but the academic year is already active, redirect to dashboard
  if (
    userRole === "admin" &&
    isAcademicYearActive === true &&
    location.pathname === "/create_academicYear"
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  // If academic year is not active and user is trying to access other pages, redirect to create academic year
  if (
    userRole === "admin" &&
    isAcademicYearActive === false &&
    location.pathname !== "/create_academicYear"
  ) {
    return <Navigate to="/create_academicYear" replace />;
  }

  // Otherwise, render the protected component
  return <Component />;
};

export default ProtectRoute;
