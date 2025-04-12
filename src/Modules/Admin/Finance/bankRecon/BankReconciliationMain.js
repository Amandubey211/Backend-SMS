
import React, { useState, useEffect } from "react";
import { GiTakeMyMoney } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../config/permission";
import BankReconciliationSummary from "./BankReconciliationSummary.js";
import BankReconciliationGraph from "./BankReconciliationGraph.js";
import BankReconciliationCard from "./BankReconciliationCard.js";
import { FaListCheck } from "react-icons/fa6";

const BankReconciliationMain = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  return (
    <div className="p-4">
      {/* Header Section */}

      <div className="flex flex-row items-center justify-between ">
        <div className="font-semibold text-2xl">
          Bank Reconciliation
        </div>
        <button
          onClick={() => navigate("/finance/start-reconciliations")}
          className="inline-flex  items-center border border-gray-300 rounded-full ps-4 bg-white hover:shadow-lg transition duration-200 gap-2"
        >
          <span className="text-gray-800 font-medium">Start Reconciliation</span>
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
            <FaListCheck size={20} />
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
          <BankReconciliationCard />
        </ProtectedSection>
        {/* Graph Section */}
        <ProtectedSection requiredPermission={PERMISSIONS} title={'Graph'}>
          <div className="w-full h-full">
            <BankReconciliationGraph />
          </div>
        </ProtectedSection>
        {/* Summary Table */}
        <ProtectedSection requiredPermission={PERMISSIONS} title={'Summary'}>
          <div className="w-full mt-4">
            <BankReconciliationSummary />
          </div>
        </ProtectedSection>
      </motion.div>
    </div>
  );
};

export default BankReconciliationMain;
