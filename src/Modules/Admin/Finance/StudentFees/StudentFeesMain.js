import React, { useState } from "react";
import StudentCardSection from "./Components/StudentCardSection"; // Reused Cards Section for Students
import StudentFeesGraph from "./Components/StudentFeesGraph";
import StudentFeesSummaryTable from "./Components/StudentFeesSummaryTable";
import AddNewFeeSidebar from "./Components/AddNewFeeSidebar";
import { FiUserPlus } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const StudentFeesMain = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Handlers for Sidebar
  const handleSidebarOpen = () => setIsSidebarVisible(true);
  const handleSidebarClose = () => setIsSidebarVisible(false);

  // Dropdown toggle
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Student Fees</h2>
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="px-4 py-2 bg-white text-gray-800 font-medium rounded-lg border border-gray-300 shadow-sm flex items-center gap-2"
              style={{
                borderImage: "linear-gradient(90deg, #C83B62, #46138A) 1",
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
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.ul
                  className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg w-40"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {["By Week", "By Month", "By Year"].map((option) => (
                    <li
                      key={option}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
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
          onClick={handleSidebarOpen}
          className="inline-flex items-center border border-gray-300 rounded-full ps-4 bg-white hover:shadow-lg transition duration-200 gap-2"
        >
          <span className="text-gray-800 font-medium">Add New Fees</span>
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
            <FiUserPlus size={16} />
          </div>
        </button>
      </div>

      {/* Animate Content Pushdown */}
      <motion.div
        animate={{ y: isDropdownOpen ? 120 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Cards Section */}
        <StudentCardSection />

        {/* Graph Section */}
        <div className="mt-6">
          <StudentFeesGraph />
        </div>

        {/* Space between Graph and Summary */}
        <div className="mt-8">
          <StudentFeesSummaryTable />
        </div>
      </motion.div>

      {/* Sidebar */}
      <AddNewFeeSidebar isOpen={isSidebarVisible} onClose={handleSidebarClose} />
    </div>
  );
};

export default StudentFeesMain;
