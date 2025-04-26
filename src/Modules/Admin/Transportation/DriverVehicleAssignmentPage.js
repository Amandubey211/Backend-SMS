// Modules/Admin/Transportation/DriverVehicleAssignmentPage.js
import React, { useState } from "react";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import Sidebar from "../../../Components/Common/Sidebar";
import { useTranslation } from "react-i18next";
import DriverVehicleAssignmentList from "../../../Components/Transportation/DriverVehicleAssignmentList";
import DriverVehicleAssignment from "../../../Components/Transportation/DriverVehicleAssignment";
import { FaBusAlt, FaUserTie, FaMapMarkedAlt } from "react-icons/fa";

const DriverVehicleAssignmentPage = () => {
  const { t } = useTranslation("transportation");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const handleCreateNew = () => {
    setSelectedAssignment(null);
    setIsSidebarOpen(true);
  };

  const handleEdit = (assignment) => {
    setSelectedAssignment(assignment);
    setIsSidebarOpen(true);
  };

  const handleSave = (formData) => {
    // Here you would typically send the data to your API
    console.log("Saving assignment data:", formData);

    // Close the sidebar after saving
    setIsSidebarOpen(false);
  };

  return (
    <Layout title={t("Driver-Vehicle Assignment") + " | Student diwan"}>
      <DashLayout>
        <div className="p-5">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">
                  Driver-Vehicle Assignment
                </h1>
                <p className="text-gray-600 mt-1">
                  Assign drivers to vehicles for transportation routes and
                  shifts
                </p>
              </div>
              <button
                onClick={handleCreateNew}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                New Assignment
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
              <div className="flex items-center">
                <div className="rounded-full bg-blue-100 p-3 mr-4">
                  <FaBusAlt className="text-blue-500 text-xl" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Vehicles</p>
                  <h3 className="text-2xl font-semibold text-gray-800">24</h3>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
              <div className="flex items-center">
                <div className="rounded-full bg-green-100 p-3 mr-4">
                  <FaUserTie className="text-green-500 text-xl" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Available Drivers</p>
                  <h3 className="text-2xl font-semibold text-gray-800">18</h3>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
              <div className="flex items-center">
                <div className="rounded-full bg-purple-100 p-3 mr-4">
                  <FaMapMarkedAlt className="text-purple-500 text-xl" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Active Assignments</p>
                  <h3 className="text-2xl font-semibold text-gray-800">16</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Assignment List */}
          <DriverVehicleAssignmentList onEdit={handleEdit} />

          {/* Assignment Sidebar */}
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            title={selectedAssignment ? "Edit Assignment" : "New Assignment"}
            width="60%"
          >
            <DriverVehicleAssignment
              onSave={handleSave}
              onClose={() => setIsSidebarOpen(false)}
              initialData={selectedAssignment}
            />
          </Sidebar>
        </div>
      </DashLayout>
    </Layout>
  );
};

export default DriverVehicleAssignmentPage;
