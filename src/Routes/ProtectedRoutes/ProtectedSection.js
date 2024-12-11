import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FaBan } from "react-icons/fa";
import { ROLES } from "../../config/permission";
import Spinner from "../../Components/Common/Spinner";

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
      className="p-8 text-center   text-red-700 bg-red-100 border border-red-300 rounded-lg shadow-lg"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <FaBan className="mx-auto mb-4  text-5xl" />
      <h3 className="text-2xl z-40 font-semibold mb-2">Access Denied</h3>
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
    role: state.common.auth.role,
    loading: state.common.auth.loading,
    error: state.common.auth.error,
  }));

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <Spinner />
      </div>
    );
  }

  // Bypass permission checks for admin role
  if (role === ROLES.ADMIN) {
    return <div className="w-full h-full">{children}</div>;
  }

  // Check if user has required permission
  const hasPermission = permissions.includes(requiredPermission);

  return hasPermission ? (
    <div className="w-full h-full">{children}</div>
  ) : (
    <div className="w-full h-full relative">
      {/* Apply the blur effect to the content */}
      <div className="absolute inset-0  backdrop-opacity-95  backdrop-blur-sm " />
      <AccessDenied />
    </div>
  );
};

// **Memoize to prevent unnecessary re-renders**
export default React.memo(ProtectedSection);
