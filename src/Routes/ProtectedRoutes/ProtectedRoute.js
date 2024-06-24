import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectRoute = ({ Component, allowedRoles }) => {
  const isSignedIn = useSelector((store) => store.Auth.isLoggedIn);
  const userRole = useSelector((store) => store.Auth.role);

  if (!isSignedIn || (allowedRoles && !allowedRoles.includes(userRole))) {
    return <Navigate to="/" />;
  }

  return <Component />;
};

export default ProtectRoute;
