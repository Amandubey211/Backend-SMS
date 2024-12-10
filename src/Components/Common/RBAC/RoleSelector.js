// Components/RoleSelector.js
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { staffLogout } from "../../../Store/Slices/Common/Auth/actions/staffActions"; // Ensure correct import

import Layout from "../Layout";
import toast from "react-hot-toast"; // Import toast for notifications

// SVG assets
import library from "../../../Assets/RBAC/library.svg";
import Staff from "../../../Assets/RBAC/Staff.svg";
import finance from "../../../Assets/RBAC/finance.svg";
import teacher from "../../../Assets/RBAC/teacher.svg";
import { setRole } from "../../../Store/Slices/Common/Auth/reducers/authSlice";

const RoleSelector = () => {
  const [selectedRole, setSelectedRole] = useState(null); // Track the selected role
  const dispatch = useDispatch(); // Redux dispatch for actions
  const navigate = useNavigate();
  const groupedRoles = useSelector((store) => store.common.auth.userRoles);

  useEffect(() => {
    if (!groupedRoles || groupedRoles.length === 0) {
      toast.error("No roles available to select.");
      navigate("/dashboard"); // Redirect if no grouped roles are available
    }
  }, [groupedRoles, navigate]);

  const handleLogout = () => {
    dispatch(staffLogout());
    navigate("/"); // Redirect to login after logout
  };

  const handleConfirm = () => {
    if (selectedRole) {
      // Dispatch the selected role to Redux
      dispatch(setRole(selectedRole));
      navigate("/dashboard", { replace: true });
    } else {
      toast.error("Please select a role before proceeding.");
    }
  };

  const rolesWithIcons = groupedRoles.map((group) => {
    // Assign icons based on department
    let icon;
    switch (group.department.toLowerCase()) {
      case "librarian":
        icon = library;
        break;
      case "teacher":
        icon = teacher;
        break;
      case "finance":
        icon = finance;
        break;
      case "staff":
        icon = Staff;
        break;
      default:
        icon = Staff; // default icon
    }
    return { ...group, icon };
  });

  return (
    <Layout title="Select Role | Student Diwan">
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
        {/* Title */}
        <motion.h1
          className="text-xl md:text-2xl font-bold text-purple-700 mb-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Choose your Department and Role
        </motion.h1>

        {/* Roles Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-6xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          role="list"
          aria-label="Available Roles"
        >
          {rolesWithIcons.map((role) => (
            <motion.div
              key={role.department}
              onClick={() => setSelectedRole(role.department)} // Set active role on click
              whileHover={{
                boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)", // Keep shadow on hover
              }}
              className={`flex flex-col items-center justify-center p-4 rounded-lg transition duration-300 cursor-pointer focus:outline-none focus:ring-4 focus:ring-purple-300 ${
                selectedRole === role.department ? "bg-pink-50" : "bg-white"
              }`}
              tabIndex={0}
              role="listitem"
              aria-label={`Select ${role.department} role`}
              style={{
                border: "2px solid transparent", // Consistent border for all cards
                background:
                  selectedRole === role.department
                    ? "linear-gradient(white, #FFC0CB) padding-box, linear-gradient(to right, #ff007f, #ff0080) border-box" // Dark pink and white gradient for active
                    : "linear-gradient(white, white) padding-box, linear-gradient(to right, #ff0080, #7928ca) border-box", // Default gradient for inactive
              }}
            >
              <div className="w-16 h-16 mb-4" aria-hidden="true">
                <img
                  src={role.icon}
                  alt={`${role.department} icon`}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-lg font-medium text-gray-700">
                {role.department}
              </span>
              <ul className="text-sm text-gray-500">
                {role.role.map((r, idx) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Buttons */}
        <motion.div
          className="flex justify-between w-full max-w-6xl mt-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-40 px-6 py-2 text-purple-700 border border-purple-500 rounded-md hover:bg-purple-50 shadow transition focus:outline-none focus:ring-4 focus:ring-purple-300"
            onClick={handleLogout}
            aria-label="Log out"
          >
            Log Out
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-40 px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md shadow hover:opacity-90 transition focus:outline-none focus:ring-4 focus:ring-purple-300"
            onClick={handleConfirm}
            aria-label="Confirm role selection"
          >
            Done
          </motion.button>
        </motion.div>
      </div>
    </Layout>
  );
};

export default RoleSelector;
