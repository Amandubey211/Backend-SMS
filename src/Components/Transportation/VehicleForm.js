import { useEffect, useState } from "react";

const VehicleForm = ({ vehicleData, handleChange, handleSubmit, isEditing }) => {
  // Local state for live typing
  const [localVehicleData, setLocalVehicleData] = useState(vehicleData);

  // Whenever props.vehicleData changes (like on Edit click), update local form state
  useEffect(() => {
    setLocalVehicleData(vehicleData);
  }, [vehicleData]);

  // Handle local change and update parent
  const handleLocalChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setLocalVehicleData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Call parent handleChange to update the main vehicleData too
    handleChange(e);
  };

  // Dropdown options
  const vehicleTypes = ["Bus", "Van", "Cab", "Others"];
  const fuelTypes = ["Diesel", "Petrol", "CNG", "Electric", "Hybrid"];
  const vehicleCategories = [
    "AC", "Non-AC", "Sleeper", "Semi-Sleeper", "Mini",
    "Double-Decker", "Hatchback", "Sedan",
    "Open", "Cargo", "Others"
  ];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(localVehicleData);  // <-- Pass the LIVE DATA here!
      }}
      className="space-y-6"
    >
      

      {/* Vehicle Information Section */}
      <div className="bg-blue-50 p-3 rounded-md mb-4">
        <h3 className="text-md font-medium text-blue-800 mb-3">Vehicle Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Vehicle Type */}
          <div>
            <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Type *
            </label>
            <select
              id="vehicleType"
              name="vehicleType"
              value={localVehicleData.vehicleType}
              onChange={handleLocalChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            >
              <option value="" disabled>Select vehicle type</option>
              {vehicleTypes.map((type) => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="vehicleName" className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Name & Model
            </label>
            <input
              type="text"
              id="vehicleName"
              name="vehicleName"
              value={localVehicleData?.vehicleName}
              onChange={handleLocalChange}
              placeholder="Enter Vehicle Name & Model"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          {/* Custom Vehicle Type */}
          {localVehicleData.vehicleType === "Others" && (
            <div>
              <label htmlFor="customVehicleType" className="block text-sm font-medium text-gray-700 mb-1">
                Custom Vehicle Type *
              </label>
              <input
                type="text"
                id="customVehicleType"
                name="customVehicleType"
                value={localVehicleData.customVehicleType}
                onChange={handleLocalChange}
                placeholder="Enter custom vehicle type"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
          )}

          {/* Vehicle Number */}
          <div>
            <label htmlFor="vehicleNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Number *
            </label>
            <input
              type="text"
              id="vehicleNumber"
              name="vehicleNumber"
              value={localVehicleData.vehicleNumber}
              onChange={handleLocalChange}
              placeholder="Enter vehicle number (e.g., KA-01-1234)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {/* Seating Capacity */}
          <div>
            <label htmlFor="seatingCapacity" className="block text-sm font-medium text-gray-700 mb-1">
              Seating Capacity *
            </label>
            <input
              type="number"
              id="seatingCapacity"
              name="seatingCapacity"
              value={localVehicleData.seatingCapacity}
              onChange={handleLocalChange}
              placeholder="Enter seating capacity"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              id="status"
              name="status"
              value={localVehicleData.status}
              onChange={handleLocalChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="under_maintenance">Under Maintenance</option>
            </select>
          </div>

          {/* Fuel Type */}
          <div>
            <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700 mb-1">
              Fuel Type *
            </label>
            <select
              id="fuelType"
              name="fuelType"
              value={localVehicleData.fuelType}
              onChange={handleLocalChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            >
              <option value="" disabled>Select fuel type</option>
              {fuelTypes.map((type) => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Vehicle Category Section */}
      <div className="bg-green-50 p-3 rounded-md mb-4">
        <h3 className="text-md font-medium text-green-800 mb-3">Vehicle Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Vehicle Category */}
          <div>
            <label htmlFor="vehicleCategory" className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Category
            </label>
            <select
              id="vehicleCategory"
              name="vehicleCategory"
              value={localVehicleData.vehicleCategory}
              onChange={handleLocalChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select category</option>
              {vehicleCategories.map((category) => (
                <option key={category} value={category}>
                  {category.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('-')}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Vehicle Category */}
          {localVehicleData.vehicleCategory === "other" && (
            <div>
              <label htmlFor="customVehicleCategory" className="block text-sm font-medium text-gray-700 mb-1">
                Custom Vehicle Category *
              </label>
              <input
                type="text"
                id="customVehicleCategory"
                name="customVehicleCategory"
                value={localVehicleData.customVehicleCategory}
                onChange={handleLocalChange}
                placeholder="Enter custom vehicle category"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
          )}
        </div>
      </div>

      {/* Safety Features Section */}
      <div className="bg-yellow-50 p-3 rounded-md mb-4">
        <h3 className="text-md font-medium text-yellow-800 mb-3">Safety Features</h3>
        <div className="space-y-3">

          {/* Camera Installed */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="cameraInstalled"
              name="cameraInstalled"
              checked={localVehicleData.cameraInstalled}
              onChange={handleLocalChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="cameraInstalled" className="ml-2 block text-sm text-gray-700">
              Camera Installed
            </label>
          </div>

          {/* First Aid */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="firstAidAvailable"
              name="firstAidAvailable"
              checked={localVehicleData.firstAidAvailable}
              onChange={handleLocalChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="firstAidAvailable" className="ml-2 block text-sm text-gray-700">
              First Aid Available
            </label>
          </div>

          {/* Speed Governor */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="speedGovernorInstalled"
              name="speedGovernorInstalled"
              checked={localVehicleData.speedGovernorInstalled}
              onChange={handleLocalChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="speedGovernorInstalled" className="ml-2 block text-sm text-gray-700">
              Speed Governor Installed
            </label>
          </div>

        </div>
      </div>

      {/* Form Actions */}
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
          {isEditing ? "Update Vehicle" : "Add Vehicle"}
        </button>
      </div>

    </form>
  );
};

export default VehicleForm;
