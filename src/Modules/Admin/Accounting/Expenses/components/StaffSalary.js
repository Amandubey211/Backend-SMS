import React, { useState, useEffect, useRef, useCallback } from "react";
import Sidebar from "../../../../../Components/Common/Sidebar";
import PaySalary from "./PaySalary";
import { fetchApi } from '../api/api';
import { baseUrl } from "../../../../../config/Common";
import axios from "axios";
import { useSelector } from "react-redux";

const DropdownMenu = ({ onEditClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null); // <-- Added useRef

  const handleToggle = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]); // <-- Added useEffect

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className="inline-flex items-center justify-center p-2 bg-transparent text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <span className="text-lg">&#x22EE;</span>
      </button>
      {isOpen && (
        <div ref={dropdownRef} className="absolute right-0 w-48 mt-2 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"> {/* <-- Added ref */}
          <div className="p-1">
            <button
              onClick={onEditClick}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              Edit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Memoized row component
const SalaryRow = React.memo(({ staff, onPayClick, onEditClick }) => {
  return (
    <tr className="bg-white">
      <td className="px-5 py-3 border-b border-gray-200 flex items-center">
        {staff.staffId?.profile ? (
          <img src={staff.staffId?.profile} alt="Profile" className="w-10 h-10 rounded-full mr-3" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
            <span className="text-gray-700 font-semibold">
              {staff.staffId?.fullName[0]}
            </span>
          </div>
        )}
        <div>
          <div>{staff.staffId?.fullName}</div>
          <div className="text-sm text-gray-500">{staff.staffId?.position}</div>
        </div>
      </td>
      <td className="px-5 py-2 border-b border-gray-200">{staff.staffId?.mobileNumber}</td>
      <td className="px-5 py-2 border-b border-gray-200">{staff.month}</td>
      <td className="px-5 py-2 border-b border-gray-200">{staff.salaryAmount} QR</td>
      <td className="px-5 py-2 border-b border-gray-200">
        {staff.paidDate ? new Date(staff.paidDate).toLocaleDateString() : "---"}
      </td>
      <td className="px-5 py-2 border-b border-gray-200">
        <span className={`px-3 py-1 text-xs font-semibold ${staff.status === "paid" ? " text-green-800" : " text-red-800"}`}>
          {staff.status}
        </span>
      </td>
      <td className="px-5 py-2 border-b border-gray-200 flex items-center justify-between space-x-2">
        {staff.status === "paid" ? (
          <span className="inline-flex items-center border border-transparent text-xs font-medium shadow-sm bg-green-200 text-green-800 py-1 px-2 rounded-md">
            Completed
          </span>
        ) : (
          <button
            className="inline-flex items-center border border-transparent text-xs font-medium shadow-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white py-1 px-2 rounded-md hover:from-pink-600 hover:to-purple-600"
            onClick={() => onPayClick(staff)}
          >
            Pay Now
          </button>
        )}
        <DropdownMenu onEditClick={() => onEditClick(staff)} />
      </td>
    </tr>
  );
});

const StaffSalary = ({ initialStaffData, selectedOption, selectedMonth }) => {
  const [staffData, setStaffData] = useState(initialStaffData || []);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isEditSidebarOpen, setEditSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const role = useSelector((store) => store.Auth.role);
  const token = localStorage.getItem(`${role}:token`);

  const fetchSalaries = useCallback(async (query, month) => {
    try {
      const year = new Date().getFullYear();
      const response = await axios.get(`${baseUrl}/admin/staff/get_salary?salaryRole=all&status=${query}&month=${month}&year=${year}`,
        {
          headers: {
            Authentication: token
          }
        }
      );
      setStaffData(response.data.salaryRecords);
      console.log("staffData", response);
    } catch (error) {
      console.error('Error fetching salaries:', error);
    }
  }, [token]);

  useEffect(() => {
    fetchSalaries(selectedOption, selectedMonth);
  }, [selectedOption, selectedMonth, fetchSalaries]);

  // Handle clicking the pay button
  const handlePayClick = (staff) => {
    setSelectedStaff(staff);
    setSidebarOpen(true);
  };

  // Handle clicking the edit button
  const handleEditClick = (staff) => {
    setSelectedStaff(staff);
    setEditSidebarOpen(true);
  };

  const handleUpdateSalary = async (salaryDetails) => {
    setLoading(true);
    try {
      await fetchApi(`${baseUrl}/admin/staff/update_salary`, "PUT", salaryDetails, token);

      await fetchSalaries(selectedOption, selectedMonth);
      handleEditSidebarClose();
    } catch (error) {
      console.error("Failed to update salary:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSidebarClose = () => {
    setEditSidebarOpen(false);
    setSelectedStaff(null);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
    setSelectedStaff(null);
  };

  return (
    <div>
      <table className="min-w-full leading-normal mt-4 rounded-lg">
        <thead>
          <tr className="text-left text-gray-700 bg-gray-100">
            <th className="px-5 py-3 border-b-2 border-gray-200">Staff Name</th>
            <th className="px-5 py-3 border-b-2 border-gray-200">Contact Info</th>
            <th className="px-5 py-3 border-b-2 border-gray-200">Salary Month</th>
            <th className="px-5 py-3 border-b-2 border-gray-200">Salary Amount</th>
            <th className="px-5 py-3 border-b-2 border-gray-200">Paid Date</th>
            <th className="px-5 py-3 border-b-2 border-gray-200">Status</th>
            <th className="px-5 py-3 border-b-2 border-gray-200">Action</th>
          </tr>
        </thead>
        <tbody>
          {staffData.map((staff, index) => (
            <SalaryRow key={index} staff={staff} onPayClick={handlePayClick} onEditClick={handleEditClick} />
          ))}
        </tbody>
      </table>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        title="Add Transaction"
      >
        <PaySalary teacher={selectedStaff} onSave={handleUpdateSalary} />
      </Sidebar>

      <Sidebar
        isOpen={isEditSidebarOpen}
        onClose={handleEditSidebarClose}
        title="Edit Salary Status"
      >
        {selectedStaff && (
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h2 className="text-xl font-semibold">Edit Salary Status</h2>
            </div>
            <div className="flex flex-col items-center mb-4">
              {selectedStaff.staffId.profile ? (
                <img
                  src={selectedStaff.staffId.profile}
                  alt={selectedStaff.staffId.fullName}
                  className="w-24 h-24 rounded-full"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-700 font-semibold text-3xl">{selectedStaff.staffId.fullName[0]}</span>
                </div>
              )}
              <h3 className="mt-2 text-lg font-semibold">{selectedStaff.staffId.fullName}</h3>
              <p>{selectedStaff.staffId.position}</p>
              <p className="text-green-600">{selectedStaff.staffId.mobileNumber}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salary Amount
              </label>
              <input
                type="number"
                value={selectedStaff.salaryAmount}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={selectedStaff.status || ''}
                onChange={(e) => setSelectedStaff({ ...selectedStaff, status: e.target.value })}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
              >
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            <button
              onClick={() => handleUpdateSalary(selectedStaff)}
              disabled={loading}
              className={`w-full flex justify-center border border-transparent shadow-sm text-sm font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600 ${loading ? 'bg-gray-400' : ''}`}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </Sidebar>
    </div>
  );
};

export default StaffSalary;
