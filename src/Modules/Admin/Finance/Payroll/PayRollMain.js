import React from 'react'
import PayRollCards from './PayRollCards';
import { GiTakeMyMoney } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../config/permission";
import PayRollGraph from './PayRollGraph.js';
import PayrollSummaryTable from './PayrollSummaryList.js';

export default function PayRollMain() {
  const navigate = useNavigate()
  return (
    <div className="p-4">
          {/* Header Section */}
      
          <div className="flex flex-row items-center justify-between ">
              <div className="font-semibold text-2xl">
                PayRoll Planner
              </div>
        
            <button
              onClick={() => navigate("/finance/add/payroll")}
              className="inline-flex  items-center border border-gray-300 rounded-full ps-4 bg-white hover:shadow-lg transition duration-200 gap-2"
            >
              <span className="text-gray-800 font-medium">Create PayRoll</span>
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
              <GiTakeMyMoney size={20} />
              </div>
            </button>
          </div>
     
            <ProtectedSection requiredPermission={PERMISSIONS} title={'Cards'}>
            {/* Cards Section */}
          <PayRollCards/>
            </ProtectedSection>
            {/* Graph Section */}
            <ProtectedSection requiredPermission={PERMISSIONS} title={'Graph'}>
            <div className="w-full h-full ">
              <PayRollGraph/>
            </div>
            </ProtectedSection>
            {/* Summary Table */}
            <ProtectedSection requiredPermission={PERMISSIONS} title={'Summary'}>
            <div className="w-full mt-4">
            <PayrollSummaryTable/>
            </div>
            </ProtectedSection>
        </div>
  )
}
