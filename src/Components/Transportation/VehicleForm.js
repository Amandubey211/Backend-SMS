// Components/Transportation/VehicleForm.js
import React from "react";

const VehicleForm = ({ vehicleData, handleChange, handleSubmit }) => {
  // Vehicle types for dropdown
  const vehicleTypes = ["bus", "van", "auto", "cab", "e-rickshaw", "other"];
  
  // Fuel types for dropdown
  const fuelTypes = ["diesel", "petrol", "cng", "electric", "hybrid"];
  
  // Vehicle categories for dropdown
  const vehicleCategories = [
    "ac", "non-ac", "sleeper", "semi-sleeper", "mini", 
    "double-decker", "hatchback", "sedan", "e-rickshaw", 
    "open", "cargo", "other"
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form sections */}
      <div className="bg-blue-50 p-3 rounded-md mb-4">
        <h3 className="text-md font-medium text-blue-800 mb-3">Vehicle Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Type *
            </label>
            <select
              id="vehicleType"
              name="vehicleType"
              value={vehicleData.vehicleType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            >
              <option value="" disabled>Select vehicle type</option>
              {vehicleTypes.map(type => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>
          </div>
          
          {vehicleData.vehicleType === "other" && (
            <div>
              <label htmlFor="customVehicleType" className="block text-sm font-medium text-gray-700 mb-1">
                Custom Vehicle Type *
              </label>
              <input
                type="text"
                id="customVehicleType"
                name="customVehicleType"
                value={vehicleData.customVehicleType}
                onChange={handleChange}
                placeholder="Enter custom vehicle type"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required={vehicleData.vehicleType === "other"}
              />
            </div>
          )}
          
          <div>
            <label htmlFor="vehicleNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Number *
            </label>
            <input
              type="text"
              id="vehicleNumber"
              name="vehicleNumber"
              value={vehicleData.vehicleNumber}
              onChange={handleChange}
              placeholder="Enter vehicle number (e.g., KA-01-1234)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="seatingCapacity" className="block text-sm font-medium text-gray-700 mb-1">
              Seating Capacity *
            </label>
            <input
              type="number"
              id="seatingCapacity"
              name="seatingCapacity"
              value={vehicleData.seatingCapacity}
              onChange={handleChange}
              placeholder="Enter seating capacity"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              id="status"
              name="status"
              value={vehicleData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="under_maintenance">Under Maintenance</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700 mb-1">
              Fuel Type *
            </label>
            <select
              id="fuelType"
              name="fuelType"
              value={vehicleData.fuelType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            >
              <option value="" disabled>Select fuel type</option>
              {fuelTypes.map(type => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="bg-green-50 p-3 rounded-md mb-4">
        <h3 className="text-md font-medium text-green-800 mb-3">Vehicle Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="vehicleCategory" className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Category
            </label>
            <select
              id="vehicleCategory"
              name="vehicleCategory"
              value={vehicleData.vehicleCategory}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select category</option>
              {vehicleCategories.map(category => (
                <option key={category} value={category}>
                  {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-')}
                </option>
              ))}
            </select>
          </div>
          
          {vehicleData.vehicleCategory === "other" && (
            <div>
              <label htmlFor="customVehicleCategory" className="block text-sm font-medium text-gray-700 mb-1">
                Custom Vehicle Category *
              </label>
              <input
                type="text"
                id="customVehicleCategory"
                name="customVehicleCategory"
                value={vehicleData.customVehicleCategory}
                onChange={handleChange}
                placeholder="Enter custom vehicle category"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required={vehicleData.vehicleCategory === "other"}
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-yellow-50 p-3 rounded-md mb-4">
        <h3 className="text-md font-medium text-yellow-800 mb-3">Safety Features</h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="cameraInstalled"
              name="cameraInstalled"
              checked={vehicleData.cameraInstalled}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="cameraInstalled" className="ml-2 block text-sm text-gray-700">
              Camera Installed
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="firstAidAvailable"
              name="firstAidAvailable"
              checked={vehicleData.firstAidAvailable}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="firstAidAvailable" className="ml-2 block text-sm text-gray-700">
              First Aid Available
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="speedGovernorInstalled"
              name="speedGovernorInstalled"
              checked={vehicleData.speedGovernorInstalled}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="speedGovernorInstalled" className="ml-2 block text-sm text-gray-700">
              Speed Governor Installed
            </label>
          </div>
        </div>
      </div>
      
      <div className="bg-red-50 p-3 rounded-md mb-4">
        <h3 className="text-md font-medium text-red-800 mb-3">Document Upload</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="insurance" className="block text-sm font-medium text-gray-700 mb-1">
              Insurance Document
            </label>
            <div className="flex space-x-2">
              <input
                type="file"
                id="insurance"
                name="insurance"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="date"
                placeholder="Expiry Date"
                className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="rc" className="block text-sm font-medium text-gray-700 mb-1">
              Registration Certificate (RC)
            </label>
            <div className="flex space-x-2">
              <input
                type="file"
                id="rc"
                name="rc"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="date"
                placeholder="Expiry Date"
                className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="additionalDocuments" className="block text-sm font-medium text-gray-700 mb-1">
              Additional Documents
            </label>
            <input
              type="file"
              id="additionalDocuments"
              name="additionalDocuments"
              multiple
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              You can select multiple files. Accepted formats: PDF, JPG, PNG (max 5MB each)
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Vehicle
        </button>
      </div>
    </form>
  );
};

export default VehicleForm;