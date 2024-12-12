// src/Modules/Admin/Finance/StudentFees/StudentFeesMain.js
import React, { useState } from "react";
import StudentCardSection from "./Components/StudentCardSection"; // Reused Cards Section for Students
import StudentFeesGraph from "./Components/StudentFeesGraph";
import StudentFeesSummaryTable from "./Components/StudentFeesSummaryTable";
import AddNewFeeSidebar from "./Components/AddNewFeeSidebar";
import FilterStudentFeesModal from "./Components/FilterStudentFeesModal";
import SortStudentFeesModal from "./Components/SortStudentFeesModal";
import { FiUserPlus } from "react-icons/fi";

const StudentFeesMain = () => {
  // State Management for Modals and Sidebar
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);

  // Handlers for Sidebar and Modals
  const handleSidebarOpen = () => setIsSidebarVisible(true);
  const handleSidebarClose = () => setIsSidebarVisible(false);

  const handleFilterModalOpen = () => setIsFilterModalVisible(true);
  const handleFilterModalClose = () => setIsFilterModalVisible(false);

  const handleSortModalOpen = () => setIsSortModalVisible(true);
  const handleSortModalClose = () => setIsSortModalVisible(false);

  return (
    <div className="p-6 space-y-6">
      {/* Buttons Section */}
      <div className="flex justify-end items-center gap-4">
        <button
          onClick={handleFilterModalOpen}
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-md hover:shadow-lg transition duration-200"
        >
          Filter
        </button>
        <button
          onClick={handleSortModalOpen}
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-md hover:shadow-lg transition duration-200"
        >
          Sort
        </button>
        <button
          onClick={handleSidebarOpen}
          className="inline-flex items-center border border-gray-300 rounded-full ps-4 bg-white hover:shadow-lg transition duration-200 gap-2"
        >
          <span className="text-gray-800 font-medium">Add New Fee</span>
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
            <FiUserPlus size={16} />
          </div>
        </button>
      </div>

      {/* Cards Section */}
      <StudentCardSection />

      {/* Graph Section */}
      <StudentFeesGraph />

      {/* Summary Table Section */}
      <StudentFeesSummaryTable />

      {/* Sidebar and Modals */}
      <AddNewFeeSidebar visible={isSidebarVisible} onClose={handleSidebarClose} />
      <FilterStudentFeesModal visible={isFilterModalVisible} onClose={handleFilterModalClose} />
      <SortStudentFeesModal visible={isSortModalVisible} onClose={handleSortModalClose} />
    </div>
  );
};

export default StudentFeesMain;
