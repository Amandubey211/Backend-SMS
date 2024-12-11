import React, { useState } from "react";
import Card from "./Components/Cards";
import { earningCardsData as earningData } from "../Datafiles/earning";
import { FiUserPlus } from "react-icons/fi";
import TotalEarningGraph from "./TotalEarningGraph";
import SummaryTotalRevenue from "./SummaryTotalRevenue";
import BulkEntriesModal from "./Components/BulkEntriesModal";
import AddNewEarningSidebar from "./Components/AddNewEarningSidebar";

const EarningMainSection = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleModalOpen = () => setIsModalVisible(true);
  const handleModalClose = () => setIsModalVisible(false);


  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const handleSidebarOpen = () => setIsSidebarVisible(true);
  const handleSidebarClose = () => setIsSidebarVisible(false);

  return (
    <div className="p-6 space-y-6">
      {/* Buttons Section */}
      <div className="flex justify-end items-center gap-4">
        {/* Bulk Entries Button */}
        <button
          onClick={handleModalOpen}
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-md hover:shadow-lg transition duration-200"
        >
          Bulk entries
        </button>

        {/* Add New Earning Button */}
        <button
          onClick={handleSidebarOpen}
          className="inline-flex items-center border border-gray-300 rounded-full ps-4 bg-white hover:shadow-lg transition duration-200 gap-2"
        >
          <span className="text-gray-800 font-medium">Add New Earning</span>
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
            <FiUserPlus size={16} />
          </div>
        </button>

      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {earningData.map((item, index) => (
          <Card key={index} {...item} />
        ))}
      </div>

      {/* Graph Section */}
      <TotalEarningGraph />

      {/* Summary Table Section */}
      <SummaryTotalRevenue />

      {/* Modal */}
      <BulkEntriesModal visible={isModalVisible} onClose={handleModalClose} />

      {/* Sidebar */}
      <AddNewEarningSidebar visible={isSidebarVisible} onClose={handleSidebarClose} />

    </div>
  );
};

export default EarningMainSection;
