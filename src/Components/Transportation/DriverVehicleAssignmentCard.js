import React from 'react'
import { FaBusAlt, FaUserTie, FaMapMarkedAlt } from "react-icons/fa";
const DriverVehicleAssignmentCard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
      <div className="flex items-center">
        <div className="rounded-full bg-blue-100 p-3 mr-4">
          <FaBusAlt className="text-blue-500 text-xl" />
        </div>
        <div>
          <p className="text-gray-500 text-sm">Total Vehicles</p>
          <h3 className="text-2xl font-semibold text-gray-800">24</h3>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
      <div className="flex items-center">
        <div className="rounded-full bg-green-100 p-3 mr-4">
          <FaUserTie className="text-green-500 text-xl" />
        </div>
        <div>
          <p className="text-gray-500 text-sm">Available Drivers</p>
          <h3 className="text-2xl font-semibold text-gray-800">18</h3>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
      <div className="flex items-center">
        <div className="rounded-full bg-purple-100 p-3 mr-4">
          <FaMapMarkedAlt className="text-purple-500 text-xl" />
        </div>
        <div>
          <p className="text-gray-500 text-sm">Active Assignments</p>
          <h3 className="text-2xl font-semibold text-gray-800">16</h3>
        </div>
      </div>
    </div>
  </div>
  )
}

export default DriverVehicleAssignmentCard