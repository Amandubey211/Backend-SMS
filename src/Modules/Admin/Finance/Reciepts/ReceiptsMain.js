import React from "react";
import AdminDashLayout from "../../../../Components/Admin/AdminDashLayout";
import CardsSection from "./CardsSection";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import RecentReceipts from "./Components/RecentReceipts.table";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../config/permission";
import ProtectedAction from "../../../../Routes/ProtectedRoutes/ProtectedAction";

const ReceiptsMain = () => {
    useNavHeading("Finance", "Receipts");
    const navigate = useNavigate();

    return (
        <AdminDashLayout>
            <div className="p-6 space-y-6">
                {/* Header Section */}
                <ProtectedAction requiredPermission={PERMISSIONS.CREATE_NEW_RECEIPT}>
                    <div className="flex justify-between items-center">
                        <div className="flex gap-4 justify-start items-center">

                        </div>

                        {/* Add New Receipt Button */}
                        <button
                            onClick={() => navigate("/finance/receipts/add-new-receipt")}
                            className="inline-flex items-center border border-gray-300 rounded-full ps-4 bg-white hover:shadow-lg transition duration-200 gap-2"
                        >
                            <span className="text-gray-800 font-medium">Add New Receipt</span>
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
                                <FiPlus size={16} />
                            </div>
                        </button>

                    </div>
                </ProtectedAction>


                {/* Cards Section */}
                <ProtectedSection requiredPermission={PERMISSIONS.VIEW_EXPENSE_CARD_DATA} title={"Cards"}>
                    <CardsSection />
                </ProtectedSection>

                {/* Recent Receipts */}
                    <RecentReceipts />
            </div>
        </AdminDashLayout >
    );
};

export default ReceiptsMain;
