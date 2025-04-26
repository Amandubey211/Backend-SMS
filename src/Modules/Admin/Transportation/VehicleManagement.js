// Modules/Admin/Transportation/VehicleManagement.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import Sidebar from "../../../Components/Common/Sidebar";
import { useTranslation } from "react-i18next";
import VehicleList from "../../../Components/Transportation/VehicleList";
import VehicleForm from "../../../Components/Transportation/VehicleForm";
import VehicleFilter from "../../../Components/Transportation/VehicleFilter";
import { FaUserTie } from "react-icons/fa";
import toast from "react-hot-toast";
import { createVehicle, deleteVehicle, getAllVehicles, updateVehicle } from "../../../Store/Slices/Transportation/Vehicles/vehicles.action";
import { useDispatch } from "react-redux";

const VehicleManagement = () => {
  const { t } = useTranslation("transportation");
  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState(null);

  const [filterConfig, setFilterConfig] = useState({
    vehicleNumber: "",
    vehicleType: "all",
    status: "all",
  });

  const [vehicleData, setVehicleData] = useState({
    vehicleType: "",
    customVehicleType: "",
    vehicleNumber: "",
    seatingCapacity: "",
    status: "active",
    fuelType: "",
    vehicleCategory: "",
    customVehicleCategory: "",
    cameraInstalled: false,
    firstAidAvailable: false,
    speedGovernorInstalled: false,
    documents: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setVehicleData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterConfig((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  
  const handleSubmit = async (formData) => {
    try {
      const payload = { ...formData };  // <-- Use formData (not old vehicleData)
  
      if (payload.vehicleType === "other" && payload.customVehicleType) {
        payload.vehicleType = payload.customVehicleType;
      }
      if (payload.vehicleCategory === "other" && payload.customVehicleCategory) {
        payload.vehicleCategory = payload.customVehicleCategory;
      }
  
      let resultAction;
      if (isEditing && editingVehicleId) {
        resultAction = await dispatch(updateVehicle({ vehicleId: editingVehicleId, payload }));
      } else {
        resultAction = await dispatch(createVehicle(payload));
      }
      
  
      if (createVehicle.fulfilled.match(resultAction) || updateVehicle.fulfilled.match(resultAction)) {
        toast.success(isEditing ? "Vehicle updated successfully!" : "Vehicle added successfully!");
  
        // Reset form
        setVehicleData({
          vehicleType: "",
          customVehicleType: "",
          vehicleNumber: "",
          seatingCapacity: "",
          status: "active",
          fuelType: "",
          vehicleCategory: "",
          customVehicleCategory: "",
          cameraInstalled: false,
          firstAidAvailable: false,
          speedGovernorInstalled: false,
          documents: [],
        });
  
        setIsEditing(false);
        setEditingVehicleId(null);
        setIsSidebarOpen(false);
  
        dispatch(getAllVehicles({ page: 1, limit: 10 }));
      } else {
        toast.error(resultAction.payload?.message || (isEditing ? "Failed to update vehicle" : "Failed to add vehicle"));
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  };

  const handleEdit = (vehicle) => {
    setIsEditing(true);
    setEditingVehicleId(vehicle._id);
    setVehicleData({
      ...vehicle,
      customVehicleType: vehicle.customVehicleType || "",
      customVehicleCategory: vehicle.customVehicleCategory || "",
      documents: vehicle.documents || [],
    });
    setIsSidebarOpen(true);
  };

  const resetFilters = () => {
    setFilterConfig({
      vehicleNumber: "",
      vehicleType: "all",
      status: "all",
    });
  };

  return (
    <Layout title={t("Vehicle Management") + " | Student diwan"}>
      <DashLayout>
        <div className="p-5">
          {/* Header section */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2 text-blue-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m-8 6h12m0 0l-4-4m4 4l-4 4"
                />
              </svg>
              <h1 className="text-lg font-medium">Vehicle Management</h1>
            </div>

            <div className="flex space-x-2">
              <Link
                to="/transportation/driver-vehicle-assignment"
                className="flex items-center px-3 py-2 border border-blue-500 rounded-md bg-white text-blue-500 text-sm hover:bg-blue-50"
              >
                <FaUserTie className="mr-2" />
                Driver Assignments
              </Link>

              <button
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                onClick={() => setIsFilterSidebarOpen(true)}
              >
                Filter
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
              </button>

              <button
                className="flex items-center px-3 py-2 rounded-md bg-blue-600 text-white text-sm"
                onClick={() => {
                  setIsEditing(false);
                  setEditingVehicleId(null);
                  setVehicleData({
                    vehicleType: "",
                    customVehicleType: "",
                    vehicleNumber: "",
                    seatingCapacity: "",
                    status: "active",
                    fuelType: "",
                    vehicleCategory: "",
                    customVehicleCategory: "",
                    cameraInstalled: false,
                    firstAidAvailable: false,
                    speedGovernorInstalled: false,
                    documents: [],
                  });
                  setIsSidebarOpen(true);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add New Vehicle
              </button>
            </div>
          </div>

          {/* Vehicle List Component */}
          <VehicleList handleEdit={handleEdit} />

          {/* Add Vehicle Sidebar */}
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => {
              setIsSidebarOpen(false);
              setIsEditing(false);
              setEditingVehicleId(null);
            }}
            title={isEditing ? "Edit Vehicle" : "Add Vehicle"}
            width="50%"
          >
            <div className="p-4 max-h-screen overflow-y-auto">
              <VehicleForm
                vehicleData={vehicleData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                isEditing={isEditing}
              />
            </div>
          </Sidebar>


          {/* Filter Sidebar */}
          <Sidebar
            isOpen={isFilterSidebarOpen}
            onClose={() => setIsFilterSidebarOpen(false)}
            title="Advanced Filters"
            width="30%"
          >
            <VehicleFilter
              filterConfig={filterConfig}
              handleFilterChange={handleFilterChange}
              resetFilters={resetFilters}
            />
          </Sidebar>
        </div>
      </DashLayout>
    </Layout>
  );
};

export default VehicleManagement;
