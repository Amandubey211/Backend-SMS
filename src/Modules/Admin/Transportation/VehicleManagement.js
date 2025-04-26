// Modules/Admin/Transportation/VehicleManagement.js
import React, { useState } from "react";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import Sidebar from "../../../Components/Common/Sidebar";
import { useTranslation } from "react-i18next";
import VehicleList from "../../../Components/Transportation/VehicleList";
import VehicleForm from "../../../Components/Transportation/VehicleForm";
import VehicleFilter from "../../../Components/Transportation/VehicleFilter";

const VehicleManagement = () => {
  const { t } = useTranslation("transportation");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [filterConfig, setFilterConfig] = useState({
    vehicleNumber: '',
    vehicleType: 'all',
    status: 'all'
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
    documents: []
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setVehicleData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Here you would typically send the data to your API
    console.log("Submitting vehicle data:", vehicleData);
    
    // Reset form and close sidebar
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
      documents: []
    });
    setIsSidebarOpen(false);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilterConfig({
      vehicleNumber: '',
      vehicleType: 'all',
      status: 'all'
    });
  };

  return (
    <Layout title={t("Vehicle Management") + " | Student diwan"}>
      <DashLayout>
        <div className="p-5">
          {/* Header section */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m-8 6h12m0 0l-4-4m4 4l-4 4" />
              </svg>
              <h1 className="text-lg font-medium">Vehicle Management</h1>
            </div>
            
            <div className="flex space-x-2">
              <button 
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                onClick={() => setIsFilterSidebarOpen(true)}
              >
                Filter
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>
              
              <button 
                className="flex items-center px-3 py-2 rounded-md bg-blue-600 text-white text-sm"
                onClick={() => setIsSidebarOpen(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add New Vehicle
              </button>
            </div>
          </div>
          
          {/* Vehicle List Component */}
          <VehicleList />

          {/* Add Vehicle Sidebar */}
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            title="Add Vehicle"
            width="50%"
          >
            <div className="p-4 max-h-screen overflow-y-auto">
              <VehicleForm 
                vehicleData={vehicleData} 
                handleChange={handleChange} 
                handleSubmit={handleSubmit} 
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