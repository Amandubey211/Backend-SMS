// src/Modules/Admin/Finance/EntityRevenue/EntityRevenueMain.js
import React, { useState, useEffect } from "react";
import EntityCardSection from "./Components/EntityCardSection.js"; 
import EntityRevenueGraph from "./Components/EntityRevenueGraph.js";
import EntityRevenueSummaryTable from "./Components/EntityRevenueSummaryTable.js";
import { GiTakeMyMoney } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../config/permission";
import RevenueContainer from "./Components/EntityGraphContainer.js";

const EntityRevenueMain = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return ( 
    <div className="p-4 md:p-4 space-y-2 scroll-smooth overflow-y-auto h-full w-full ">
      {/* Header Section */}
  
      <div className="flex flex-col md:flex-row justify-end items-start md:items-center gap-4 md:gap-0 ">
        <button
          onClick={() => navigate("/finance/entity/add/revenue")}
          className="inline-flex  items-center border border-gray-300 rounded-full ps-4 bg-white hover:shadow-lg transition duration-200 gap-2"
        >
          <span className="text-gray-800 font-medium">Add New Invoice</span>
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
        <EntityCardSection />
        </ProtectedSection>
        {/* Graph Section */}
        <ProtectedSection requiredPermission={PERMISSIONS.SHOWS_GRAPH_FOR_Entity_FEES} title={'Graph'}>
        <div className="w-full ">
          <RevenueContainer />
        </div>
        </ProtectedSection>
        {/* Summary Table */}
        <ProtectedSection requiredPermission={PERMISSIONS.SUMMARY_OF_Entity_FEES} title={'Summary'}>
        <div className="w-full">
          <EntityRevenueSummaryTable />
        </div>
        </ProtectedSection>
      </motion.div>


    </div>
  );
};

export default EntityRevenueMain;
