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

const DriverStaffTransportation = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation("transportation");

  // Access Redux state
  const { drivers, loading, error } = useSelector(
    (state) => state.transportation.transportDriver
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
  }, [dispatch]);

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
  
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this driver?")) {
      dispatch(deleteDriver(id));
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

  // List of available bus routes for dropdown
  const busRoutes = [
    "BUS 101 - Main Campus Route",
    "BUS 102 - Downtown Route",
    "BUS 103 - Residential Area Route",
    "BUS 104 - Express Route",
  ];

  // Blood group options
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

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

  return (
    <Layout title={t("Driver Management") + " | Student diwan"}>
      <DashLayout>
        <div className="p-5">
          {/* Header section */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2 text-purple-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.354a4 4 0 110 5.292V15M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <h1 className="text-lg font-medium">Driver List Table</h1>
            </div>

            <div className="flex space-x-2">
              {/* <button
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
              </button> */}

              <button
                className="flex items-center px-3 py-2 rounded-md bg-purple-600 text-white text-sm"
                onClick={() => {
                  setIsEditing(false);
                  setSelectedDriverId(null);
                  resetForm();
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
                Add New Driver
              </button>
            </div>
          </div>

          {/* Quick filter */}
          <div className="bg-white p-3 rounded-md shadow-sm mb-4">
            <div className="flex flex-wrap gap-2 items-center">
              <div className="relative flex-grow max-w-xs">
                <input
                  type="text"
                  name="name"
                  value={filterConfig.name}
                  onChange={handleFilterChange}
                  placeholder="Search by driver name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              <select
                name="status"
                value={filterConfig.status}
                onChange={handleFilterChange}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <select
                name="assignedBus"
                value={filterConfig.assignedBus}
                onChange={handleFilterChange}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="all">All Buses</option>
                {(uniqueBusRoutes || ["all"])
                  .filter((route) => route !== "all")
                  .map((route, index) => (
                    <option key={index} value={route}>
                      {route}
                    </option>
                  ))}
              </select>

              <button
                onClick={resetFilters}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-md shadow-sm border">
            {loading ? (
              <div className="p-4 text-center">Loading...</div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">Error: {error}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Driver Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Badge Number
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        License Number
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Contact Number
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Array.isArray(filteredDrivers) &&
                    filteredDrivers.length > 0 ? (
                      filteredDrivers.map((driver, index) => (
                        <tr
                          key={driver?._id || `driver-${index}`}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {driver?.fullName || "Unnamed Driver"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {driver?.driverBadgeNumber || "Unassigned Badge No"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {driver?.licenseNumber || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {driver?.contactNumber || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={
                                driver?.status === "active"
                                  ? "text-green-600"
                                  : "text-orange-500"
                              }
                            >
                              {driver?.status === "active"
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center space-x-3">
                             
                              <button
                                className="text-blue-500 hover:text-blue-600"
                                onClick={() => handleEdit(driver)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                              </button>

                              <button
                                className="text-red-500 hover:text-red-600"
                                onClick={() => handleDelete(driver?._id)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-6 py-4 text-center text-sm text-gray-500"
                        >
                          No drivers found matching the current filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Add/Edit Driver Sidebar */}
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => {
              resetForm();
              setIsSidebarOpen(false);
            }}
            title={isEditing ? "Edit Driver" : "Add Driver"}
            width="50%"
          >
            <div className="p-4 max-h-screen overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Form sections */}
                <div className="bg-purple-50 p-3 rounded-md mb-4">
                  <h3 className="text-md font-medium text-purple-800 mb-3">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={driverData.fullName}
                        onChange={handleChange}
                        placeholder="Enter full name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="driverBadgeNumber"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Badge Number
                      </label>
                      <input
                        type="text"
                        id="driverBadgeNumber"
                        name="driverBadgeNumber"
                        value={driverData.driverBadgeNumber}
                        onChange={handleChange}
                        placeholder="Enter badge number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="gender"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Gender *
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={driverData.gender}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                        required
                      >
                        <option value="" disabled>
                          Select gender
                        </option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="trans">Trans</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="religion"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Religion
                      </label>
                      <input
                        type="text"
                        id="religion"
                        name="religion"
                        value={driverData.religion}
                        onChange={handleChange}
                        placeholder="Enter religion"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="dateOfBirth"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={driverData.dateOfBirth}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="bloodGroup"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Blood Group
                      </label>
                      <select
                        id="bloodGroup"
                        name="bloodGroup"
                        value={driverData.bloodGroup}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                      >
                        <option value="" disabled>
                          Select blood group
                        </option>
                        {bloodGroups.map((group) => (
                          <option key={group} value={group}>
                            {group}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-md mb-4">
                  <h3 className="text-md font-medium text-blue-800 mb-3">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={driverData.email}
                        onChange={handleChange}
                        placeholder="Enter email address"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contactNumber"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Contact Number *
                      </label>
                      <input
                        type="tel"
                        id="contactNumber"
                        name="contactNumber"
                        value={driverData.contactNumber}
                        onChange={handleChange}
                        placeholder="Enter contact number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="emergencyContact"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Emergency Contact
                      </label>
                      <input
                        type="tel"
                        id="emergencyContact"
                        name="emergencyContact"
                        value={driverData.emergencyContact}
                        onChange={handleChange}
                        placeholder="Enter emergency contact"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Address
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        value={driverData.address}
                        onChange={handleChange}
                        placeholder="Enter address"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                        rows="2"
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-3 rounded-md mb-4">
                  <h3 className="text-md font-medium text-green-800 mb-3">
                    Professional Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="licenseNumber"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        License Number *
                      </label>
                      <input
                        type="text"
                        id="licenseNumber"
                        name="licenseNumber"
                        value={driverData.licenseNumber}
                        onChange={handleChange}
                        placeholder="Enter license number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="licenseExpiryDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        License Expiry Date
                      </label>
                      <input
                        type="date"
                        id="licenseExpiryDate"
                        name="licenseExpiryDate"
                        value={driverData.licenseExpiryDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="national_Id"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        National ID
                      </label>
                      <input
                        type="text"
                        id="national_Id"
                        name="national_Id"
                        value={driverData.national_Id}
                        onChange={handleChange}
                        placeholder="Enter national ID"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="experienceInYears"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Experience (years)
                      </label>
                      <input
                        type="number"
                        id="experienceInYears"
                        name="experienceInYears"
                        value={driverData.experienceInYears}
                        onChange={handleChange}
                        placeholder="Enter years of experience"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="joiningDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Joining Date
                      </label>
                      <input
                        type="date"
                        id="joiningDate"
                        name="joiningDate"
                        value={driverData.joiningDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="resignationDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Resignation Date
                      </label>
                      <input
                        type="date"
                        id="resignationDate"
                        name="resignationDate"
                        value={driverData.resignationDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="policeVerificationDone"
                        name="policeVerificationDone"
                        checked={driverData.policeVerificationDone}
                        onChange={handleChange}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="policeVerificationDone"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Police Verification Done
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-3 rounded-md mb-4">
                  <h3 className="text-md font-medium text-yellow-800 mb-3">
                    Assignment Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="status"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Status *
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={driverData.status}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                        required
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="assignedBus"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Assigned Bus
                      </label>
                      <select
                        id="assignedBus"
                        name="assignedBus"
                        value={driverData.assignedBus}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                      >
                        <option value="">Not Assigned</option>
                        {busRoutes.map((route, index) => (
                          <option key={index} value={route}>
                            {route}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 p-3 rounded-md mb-4">
                  <h3 className="text-md font-medium text-red-800 mb-3">
                    Document Upload
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label
                        htmlFor="photo"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Driver Photo
                      </label>
                      <input
                        type="file"
                        id="photo"
                        name="photo"
                        accept="image/*"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="documents"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Additional Documents (License copy, ID proof, etc.)
                      </label>
                      <input
                        type="file"
                        id="documents"
                        name="documents"
                        multiple
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        You can select multiple files. Accepted formats: PDF,
                        JPG, PNG (max 5MB each)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setIsSidebarOpen(false);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    {isEditing ? "Update Driver" : "Add Driver"}
                  </button>
                </div>
              </form>
            </div>
          </Sidebar>

          {/* Filter Sidebar */}
          <Sidebar
            isOpen={isFilterSidebarOpen}
            onClose={() => setIsFilterSidebarOpen(false)}
            title="Advanced Filters"
            width="30%"
          >
            <div className="p-4">
              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="filterName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Driver Name
                  </label>
                  <input
                    type="text"
                    id="filterName"
                    name="name"
                    value={filterConfig.name}
                    onChange={handleFilterChange}
                    placeholder="Search by name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="filterStatus"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Status
                  </label>
                  <select
                    id="filterStatus"
                    name="status"
                    value={filterConfig.status}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="filterBus"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Assigned Bus
                  </label>
                  <select
                    id="filterBus"
                    name="assignedBus"
                    value={filterConfig.assignedBus}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="all">All Buses</option>
                    {(uniqueBusRoutes || ["all"])
                      .filter((route) => route !== "all")
                      .map((route, index) => (
                        <option key={index} value={route}>
                          {route}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
                  >
                    Reset Filters
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFilterSidebarOpen(false)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    Apply Filters
                  </button>
                </div>
              </form>
            </div>
          </Sidebar>
        </div>
      </DashLayout>
    </Layout>
  );
};

export default DriverStaffTransportation;
