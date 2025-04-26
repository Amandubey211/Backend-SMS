// Components/Transportation/VehicleFilter.js
import React from "react";

const VehicleFilter = ({ filterConfig, handleFilterChange, resetFilters }) => {
  // Vehicle types for dropdown
  const vehicleTypes = ["bus", "van", "auto", "cab", "e-rickshaw", "other"];

  return (
    <div className="p-4">
      <form className="space-y-4">
        <div>
          <label htmlFor="filterVehicleNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Vehicle Number
          </label>
          <input
            type="text"
            id="filterVehicleNumber"
            name="vehicleNumber"
            value={filterConfig.vehicleNumber}
            onChange={handleFilterChange}
            placeholder="Search by vehicle number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="filterVehicleType" className="block text-sm font-medium text-gray-700 mb-1">
            Vehicle Type
          </label>
          <select
            id="filterVehicleType"
            name="vehicleType"
            value={filterConfig.vehicleType}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            {vehicleTypes.map((type) => (
              <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="filterStatus"
            name="status"
            value={filterConfig.status}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="under_maintenance">Under Maintenance</option>
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
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default VehicleFilter;