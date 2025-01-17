import React from "react";
import Layout from "../../../../../../Components/Common/Layout";
import AdminDashLayout from "../../../../../../Components/Admin/AdminDashLayout";
import useNavHeading from "../../../../../../Hooks/CommonHooks/useNavHeading ";
import SummaryPenalityandAdjustment from "./SummaryRenalityandAdjustment";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import CardSection from "../Components/CardSection";
import ProtectedSection from "../../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../../config/permission";

const AdjustmentDashboard = () => {
  useNavHeading("Finance", "Penality & Adjustment");
  const navigate = useNavigate();
  return (
    <Layout title={"Penality & Adjustment | Student Diwan"}>
      <AdminDashLayout>
        <div className="w-[100%] p-8">
          {/* Header Section */}
          <ProtectedSection requiredPermission={PERMISSIONS.FINANCE_CREATE_NEW_ADJUSTMENT}>
            <div className="flex justify-end items-center">
              <button
                onClick={() => navigate("/finance/penaltyAdjustment/add-new-penalty-adjustment")}
                className="inline-flex items-center border border-gray-300 rounded-full ps-4 bg-white hover:shadow-lg transition duration-200 gap-2"
              >
                <span className="text-gray-800 font-medium">Add New Adjustment</span>
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
                  <FiPlus size={16} />
                </div>
              </button>
            </div>
          </ProtectedSection>

          {/* Card Section */}
          <ProtectedSection requiredPermission={PERMISSIONS.FINANCE_SHOWS_CARD_DATA_OF_PENALTY_AND_ADJUSTMENT}>
            <CardSection />
          </ProtectedSection>

          {/* Summary Section */}
          <ProtectedSection requiredPermission={PERMISSIONS.FINANCE_SHOWS_SUMMARY_OF_RETURN_INVOICE}>
            <SummaryPenalityandAdjustment />
          </ProtectedSection>

        </div>

      </AdminDashLayout>
    </Layout>
  );
};

export default AdjustmentDashboard;
