// Components/Transportation/DriverVehicleAssignmentList.js
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaCar, FaUserTie, FaCalendarAlt } from "react-icons/fa";

const DriverVehicleAssignmentList = ({ onEdit }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterConfig, setFilterConfig] = useState({
    vehicleNumber: '',
    driverName: '',
    shift: 'all',
    status: 'all'
  });

  // Mock data (replace with API calls)
  useEffect(() => {
    // Fetch assignments with populated data
    const mockAssignments = [
      {
        _id: "a1",
        vehicle: { _id: "v1", vehicleNumber: "KA-01-4001", vehicleType: "bus" },
        driver: { _id: "d1", name: "Kameswaran", licenseNumber: "DL234567843" },
        helper: { _id: "d2", name: "John Doe", licenseNumber: "DL987654321" },
        shift: { _id: "s1", name: "Morning Shift", timing: "6:00 AM - 9:00 AM" },
        valid_from: "2025-04-01",
        valid_to: "2025-06-30",
        is_active: true,
        reason: "Regular Duty"
      },
      {
        _id: "a2",
        vehicle: { _id: "v2", vehicleNumber: "KA-01-4002", vehicleType: "van" },
        driver: { _id: "d3", name: "Jane Smith", licenseNumber: "DL543219876" },
        helper: null,
        shift: { _id: "s2", name: "Afternoon Shift", timing: "12:00 PM - 3:00 PM" },
        valid_from: "2025-04-01",
        valid_to: null,
        is_active: true,
        reason: "Regular Duty"
      },
      {
        _id: "a3",
        vehicle: { _id: "v3", vehicleNumber: "KA-01-4003", vehicleType: "bus" },
        driver: { _id: "d2", name: "John Doe", licenseNumber: "DL987654321" },
        helper: { _id: "d3", name: "Jane Smith", licenseNumber: "DL543219876" },
        shift: { _id: "s3", name: "Evening Shift", timing: "3:00 PM - 6:00 PM" },
        valid_from: "2025-03-15",
        valid_to: "2025-05-15",
        is_active: false,
        reason: "Temporary Assignment"
      }
    ];
    
    setAssignments(mockAssignments);
    setLoading(false);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterConfig({
      ...filterConfig,
      [name]: value
    });
  };

  const resetFilters = () => {
    setFilterConfig({
      vehicleNumber: '',
      driverName: '',
      shift: 'all',
      status: 'all'
    });
  };

  // Apply filters
  const filteredAssignments = assignments.filter(assignment => {
    // Vehicle number filter
    if (filterConfig.vehicleNumber && !assignment.vehicle.vehicleNumber.toLowerCase().includes(filterConfig.vehicleNumber.toLowerCase())) {
      return false;
    }
    
    // Driver name filter
    if (filterConfig.driverName && !assignment.driver.name.toLowerCase().includes(filterConfig.driverName.toLowerCase())) {
      return false;
    }
    
    // Shift filter
    if (filterConfig.shift !== 'all' && assignment.shift._id !== filterConfig.shift) {
      return false;
    }
    
    // Status filter
    if (filterConfig.status !== 'all') {
      const isActive = filterConfig.status === 'active';
      if (assignment.is_active !== isActive) {
        return false;
      }
    }
    
    return true;
  });

  // Get unique shifts for filter dropdown
  const uniqueShifts = [...new Set(assignments.map(a => a.shift._id))].map(
    id => assignments.find(a => a.shift._id === id).shift
  );

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-medium text-gray-800">Driver-Vehicle Assignments</h2>
        <p className="text-sm text-gray-600">Manage driver assignments to vehicles for different shifts</p>
      </div>
      
      {/* Filter section */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label htmlFor="vehicleNumber" className="block text-xs font-medium text-gray-700 mb-1">
              Vehicle Number
            </label>
            <input
              type="text"
              id="vehicleNumber"
              name="vehicleNumber"
              value={filterConfig.vehicleNumber}
              onChange={handleFilterChange}
              placeholder="Search by vehicle"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="driverName" className="block text-xs font-medium text-gray-700 mb-1">
              Driver Name
            </label>
            <input
              type="text"
              id="driverName"
              name="driverName"
              value={filterConfig.driverName}
              onChange={handleFilterChange}
              placeholder="Search by driver"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="shift" className="block text-xs font-medium text-gray-700 mb-1">
              Shift
            </label>
            <select
              id="shift"
              name="shift"
              value={filterConfig.shift}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Shifts</option>
              {uniqueShifts.map(shift => (
                <option key={shift._id} value={shift._id}>
                  {shift.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="status" className="block text-xs font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={filterConfig.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        
        <div className="mt-3 flex justify-end">
          <button
            onClick={resetFilters}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Reset Filters
          </button>
        </div>
      </div>
      
      {/* Assignments List */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-4 text-center">Loading assignments...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver / Helper
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shift
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssignments.length > 0 ? (
                filteredAssignments.map((assignment, index) => (
                  <tr key={assignment._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaCar className="mr-2 text-blue-500" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{assignment.vehicle.vehicleNumber}</div>
                          <div className="text-xs text-gray-500">{assignment.vehicle.vehicleType.toUpperCase()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="flex items-center mb-1">
                          <FaUserTie className="mr-2 text-indigo-500" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{assignment.driver.name}</div>
                            <div className="text-xs text-gray-500">Driver</div>
                          </div>
                        </div>
                        {assignment.helper && (
                          <div className="flex items-center pl-1 border-l-2 border-gray-200 ml-1">
                            <FaUserTie className="mr-2 text-purple-400" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{assignment.helper.name}</div>
                              <div className="text-xs text-gray-500">Helper</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{assignment.shift.name}</div>
                      <div className="text-xs text-gray-500">{assignment.shift.timing}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-2 text-green-500" />
                        <div>
                          <div className="text-sm text-gray-900">
                            {new Date(assignment.valid_from).toLocaleDateString()}
                            {assignment.valid_to ? 
                              ` to ${new Date(assignment.valid_to).toLocaleDateString()}` : 
                              " (Ongoing)"
                            }
                          </div>
                          <div className="text-xs text-gray-500">{assignment.reason}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        assignment.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {assignment.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => onEdit(assignment)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <FaEdit />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No assignments found matching the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DriverVehicleAssignmentList;