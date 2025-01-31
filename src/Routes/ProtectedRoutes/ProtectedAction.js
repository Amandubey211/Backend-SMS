/**
 * ProtectedAction Component
 *
 * A lightweight component that conditionally shows or hides its children
 * (e.g., a button) based on the user's permissions. Unlike ProtectedSection,
 * this does NOT render any "Access Denied" UI; it simply hides the element
 * if the user lacks permission.
 */

import React from "react";
import { useSelector } from "react-redux";
import { ROLES } from "../../config/permission";

const ProtectedAction = ({ requiredPermission, children, aman }) => {
  // Extract necessary pieces from Redux
  const { permissions, role, loading } = useSelector((state) => ({
    permissions: state.common.auth.permissions,
    role: state.common.auth.role,
    loading: state.common.auth.loading,
  }));

  // If still loading user/permissions, we can either:
  // - return null (hide by default)
  // - or return a spinner/placeholder
  if (loading) {
    return null; // or some small loader if you wish
  }
  if (role === ROLES.ADMIN && aman) {
    return null;
  }

  // Bypass checks if admin
  if (role === ROLES.ADMIN) {
    return <>{children}</>;
  }

  // Check if user has the required permission
  const hasPermission = permissions.includes(requiredPermission);

  // If the user lacks permission, hide the component entirely
  if (!hasPermission) {
    return null;
  }

  // Otherwise, render children (e.g., a button)
  return <>{children}</>;
};

export default React.memo(ProtectedAction);
