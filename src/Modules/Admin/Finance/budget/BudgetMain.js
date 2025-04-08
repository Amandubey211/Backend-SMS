
import React, { useState, useEffect } from "react";

import { GiTakeMyMoney } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../config/permission";
import BudgetCards from "./BudgetCards.js";
import BudgetGraph from "./BudgetGraph.js";
import Sidebar from "../../../../Components/Common/Sidebar.js";
import BudgetForm from "./CreateBudget.js";
import BudgetSummaryList from "./BudgetSummaryList.js";

const BudgetMain= () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return ( 
    <div className="p-4">
      {/* Header Section */}
  
      <div className="flex flex-row items-center justify-between ">
          <div className="font-semibold text-2xl">
            Budget Planner
          </div>
    
        <button
          onClick={() => setIsModalVisible(true)}
          className="inline-flex  items-center border border-gray-300 rounded-full ps-4 bg-white hover:shadow-lg transition duration-200 gap-2"
        >
          <span className="text-gray-800 font-medium">Create Budget</span>
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
        <ProtectedSection requiredPermission={PERMISSIONS} title={'Cards'}>
        {/* Cards Section */}
      <BudgetCards/>
        </ProtectedSection>
        {/* Graph Section */}
        <ProtectedSection requiredPermission={PERMISSIONS} title={'Graph'}>
        <div className="w-full h-full">
          <BudgetGraph/>
        </div>
        </ProtectedSection>
        {/* Summary Table */}
        <ProtectedSection requiredPermission={PERMISSIONS} title={'Summary'}>
        <div className="w-full mt-4">
         <BudgetSummaryList/>
        </div>
        </ProtectedSection>
      </motion.div>

      <Sidebar
          title={"Create Budget"}
          width="30%"
          isOpen={isModalVisible}
          onClose={handleModalClose}
        >
          <BudgetForm visible={isModalVisible} onClose={handleModalClose}  />
        </Sidebar>
    </div>
  );
};

export default BudgetMain;
