import React, { useState } from "react";
import AdminDashLayout from "../../../../Components/Admin/AdminDashLayout";
import CardsSection from "./Components/CardSection";
import TotalEarningGraph from "./TotalEarningGraph";
import SummaryTotalRevenue from "./SummaryTotalRevenue";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import { FiUserPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Layout from "../../../../Components/Common/Layout";

const EarningMainSection = () => {
  useNavHeading("Finance", "Earnings");
  const navigate = useNavigate();

  const limit = 3; // cards to show in single row
  useNavHeading("Finance", "Earnings");

  return (
    <Layout title="Earning Dashboard | Student Diwan">
      <AdminDashLayout>
        <div className="w-[100%] p-8">
          {/* Header Section */}
          <div className="flex justify-end items-center">
            <button
              onClick={() => navigate("/finance/earning/add")}
              className="inline-flex items-center border border-gray-300 rounded-full ps-4 bg-white hover:shadow-lg transition duration-200 gap-2"
            >
              <span className="text-gray-800 font-medium">Add New Earning</span>
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
                <FiUserPlus size={16} />
              </div>
            </button>
          </div>
          <CardsSection />
          <TotalEarningGraph />
          <SummaryTotalRevenue />
        </div>
      </AdminDashLayout>
    </Layout>
  );
};

export default EarningMainSection;
