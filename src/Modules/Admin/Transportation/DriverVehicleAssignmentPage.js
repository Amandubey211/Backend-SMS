// Modules/Admin/Transportation/DriverVehicleAssignmentPage.js
import React, { useState } from "react";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import Sidebar from "../../../Components/Common/Sidebar";
import { useTranslation } from "react-i18next";
import DriverVehicleAssignmentList from "../../../Components/Transportation/DriverVehicleAssignmentList";
import DriverVehicleAssignment from "../../../Components/Transportation/DriverVehicleAssignment";
import DriverVehicleAssignmentCard from "../../../Components/Transportation/DriverVehicleAssignmentCard";

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

          {/* <DriverVehicleAssignmentCard/> */}

          {/* Assignment List */}
          <DriverVehicleAssignmentList onEdit={handleEdit} />

          {/* Assignment Sidebar */}
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            title={selectedAssignment ? "Edit Assignment" : "Add New Assignment"}
            width="60%"
          >
            <DriverVehicleAssignment
              onSave={handleSave}
              onClose={() => setIsSidebarOpen(false)}
              initialData={selectedAssignment}
              selectedAssignment={selectedAssignment}
            />
          </Sidebar>
        </div>
      </DashLayout>
    </Layout>
  );
};

export default DriverVehicleAssignmentPage;
