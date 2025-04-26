// Components/Transportation/VehicleList.js
import React, { useState, useEffect } from "react";
import { FaTrash, FaPen } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { deleteVehicle, getAllVehicles } from "../../Store/Slices/Transportation/Vehicles/vehicles.action";
import toast from "react-hot-toast";
import DeleteModal from "../Common/DeleteModal";

const VehicleList = ({ handleEdit }) => {

  const dispatch = useDispatch();

  const {
    vehicles,
    loading,
    error,
    currentPage,
    totalPages,
    totalVehicles
  } = useSelector((state) => state.transportation.transportVehicle);


  const [filterConfig, setFilterConfig] = useState({
    vehicleNumber: '',
    vehicleType: 'all',
    status: 'all'
  });

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  useEffect(() => {
    dispatch(getAllVehicles({ page: 1, limit: 10 })); // initial fetch
  }, [dispatch]);

  // Filtering and Sorting
  useEffect(() => {
    let result = [...vehicles];
    console.log('result--', result)
    if (filterConfig.vehicleNumber) {
      result = result.filter(vehicle =>
        (vehicle.vehicleNumber || '').toLowerCase().includes(filterConfig.vehicleNumber.toLowerCase())
      );
    }

    if (filterConfig.vehicleType !== 'all') {
      result = result.filter(vehicle =>
        vehicle.vehicleType === filterConfig.vehicleType
      );
    }

    if (filterConfig.status !== 'all') {
      result = result.filter(vehicle =>
        vehicle.status === filterConfig.status
      );
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }

    setFilteredVehicles(result);
  }, [vehicles, filterConfig, sortConfig]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Reset all filters
  const resetFilters = () => {
    setFilterConfig({
      vehicleNumber: '',
      vehicleType: 'all',
      status: 'all'
    });
    setSortConfig({ key: null, direction: 'ascending' });
  };

  // Vehicle types for dropdown
  const vehicleTypes = ["bus", "van", "auto", "cab", "e-rickshaw", "other"];

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
      console.error("Error deleting vehicle:", error);
      toast.error("Something went wrong.");
    }
  };

  const handleEditClick = (vehicleId) => {
    const fullVehicle = vehicles.find(v => v._id === vehicleId);
    if (fullVehicle) {
      handleEdit(fullVehicle);
    } else {
      console.error("Full vehicle data not found for edit!");
    }
  };

  
  return (
    <div>
      {/* Quick filter */}
      <div className="bg-white p-3 rounded-md shadow-sm mb-4">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative flex-grow max-w-xs">
            <input
              type="text"
              name="vehicleNumber"
              value={filterConfig.vehicleNumber}
              onChange={handleFilterChange}
              placeholder="Search by vehicle number..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <select
            name="vehicleType"
            value={filterConfig.vehicleType}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            {vehicleTypes.map((type) => (
              <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
            ))}
          </select>

          <select
            name="status"
            value={filterConfig.status}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="under_maintenance">Under Maintenance</option>
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
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('vehicleNumber')}
                  >
                    <div className="flex items-center">
                      Vehicle Number
                      {sortConfig.key === 'vehicleNumber' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('vehicleType')}
                  >
                    <div className="flex items-center">
                      Vehicle Type
                      {sortConfig.key === 'vehicleType' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Seating Capacity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Fuel Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      Status
                      {sortConfig.key === 'status' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVehicles.length > 0 ? (
                  filteredVehicles.map((vehicle, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vehicle.vehicleNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vehicle.vehicleType.charAt(0).toUpperCase() + vehicle.vehicleType.slice(1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vehicle.seatingCapacity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vehicle.fuelType.charAt(0).toUpperCase() + vehicle.fuelType.slice(1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={
                          vehicle.status === "active"
                            ? "text-green-600"
                            : vehicle.status === "inactive"
                              ? "text-red-500"
                              : "text-orange-500"
                        }>
                          {vehicle.status === "under_maintenance"
                            ? "Under Maintenance"
                            : vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleDeleteClick(vehicle)}
                            className="text-red-500 hover:text-red-600">
                            <FaTrash className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleEditClick(vehicle._id)} 
                            className="text-blue-500 hover:text-blue-600">
                            <FaPen className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      No vehicles found matching the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
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