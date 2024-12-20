import React from "react";
import AdminDashLayout from "../../../../Components/Admin/AdminDashLayout";
import CardsSection from "./Components/CardSection";
import TotalEarningGraph from "./TotalEarningGraph";
import SummaryTotalRevenue from "./SummaryTotalRevenue";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import { FiUserPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const EarningMainSection = () => {

    useNavHeading("Finance", "Earnings");
    const navigate = useNavigate();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const handleModalOpen = () => setIsModalVisible(true);
  const handleModalClose = () => setIsModalVisible(false);

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const handleSidebarOpen = () => setIsSidebarVisible(true);
  const handleSidebarClose = () => setIsSidebarVisible(false);

  const limit = 3; // cards to show in single row
  useNavHeading("Finance", "Earnings");

  return (
    <div className="p-4 md:p-6 space-y-6 w-full max-w-screen-xl mx-auto">
      {/* Buttons Section */}
      <div className="flex flex-wrap justify-end items-center gap-4">
        {/* Bulk Entries Button */}
        <button
          onClick={handleModalOpen}
          className="px-4 py-2 md:px-6 md:py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-md hover:shadow-lg transition duration-200 text-sm md:text-base"
        >
          Bulk entries
        </button>


    return (
        <AdminDashLayout>
            <div className="w-[100%] p-8">
                {/* Header Section */}
                <div className="flex justify-between items-center">
                    <div className="flex gap-4 justify-start items-center">
                        {/* By Month Dropdown */}
                        <div className="relative rounded-[0.625rem] p-[2px] bg-gradient-to-r from-[#C83B62] to-[#46138A]">
                            <select
                                className="px-4 py-2 w-full bg-white text-gray-600 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none"
                                style={{
                                    margin: "0.01px 0.2px 0.01px 0.1px",
                                    borderRadius: "7px",
                                }}
                            >
                                <option>By Month</option>
                                <option>January</option>
                                <option>February</option>
                                <option>March</option>
                            </select>
                        </div>

                        {/* Earnings Type Dropdown */}
                        <div className="relative rounded-[0.625rem] p-[2px] bg-gradient-to-r from-[#C83B62] to-[#46138A]">
                            <select
                                className="px-4 py-2 w-full bg-white text-gray-600 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none"
                                style={{
                                    margin: "0.01px 0.2px 0.01px 0.1px",
                                    borderRadius: "7px",
                                }}
                            >
                                <option>Earnings Type</option>
                                <option>Full Payment</option>
                                <option>Partial Payment</option>
                                <option>Overdue</option>
                            </select>
                        </div>
                    </div>

                    {/* Add New Earning Button */}
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

                {/* Cards Section */}
                <CardsSection />

                {/* Graph Section */}
                {/* <div className="w-full bg-white rounded-lg shadow p-4 border-2 border-red-700"> */}
                   
                        <TotalEarningGraph />
                  
                {/* </div> */}

                {/* Summary Table Section */}
                {/* <div className="w-full bg-white rounded-lg shadow p-4 overflow-x-auto">
                    
                </div> */}
                <SummaryTotalRevenue />
            </div>
        </AdminDashLayout>
    );
};

export default EarningMainSection;
