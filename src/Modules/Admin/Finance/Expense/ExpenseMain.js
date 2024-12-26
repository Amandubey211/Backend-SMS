// src/Modules/Admin/Finance/ExpenseMain.js
import React, { useState, useEffect } from "react";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import CardSection from "./components/CardSection";
import ExpenseChart from "./components/ExpenseChart";
import ExpenseTable from "./components/ExpenseTable";
import { useNavigate } from "react-router-dom";
import { FiPlusCircle, FiUserPlus } from "react-icons/fi";
import Layout from "../../../../Components/Common/Layout";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";

const ExpenseMain = () => {
  const navigate = useNavigate();
  useNavHeading("Finance", "Expenses");
  return (
    <Layout title="Expense | Student Diwan">
      <DashLayout>
        <div className="p-4 md:p-6 space-y-6 scroll-smooth overflow-y-auto h-full w-full mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                Expense Dashboard
              </h2>
            </div>

            <button
              onClick={() => navigate("/finance/expenses/add")}
              className="inline-flex items-center border border-gray-300 rounded-full ps-4 bg-white hover:shadow-lg transition duration-200 gap-2"
            >
              <span className="text-gray-800 font-medium">
                {" "}
                Add New Expense
              </span>
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
                <FiPlusCircle size={16} />
              </div>
            </button>
          </div>

          {/* Cards Section */}
          <CardSection />

          {/* Chart Section */}
          <ExpenseChart />

          {/* Table Section */}
          <ExpenseTable />
        </div>
      </DashLayout>
    </Layout>
  );
};

export default ExpenseMain;
