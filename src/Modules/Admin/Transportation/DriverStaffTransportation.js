// DriverStaffTransportation.js
import React, { useState, useEffect } from "react";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import Sidebar from "../../../Components/Common/Sidebar";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDriverList,
  addDriver,
  updateDriver,
  deleteDriver,
} from "../../../Store/Slices/Transportation/Driver/driver.action";
import { getAllVehicles } from "../../../Store/Slices/Transportation/Vehicles/vehicles.action";
import DriverHeader from "../../../Components/Transportation/DriverHeader";
import DriverQuickFilter from "../../../Components/Transportation/DriverQuickFilter";
import DriverTable from "../../../Components/Transportation/DriverTable";
import DriverSidebarForm from "../../../Components/Transportation/DriverSidebarForm";
import DriverFilterSidebar from "../../../Components/Transportation/DriverFilterSidebar";
import DeleteModal from "../../../Components/Common/DeleteModal";
import TabButton from "./TabButton";

const DriverStaffTransportation = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation("transportation");

  // Access Redux state
  const { drivers, loading, error } = useSelector(
    (state) => state.transportation.transportDriver
  );

  const { vehicles } = useSelector(
    (state) => state.transportation.transportVehicle
  );


  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [filterConfig, setFilterConfig] = useState({
    name: "",
    status: "all",
    assignedBus: "all",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);


  const [driverData, setDriverData] = useState({
    fullName: "",
    driverBadgeNumber: "",
    gender: "",
    religion: "",
    email: "",
    contactNumber: "",
    emergencyContact: "",
    bloodGroup: "",
    photo: "",
    policeVerificationDone: false,
    joiningDate: "",
    resignationDate: "",
    licenseNumber: "",
    licenseExpiryDate: "",
    national_Id: "",
    address: "",
    dateOfBirth: "",
    experienceInYears: "",
    status: "active",
    assignedBus: "",
    documents: [],
  });

  // Fetch drivers when component mounts
  useEffect(() => {
    dispatch(fetchDriverList({}));
    dispatch(getAllVehicles());
  }, [dispatch]);

  // console.log("pp-->",vehicles)

  // Apply filtering and sorting effects
  useEffect(() => {
    if (!drivers) return;

    let result = [...drivers];

    // Apply filtering
    if (filterConfig.name) {
      result = result.filter((driver) =>
        driver.fullName?.toLowerCase().includes(filterConfig.name.toLowerCase())
      );
    }

    if (filterConfig.status !== "all") {
      result = result.filter((driver) => driver.status === filterConfig.status);
    }

    if (filterConfig.assignedBus !== "all") {
      result = result.filter(
        (driver) => driver.assignedBus === filterConfig.assignedBus
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredDrivers(result);
  }, [drivers, filterConfig, sortConfig]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDriverData((prev) => ({
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

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleEdit = (driver) => {
    setIsEditing(true);
    setSelectedDriverId(driver._id);

    // Helper function to format the date if it's available
    const formatDate = (date) => date ? new Date(date).toISOString().split('T')[0] : "";

    // Populate the form with driver data
    setDriverData({
      fullName: driver.fullName || "",
      driverBadgeNumber: driver.driverBadgeNumber || "",
      gender: driver.gender || "",
      religion: driver.religion || "",
      email: driver.email || "",
      contactNumber: driver.contactNumber || "",
      emergencyContact: driver.emergencyContact || "",
      bloodGroup: driver.bloodGroup || "",
      photo: driver.photo || "",
      policeVerificationDone: driver.policeVerificationDone || false,
      joiningDate: formatDate(driver.joiningDate),  // Ensure correct format
      resignationDate: formatDate(driver.resignationDate),  // Ensure correct format
      licenseNumber: driver.licenseNumber || "",
      licenseExpiryDate: formatDate(driver.licenseExpiryDate),  // Ensure correct format
      national_Id: driver.national_Id || "",
      address: driver.address || "",
      dateOfBirth: formatDate(driver.dateOfBirth),  // Ensure correct format
      experienceInYears: driver.experienceInYears || "",
      status: driver.status || "active",
      assignedBus: driver.assignedBus || "",
      documents: driver.documents || [],
    });

    setIsSidebarOpen(true);
  };

  const openDeleteModal = (driver) => {
    setSelectedDriver(driver);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedDriver?._id) {
      dispatch(deleteDriver(selectedDriver._id));
      setDeleteModalOpen(false);
      setSelectedDriver(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing && selectedDriverId) {
      // Update existing driver
      dispatch(
        updateDriver({
          id: selectedDriverId,
          data: driverData,
        })
      );
    } else {
      // Create new driver
      dispatch(addDriver(driverData));
    }

    // Reset form and close sidebar
    resetForm();
  };

  const resetForm = () => {
    setDriverData({
      fullName: "",
      driverBadgeNumber: "",
      gender: "",
      religion: "",
      email: "",
      contactNumber: "",
      emergencyContact: "",
      bloodGroup: "",
      photo: "",
      policeVerificationDone: false,
      joiningDate: "",
      resignationDate: "",
      licenseNumber: "",
      licenseExpiryDate: "",
      national_Id: "",
      address: "",
      dateOfBirth: "",
      experienceInYears: "",
      status: "active",
      assignedBus: "",
      documents: [],
    });
    setIsEditing(false);
    setSelectedDriverId(null);
    setIsSidebarOpen(false);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilterConfig({
      name: "",
      status: "all",
      assignedBus: "all",
    });
    setSortConfig({ key: null, direction: "ascending" });
  };

  // Get unique bus routes from drivers
  const uniqueBusRoutes =
    Array.isArray(drivers) && drivers.length > 0
      ? [
        "all",
        ...new Set(
          drivers.map((driver) => driver?.assignedBus).filter(Boolean)
        ),
      ]
      : ["all"];

  const [activeTab, setActiveTab] = useState("Driver");

  // Function to handle tab switch
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };

  const resetFormAndOpenSidebar = () => {
    resetForm();
    setIsSidebarOpen(true);
  };

  return (
    <Layout title={t("Driver Management") + " | Student diwan"}>
      <DashLayout>
        <div className="p-5">
          {/* Tab UI */}
          <div className="flex justify-between items-center mb-2">
            <div className="flex gap-4">
              <TabButton
                isActive={activeTab === "Driver"}
                onClick={() => handleTabSwitch("Driver")}
              >
                Drivers
              </TabButton>
              <TabButton
                isActive={activeTab === "Helper"}
                onClick={() => handleTabSwitch("Helper")}
              >
                Helpers
              </TabButton>
            </div>
            {activeTab === "Driver" && (
              <button
                onClick={resetFormAndOpenSidebar}
                className="flex items-center border border-gray-300 ps-5 py-0 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <span className="mr-2 text-sm">Add Driver</span>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-12 h-12 flex items-center justify-center">
                  <span className="text-3xl -mt-2">+</span>
                </div>
              </button>
            )}

            {activeTab === "Helper" && (
              <button
                onClick={() => {
                  resetForm();
                  setIsSidebarOpen(true);
                }}
                className="flex items-center border border-gray-300 ps-5 py-0 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <span className="mr-2 text-sm">Add Helper</span>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-12 h-12 flex items-center justify-center">
                  <span className="text-3xl -mt-2">+</span>
                </div>
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="flex-1">
            {activeTab === "Driver" ? (
              <>
                <DriverQuickFilter {...{ filterConfig, handleFilterChange, resetFilters, uniqueBusRoutes }} />
                <DriverTable drivers={filteredDrivers} loading={loading} error={error} onEdit={handleEdit} openDeleteModal={openDeleteModal} />
                <DriverSidebarForm isOpen={isSidebarOpen} isEditing={isEditing} driverData={driverData} setDriverData={setDriverData} handleChange={handleChange} handleSubmit={handleSubmit} resetForm={resetForm} vehicles={vehicles} />
                <DriverFilterSidebar isOpen={isFilterSidebarOpen} setIsOpen={setIsFilterSidebarOpen} filterConfig={filterConfig} handleFilterChange={handleFilterChange} resetFilters={resetFilters} uniqueBusRoutes={uniqueBusRoutes} />
                <DeleteModal
                  isOpen={deleteModalOpen}
                  onClose={() => setDeleteModalOpen(false)}
                  onConfirm={handleConfirmDelete}
                  title={selectedDriver?.fullName || "Driver"}
                />
              </>
            ) : (
              <>
                {/* Helper Management Components (similar to Driver) */}
                {/* <HelperQuickFilter {...{ filterConfig, handleFilterChange, resetFilters, uniqueBusRoutes }} />
                <HelperTable helpers={filteredHelpers} loading={loading} error={error} onEdit={handleEdit} openDeleteModal={openDeleteModal} />
                <HelperSidebarForm isOpen={isSidebarOpen} isEditing={isEditing} helperData={helperData} setHelperData={setHelperData} handleChange={handleChange} handleSubmit={handleSubmit} resetForm={resetForm} vehicles={vehicles} />
                <HelperFilterSidebar isOpen={isFilterSidebarOpen} setIsOpen={setIsFilterSidebarOpen} filterConfig={filterConfig} handleFilterChange={handleFilterChange} resetFilters={resetFilters} uniqueBusRoutes={uniqueBusRoutes} />
                <DeleteModal
                  isOpen={deleteModalOpen}
                  onClose={() => setDeleteModalOpen(false)}
                  onConfirm={handleConfirmDelete}
                  title={selectedHelper?.fullName || "Helper"}
                /> */}
              </>
            )}
          </div>
        </div>
      </DashLayout>
    </Layout>
  );
};

export default DriverStaffTransportation;
