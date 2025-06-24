import React, { useState, useEffect } from "react";
import { Table, Select, Tag, Input, Button } from "antd";
import { FiEdit3, FiXCircle } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { deleteVehicle, getAllVehicles } from "../../Store/Slices/Transportation/Vehicles/vehicles.action";
import toast from "react-hot-toast";
import DeleteModal from "../Common/DeleteModal";

const { Option } = Select;

const VehicleList = ({ handleEdit }) => {
  const dispatch = useDispatch();

  const {
    vehicles,
    loading,
  } = useSelector((state) => state.transportation.transportVehicle);

  const [filterConfig, setFilterConfig] = useState({
    vehicleNumber: "",
    vehicleType: "all",
    status: "all",
  });

  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  useEffect(() => {
    dispatch(getAllVehicles({ page: 1, limit: 10 }));
  }, []);

  useEffect(() => {
    let result = [...vehicles];

    if (filterConfig.vehicleNumber) {
      result = result.filter((v) =>
        (v.vehicleNumber || "")
          .toLowerCase()
          .includes(filterConfig.vehicleNumber.toLowerCase())
      );
    }

    if (filterConfig.vehicleType !== "all") {
      result = result.filter((v) => v.vehicleType === filterConfig.vehicleType);
    }

    if (filterConfig.status !== "all") {
      result = result.filter((v) => v.status === filterConfig.status);
    }

    setFilteredVehicles(result);
  }, [vehicles, filterConfig]);

  const handleFilterChange = (name, value) => {
    setFilterConfig((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilterConfig({
      vehicleNumber: "",
      vehicleType: "all",
      status: "all",
    });
  };

  const handleDeleteClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedVehicle) return;

    try {
      const resultAction = await dispatch(deleteVehicle(selectedVehicle._id));
      if (deleteVehicle.fulfilled.match(resultAction)) {
        toast.success("Vehicle deleted successfully!");
        dispatch(getAllVehicles({ page: 1, limit: 10 }));
      } else {
        toast.error(resultAction.payload?.message || "Failed to delete vehicle.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  const handleEditClick = (vehicleId) => {
    const fullVehicle = vehicles.find((v) => v._id === vehicleId);
    if (fullVehicle) handleEdit(fullVehicle);
  };

  const columns = [
    { title: "Vehicle Number", dataIndex: "vehicleNumber", key: "vehicleNumber" },
    {
      title: "Vehicle Type",
      dataIndex: "vehicleType",
      key: "vehicleType",
      render: (text) => text ? text.charAt(0).toUpperCase() + text.slice(1) : ""
    },
    { title: "Seating Capacity", dataIndex: "seatingCapacity", key: "seatingCapacity" },
    {
      title: "Fuel Type",
      dataIndex: "fuelType",
      key: "fuelType",
      render: (text) => {
        let color;
        switch (text?.toLowerCase()) {
          case "diesel":
            color = "bg-blue-100 text-blue-800";
            break;
          case "petrol":
            color = "bg-green-100 text-green-800";
            break;
          case "cng":
            color = "bg-yellow-100 text-yellow-800";
            break;
          case "electric":
            color = "bg-purple-100 text-purple-800";
            break;
          case "hybrid":
            color = "bg-orange-100 text-orange-800";
            break;
          default:
            color = "bg-gray-100 text-gray-800";
        }
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${color} capitalize`}>{text}</span>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color;
        let label = status;

        switch (status) {
          case "active":
            color = "bg-green-100 text-green-800";
            label = "Active";
            break;
          case "inactive":
            color = "bg-red-100 text-red-800";
            label = "Inactive";
            break;
          case "under_maintenance":
            color = "bg-yellow-100 text-yellow-800";
            label = "Under Maintenance";
            break;
          default:
            color = "bg-gray-100 text-gray-800";
        }
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>{label}</span>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex space-x-3">
          <button
            onClick={() => handleDeleteClick(record)}
            className="text-red-500 hover:text-red-600"
            title="Delete"
          >
            <FiXCircle className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleEditClick(record._id)}
            className="text-blue-500 hover:text-blue-600"
            title="Edit"
          >
            <FiEdit3 className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg">
      <div className="mb-6 flex justify-between items-center">
        <Input
          placeholder="Search by vehicle number..."
          value={filterConfig.vehicleNumber}
          onChange={(e) => handleFilterChange("vehicleNumber", e.target.value)}
          style={{ width: 200 }}
          allowClear
        />
        <div className="flex space-x-2">
          <Select
            value={filterConfig.vehicleType}
            onChange={(value) => handleFilterChange("vehicleType", value)}
            style={{ width: 150 }}
          >
            <Option value="all">All Types</Option>
            <Option value="bus">Bus</Option>
            <Option value="van">Van</Option>
            <Option value="cab">Cab</Option>
          </Select>
          <Select
            value={filterConfig.status}
            onChange={(value) => handleFilterChange("status", value)}
            style={{ width: 150 }}
          >
            <Option value="all">All Status</Option>
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
            <Option value="under_maintenance">Under Maintenance</Option>
          </Select>
          <Button onClick={resetFilters}>Reset</Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredVehicles}
        loading={loading}
        rowKey="_id"
        pagination={false}
        style={{ boxShadow: "none" }} // Removes table shadow
      />

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={selectedVehicle?.vehicleNumber || "Vehicle"}
      />
    </div>
  );
};

export default VehicleList;
