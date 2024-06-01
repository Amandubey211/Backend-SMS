import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectRoute = ({ Component: Component, role }) => {
  const isSignedIn = useSelector((store) => store.Auth.isLoggedIn);
  const userRole = useSelector((store) => store.Auth.role);

  if ((role && userRole !== role) || !isSignedIn) {
    return <Navigate to="/" />;
  }

  return <Component />;
};

export default ProtectRoute;
