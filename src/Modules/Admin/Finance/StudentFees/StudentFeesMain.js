// src/Modules/Admin/Finance/StudentFees/StudentFeesMain.js
import React, { useState, useEffect } from "react";
import StudentCardSection from "./Components/StudentCardSection"; // Reused Cards Section for Students
import StudentFeesGraph from "./Components/StudentFeesGraph";
import StudentFeesSummaryTable from "./Components/StudentFeesSummaryTable";
import AddNewFeeSidebar from "./Components/AddNewFeeSidebar";
import { FiPlus, FiUserPlus } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllIncomes } from "../../../../Store/Slices/Finance/Earnings/earningsThunks";
import { FaPlusCircle } from "react-icons/fa";

const StudentFeesMain = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { incomes, loading, error, totalRecords } = useSelector(
    (state) => state.admin.earnings
  );
useEffect(() => {
  dispatch(fetchAllIncomes({ page: 1, limit: 20,categoryName:"Student-Based Revenue",includeDetails:true})); 
}, [dispatch]);

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
    <div className="p-4 md:p-4 space-y-2 scroll-smooth overflow-y-auto h-full w-full ">
      {/* Header Section */}
  
      <div className="flex flex-col md:flex-row justify-end items-start md:items-center gap-4 md:gap-0 ">
        <button
          onClick={() => navigate("/finance/studentfees/add/form")}
          className="inline-flex  items-center border border-gray-300 rounded-full ps-4 bg-white hover:shadow-lg transition duration-200 gap-2"
        >
          <span className="text-gray-800 font-medium">Add New Fees</span>
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
          <FiPlus size={16} />
          </div>
        </button>
      </div>
      {/* Animate Content Pushdown */}
      <motion.div
        animate={{ y: isDropdownOpen ? 120 : 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 flex flex-col space-y-2"
      >
        {/* Cards Section */}
        <StudentCardSection />
       
        {/* Graph Section */}
        <div className="w-full ">
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
