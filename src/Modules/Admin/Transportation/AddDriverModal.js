import React, { useState } from "react";
import Modal from "../../../Components/Common/Modal";
import { useTranslation } from "react-i18next";

const AddDriverModal = ({ isOpen, onClose, onSave }) => {
  const { t } = useTranslation("transportation");
  const [driverData, setDriverData] = useState({
    name: "",
    phone: "",
    licenseNumber: "",
    assignedBus: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDriverData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(driverData);
    setDriverData({
      name: "",
      phone: "",
      licenseNumber: "",
      assignedBus: "",
    });
    onClose();
  };

  // List of available bus routes for dropdown
  const busRoutes = [
    "BUS 101 - Main Campus Route",
    "BUS 102 - Downtown Route",
    "BUS 103 - Residential Area Route",
    "BUS 104 - Express Route"
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-2">
        <h2 className="text-xl font-semibold mb-4" id="modal-title">
          Add Driver
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="driverName" className="block text-sm font-medium text-gray-700 mb-1">
              Driver Name
            </label>
            <input
              type="text"
              id="driverName"
              name="name"
              value={driverData.name}
              onChange={handleChange}
              placeholder="Enter Driver Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                id="phoneNumber"
                name="phone"
                value={driverData.phone}
                onChange={handleChange}
                placeholder="Enter Phone Number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">
              License Number
            </label>
            <input
              type="text"
              id="licenseNumber"
              name="licenseNumber"
              value={driverData.licenseNumber}
              onChange={handleChange}
              placeholder="Enter License Number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="assignedBus" className="block text-sm font-medium text-gray-700 mb-1">
              Assigned Bus
            </label>
            <div className="relative">
              <select
                id="assignedBus"
                name="assignedBus"
                value={driverData.assignedBus}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 appearance-none"
                required
              >
                <option value="" disabled>Select Bus Route</option>
                {busRoutes.map((route, index) => (
                  <option key={index} value={route}>
                    {route}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Save
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default AddDriverModal;