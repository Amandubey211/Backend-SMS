// Components/Transportation/DriverVehicleAssignment.js
import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaUserTie, FaUserFriends, FaCar, FaClock } from "react-icons/fa";

const DriverVehicleAssignment = ({ onSave, onClose }) => {
  const [formData, setFormData] = useState({
    vehicleId: "",
    shiftId: "",
    assigned_driver: "",
    assigned_helper: "",
    valid_from: new Date().toISOString().split('T')[0],
    valid_to: "",
    reason: "Regular Duty",
    is_active: true
  });

  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data (replace with API calls)
  useEffect(() => {
    // Fetch vehicles
    const mockVehicles = [
      { _id: "v1", vehicleNumber: "KA-01-4001", vehicleType: "bus" },
      { _id: "v2", vehicleNumber: "KA-01-4002", vehicleType: "van" },
      { _id: "v3", vehicleNumber: "KA-01-4003", vehicleType: "bus" }
    ];
    
    // Fetch drivers
    const mockDrivers = [
      { _id: "d1", name: "Kameswaran", licenseNumber: "DL234567843", status: "Active" },
      { _id: "d2", name: "John Doe", licenseNumber: "DL987654321", status: "Active" },
      { _id: "d3", name: "Jane Smith", licenseNumber: "DL543219876", status: "Active" }
    ];
    
    // Fetch shifts
    const mockShifts = [
      { _id: "s1", name: "Morning Shift", timing: "6:00 AM - 9:00 AM" },
      { _id: "s2", name: "Afternoon Shift", timing: "12:00 PM - 3:00 PM" },
      { _id: "s3", name: "Evening Shift", timing: "3:00 PM - 6:00 PM" }
    ];
    
    setVehicles(mockVehicles);
    setDrivers(mockDrivers);
    setShifts(mockShifts);
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Add current date to the form data
    const dataToSubmit = {
      ...formData,
      date: new Date().toISOString()
    };
    
    // Here you would typically send the data to your API
    console.log("Submitting assignment:", dataToSubmit);
    
    // Call the passed onSave function with the form data
    if (onSave) onSave(dataToSubmit);
  };

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
        <h2 className="text-lg font-medium">Assign Driver to Vehicle</h2>
        <button 
          onClick={onClose}
          className="text-white hover:bg-blue-700 rounded-full p-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Left column */}
          <div className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-md">
              <h3 className="flex items-center text-blue-800 font-medium mb-3">
                <FaCar className="mr-2" /> Vehicle Selection
              </h3>
              <div className="mb-4">
                <label htmlFor="vehicleId" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Vehicle *
                </label>
                <select
                  id="vehicleId"
                  name="vehicleId"
                  value={formData.vehicleId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                >
                  <option value="" disabled>Select a vehicle</option>
                  {vehicles.map(vehicle => (
                    <option key={vehicle._id} value={vehicle._id}>
                      {vehicle.vehicleNumber} ({vehicle.vehicleType.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="bg-green-50 p-3 rounded-md">
              <h3 className="flex items-center text-green-800 font-medium mb-3">
                <FaClock className="mr-2" /> Shift Information
              </h3>
              <div className="mb-4">
                <label htmlFor="shiftId" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Shift *
                </label>
                <select
                  id="shiftId"
                  name="shiftId"
                  value={formData.shiftId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                >
                  <option value="" disabled>Select a shift</option>
                  {shifts.map(shift => (
                    <option key={shift._id} value={shift._id}>
                      {shift.name} ({shift.timing})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="bg-yellow-50 p-3 rounded-md">
              <h3 className="flex items-center text-yellow-800 font-medium mb-3">
                <FaCalendarAlt className="mr-2" /> Assignment Period
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="valid_from" className="block text-sm font-medium text-gray-700 mb-1">
                    Valid From *
                  </label>
                  <input
                    type="date"
                    id="valid_from"
                    name="valid_from"
                    value={formData.valid_from}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="valid_to" className="block text-sm font-medium text-gray-700 mb-1">
                    Valid To
                  </label>
                  <input
                    type="date"
                    id="valid_to"
                    name="valid_to"
                    value={formData.valid_to}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    min={formData.valid_from}
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty if assignment is indefinite</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column */}
          <div className="space-y-4">
            <div className="bg-purple-50 p-3 rounded-md">
              <h3 className="flex items-center text-purple-800 font-medium mb-3">
                <FaUserTie className="mr-2" /> Staff Assignment
              </h3>
              <div className="mb-4">
                <label htmlFor="assigned_driver" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Driver *
                </label>
                <select
                  id="assigned_driver"
                  name="assigned_driver"
                  value={formData.assigned_driver}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                >
                  <option value="" disabled>Select a driver</option>
                  {drivers.map(driver => (
                    <option key={driver._id} value={driver._id}>
                      {driver.name} ({driver.licenseNumber})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="assigned_helper" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Helper (Optional)
                </label>
                <select
                  id="assigned_helper"
                  name="assigned_helper"
                  value={formData.assigned_helper}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">None</option>
                  {drivers
                    .filter(driver => driver._id !== formData.assigned_driver)
                    .map(driver => (
                      <option key={driver._id} value={driver._id}>
                        {driver.name} ({driver.licenseNumber})
                      </option>
                    ))
                  }
                </select>
              </div>
            </div>
            
            <div className="bg-red-50 p-3 rounded-md">
              <h3 className="flex items-center text-red-800 font-medium mb-3">
                <FaUserFriends className="mr-2" /> Assignment Details
              </h3>
              <div className="mb-4">
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Assignment
                </label>
                <input
                  type="text"
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="E.g., Regular Duty, Substitute, Special Assignment"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              
              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                    Active Assignment
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">Uncheck to create an inactive or future assignment</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Assignment
          </button>
        </div>
      </form>
    </div>
  );
};

export default DriverVehicleAssignment;