import React, { useState } from "react";
import Card from "./Components/Cards";
import { earningCardsData as earningData } from "../Datafiles/earning";
import { FiUserPlus } from "react-icons/fi";
import TotalEarningGraph from "./TotalEarningGraph";
import SummaryTotalRevenue from "./SummaryTotalRevenue";
import BulkEntriesModal from "./Components/BulkEntriesModal";
import AddNewEarningSidebar from "./Components/AddNewEarningSidebar";
import { useNavigate } from "react-router-dom";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";

const EarningMainSection = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const handleModalOpen = () => setIsModalVisible(true);
  const handleModalClose = () => setIsModalVisible(false);

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const handleSidebarOpen = () => setIsSidebarVisible(true);
  const handleSidebarClose = () => setIsSidebarVisible(false);

  const limit = 3; // cards to show in single row
  useNavHeading("Finance","Earnings");

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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
        {earningData.slice(0, limit).map((item, index) => (
          <Card key={index} {...item} />
        ))}
      </div>

      {/* Graph Section */}
      <div className="w-full h-[250px] sm:h-[350px] md:h-[400px] bg-white rounded-lg p-2 md:p-4">
        <TotalEarningGraph />
      </div>

      {/* Summary Table Section */}
      <div className="w-full bg-white rounded-lg  p-2 md:p-4 overflow-x-auto">
        <SummaryTotalRevenue />
      </div>

      {/* Modal */}
      <BulkEntriesModal visible={isModalVisible} onClose={handleModalClose} />

      {/* Sidebar */}
      <AddNewEarningSidebar
        visible={isSidebarVisible}
        onClose={handleSidebarClose}
      />
    </div>
  );
};

export default EarningMainSection;
