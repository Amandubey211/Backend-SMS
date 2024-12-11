import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FaBan } from "react-icons/fa";

// **Access Denied Component**
const AccessDenied = () => (
  <motion.div
    className="w-full h-full flex items-center justify-center bg-red-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    <motion.div
      className="access-denied p-8 text-center text-red-700 bg-red-100 border border-red-300 rounded-md shadow-lg"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <FaBan className="mx-auto mb-4 text-5xl" />
      <h3 className="text-2xl font-semibold mb-2">Access Denied</h3>
      <p className="text-md">
        You do not have permission to view this section.
      </p>
    </motion.div>
  </motion.div>
);

// **ProtectedSection Component**
const ProtectedSection = ({ requiredPermission, children }) => {
  const { permissions, role, loading, error } = useSelector((state) => ({
    permissions: state.common.auth.permissions,
    role: state.common.auth.role, // Fetch role from state
    loading: state.common.auth.loading,
    error: state.common.auth.error,
  }));

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-yellow-50">
        <p>Error loading permissions: {error}</p>
      </div>
    );
  }

  // Bypass permission checks for admin
  if (role === "admin") {
    return <div className="w-full h-full">{children}</div>;
  }

  const hasPermission = permissions.includes(requiredPermission);

  return hasPermission ? (
    <div className="w-full h-full">{children}</div>
  ) : (
    <AccessDenied />
  );
};

// **Memoize to prevent unnecessary re-renders**
export default React.memo(ProtectedSection);
