// src/Modules/Admin/Finance/StudentFees/StudentFeesMain.js
import React, { useState, useEffect } from "react";
import StudentCardSection from "./Components/StudentCardSection"; // Reused Cards Section for Students
import StudentFeesGraph from "./Components/StudentFeesGraph";
import StudentFeesSummaryTable from "./Components/StudentFeesSummaryTable";
import AddNewFeeSidebar from "./Components/AddNewFeeSidebar";
import { FiUserPlus } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const StudentFeesMain = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.admin.studentFees);

  // Handlers for Sidebar
  const handleSidebarOpen = () => setIsSidebarVisible(true);
  const handleSidebarClose = () => setIsSidebarVisible(false);

  // Dropdown toggle
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  // Effect to toggle scrollbar visibility
  useEffect(() => {
    if (isSidebarVisible) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = ""; // Restore scrolling
    }
    return () => {
      document.body.style.overflow = ""; // Ensure cleanup on unmount
    };
  }, [isSidebarVisible]);

  // Handler to submit new fee data
  const handleAddNewFee = async (feeData) => {
    try {
      // await dispatch(createStudentFee(feeData)).unwrap();
      handleSidebarClose();
      // Optionally show success message
    } catch (err) {
      // Error is handled by the slice and ErrorBoundary
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 scroll-smooth overflow-y-auto h-full w-full mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Student Fees
          </h2>
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="px-3 sm:px-4 py-2 bg-white text-gray-800 font-medium rounded-lg border border-gray-300 shadow-sm flex items-center gap-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{
                borderImage: "linear-gradient(to right, #C83B62, #46138A) 1",
                borderRadius: "8px",
              }}
            >
              By Month
              <svg
                className={`w-4 h-4 transform transition-transform ${
                  isDropdownOpen ? "rotate-180" : "rotate-0"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.ul
                  className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg w-36 sm:w-40 z-10"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {["By Week", "By Month", "By Year"].map((option) => (
                    <li
                      key={option}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm sm:text-base"
                      onClick={() => {
                        // Handle option selection (e.g., filter data)
                        setIsDropdownOpen(false);
                        // Implement filtering logic here
                      }}
                    >
                      {option}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>
        <button
          onClick={() => navigate("/finance/studentfees/add/form")}
          className="inline-flex items-center border border-gray-300 rounded-full ps-4 bg-white hover:shadow-lg transition duration-200 gap-2"
        >
          <span className="text-gray-800 font-medium">Add New Fee</span>
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
            <FiUserPlus size={16} />
          </div>
        </button>
      </div>

      {/* Animate Content Pushdown */}
      <motion.div
        animate={{ y: isDropdownOpen ? 120 : 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 flex flex-col space-y-6"
      >
        {/* Cards Section */}
        <StudentCardSection />

        {/* Graph Section */}
        <div className="w-full">
          <StudentFeesGraph />
        </div>

        {/* Summary Table */}
        <div className="w-full">
          <StudentFeesSummaryTable />
        </div>
      </motion.div>

      {/* Sidebar for Adding New Fee */}
      <AddNewFeeSidebar
        isOpen={isSidebarVisible}
        onClose={handleSidebarClose}
        onSubmit={handleAddNewFee}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default StudentFeesMain;
