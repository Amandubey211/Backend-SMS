import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import Sidebar from "../../../Components/Common/Sidebar";
import { useTranslation } from "react-i18next";
import VehicleList from "../../../Components/Transportation/VehicleList";
import VehicleForm from "../../../Components/Transportation/VehicleForm";
import { FaCar, FaCogs, FaUserTie } from "react-icons/fa";
import toast from "react-hot-toast";
import { createVehicle, deleteVehicle, getAllVehicles, updateVehicle } from "../../../Store/Slices/Transportation/Vehicles/vehicles.action";
import { useDispatch } from "react-redux";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";

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
    vehicleName: "",
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
      const payload = { ...formData };



      let resultAction;
      if (isEditing && editingVehicleId) {
        resultAction = await dispatch(updateVehicle({ vehicleId: editingVehicleId, payload }));
      } else {
        resultAction = await dispatch(createVehicle(payload));
      }
      if (resultAction.payload.success) {
        toast.success(isEditing ? "Vehicle updated successfully!" : "Vehicle added successfully!");

        setVehicleData({
          vehicleType: "",
          vehicleName: "",
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

  useNavHeading(t("Transportation"), t("Vehicle Management"));
  return (
    <Layout title={t("Vehicle Management") + " | Student diwan"}>
      <DashLayout>
        <div className="p-5 min-h-screen">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <FaCogs className="h-6 w-6 mr-2 text-indigo-700" />
              <span className="text-2xl font-semibold text-gray-800">Vehicle Management</span>
            </div>

            <div className="flex space-x-3">
              <Link
                to="/transportation/driver-vehicle-assignment"
                className="flex items-center px-4 py-2 text-white rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition duration-300"
              >
                <FaUserTie className="mr-2" />
                Driver Assignments
              </Link>
              <button
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
                className="flex items-center border border-gray-300 ps-5 py-0 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <span className="mr-2 text-sm">Add Vehicle</span>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-12 h-12 flex items-center justify-center">
                  <span className="text-3xl">+</span>
                </div>
              </button>

            </div>
          </div>

          <VehicleList handleEdit={handleEdit} />

          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => {
              setIsSidebarOpen(false);
              setIsEditing(false);
              setEditingVehicleId(null);

            }}
            ignoreClickOutsideSelectors={[
              ".ant-select-clear"
            ]}
            title={isEditing ? "Edit Vehicle" : "Add Vehicle"}
            width="50%"
          >
            <div className="p-6 max-h-screen overflow-y-auto bg-white rounded-lg shadow-lg">
              <VehicleForm
                vehicleData={vehicleData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                isEditing={isEditing}
              />
            </div>
          </Sidebar>
        </div>
      </DashLayout>
    </Layout>
  );
};

export default VehicleManagement;