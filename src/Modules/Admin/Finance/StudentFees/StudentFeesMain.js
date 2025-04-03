// src/Modules/Admin/Finance/StudentFees/StudentFeesMain.js
import React, { useState, useEffect } from "react";
import StudentCardSection from "./Components/StudentCardSection"; 
import StudentFeesSummaryTable from "./Components/StudentFeesSummaryTable";
import { GiTakeMyMoney } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllIncomes } from "../../../../Store/Slices/Finance/Earnings/earningsThunks";
import { FaPlusCircle } from "react-icons/fa";
import { MdAttachMoney } from "react-icons/md";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../config/permission";
import GraphContainer from "./Components/GraphContainer";

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
          <GiTakeMyMoney size={20} />
          </div>
        </button>
      </div>
      {/* Animate Content Pushdown */}
      <motion.div
        animate={{ y: isDropdownOpen ? 120 : 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 flex flex-col space-y-2"
      >
        <ProtectedSection requiredPermission={PERMISSIONS.SHOWS_REVENUE_CARD_DATA_IN_DASHBOARD} title={'Cards'}>
        {/* Cards Section */}
        <StudentCardSection />
        </ProtectedSection>
        {/* Graph Section */}
        <ProtectedSection requiredPermission={PERMISSIONS.SHOWS_GRAPH_FOR_STUDENT_FEES} title={'Graph'}>
        <div className="w-full ">
          <GraphContainer />
        </div>
        </ProtectedSection>
        {/* Summary Table */}
        <ProtectedSection requiredPermission={PERMISSIONS.SUMMARY_OF_STUDENT_FEES} title={'Summary'}>
        <div className="w-full">
          <StudentFeesSummaryTable />
        </div>
        </ProtectedSection>
      </motion.div>


    </div>
  );
};

export default StudentFeesMain;
