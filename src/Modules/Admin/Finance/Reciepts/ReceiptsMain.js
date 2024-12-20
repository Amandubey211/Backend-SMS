import React from "react";
import AdminDashLayout from "../../../../Components/Admin/AdminDashLayout";
import CardsSection from "./CardsSection";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import { FiUserPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import RecentReceipts from "./Components/RecentReceipts.table";

const ReceiptsMain = () => {
    useNavHeading("Finance", "Receipts");
    const navigate = useNavigate();

    return (
        <AdminDashLayout>
            <div className="p-6 space-y-6">
                {/* Header Section */}
                <div className="flex justify-between items-center">
                    <div className="flex gap-4 justify-start items-center">
                        {/* Filters */}
                        <div className="relative rounded-[0.625rem] p-[2px] bg-gradient-to-r from-[#C83B62] to-[#46138A]">
                            <select
                                className="px-4 py-2 w-full bg-white text-gray-600 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none"
                                style={{ margin: '0.01px 0.2px 0.01px 0.1px', borderRadius: '7px' }}
                            >
                                <option>By Month</option>
                                <option>January</option>
                                <option>February</option>
                                <option>March</option>
                            </select>
                        </div>
                        <div className="relative rounded-[0.625rem] p-[2px] bg-gradient-to-r from-[#C83B62] to-[#46138A]">
                            <select
                                className="px-4 py-2 w-full bg-white text-gray-600 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none"
                                style={{ margin: '0.01px 0.2px 0.01px 0.1px', borderRadius: '7px' }}
                            >
                                <option>Tuition Fees</option>
                                <option>Paid</option>
                                <option>Unpaid</option>
                                <option>Partial</option>
                            </select>
                        </div>
                    </div>

                    {/* Add New Receipt Button */}
                    <button
                        onClick={() => navigate("/finance/receipts/add")}
                        className="inline-flex items-center border border-gray-300 rounded-full ps-4 bg-white hover:shadow-lg transition duration-200 gap-2"
                    >
                        <span className="text-gray-800 font-medium">Add New Receipt</span>
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
                            <FiUserPlus size={16} />
                        </div>
                    </button>
                </div>

                {/* Cards Section */}
                <CardsSection />

                {/* Recent Receipts */}
                <RecentReceipts />
            </div>
        </AdminDashLayout>
    );
};

export default ReceiptsMain;
