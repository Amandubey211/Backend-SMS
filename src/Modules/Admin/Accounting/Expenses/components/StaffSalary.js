import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../../../../../Components/Common/Sidebar";
import PaySalary from "./PaySalary";
import { fetchApi } from '../api/api';
import { baseUrl } from "../../../../../config/Common";

// Memoized row component
const SalaryRow = React.memo(({ teacher, onPayClick }) => (
  <tr className="bg-white">
    <td className="px-5 py-3 border-b border-gray-200">{teacher.staffId}</td>
    <td className="px-5 py-2 border-b border-gray-200">{new Date(teacher.dateOfJoining).toLocaleDateString()}</td>
    <td className="px-5 py-2 border-b border-gray-200">{teacher.month}</td>
    <td className="px-5 py-2 border-b border-gray-200">{teacher.salaryAmount}</td>
    <td className="px-5 py-2 border-b border-gray-200">{teacher.paidDate ? new Date(teacher.paidDate).toLocaleDateString() : "Not Paid"}</td>
    <td className="px-5 py-2 border-b border-gray-200">
      <span
        className={`px-3 py-1 text-xs font-semibold rounded-full ${teacher.status === "Paid" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
          }`}
      >
        {teacher.status}
      </span>
    </td>
    <td className="px-5 py-2 border-b border-gray-200">
      {teacher.status === "Paid" ? (
        <span className="inline-flex items-center border border-transparent text-xs font-medium shadow-sm bg-green-200 text-green-800 py-1 px-2 rounded-md">
          Complete
        </span>
      ) : (
        <button
          className="inline-flex items-center border border-transparent text-xs font-medium shadow-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white py-1 px-2 rounded-md hover:from-pink-600 hover:to-purple-600"
          onClick={() => onPayClick(teacher)}
        >
          Pay Now
        </button>
      )}
    </td>
  </tr>
));

const StaffSalary = ({ selectedMonth }) => {
  const [teachersData, setTeachersData] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10); // Adjust the number per page as needed
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const token = localStorage.getItem('admin:token');

  useEffect(() => {
    loadSalaries();
  }, [selectedMonth]);

  const loadSalaries = async () => {
    try {
      const response = await fetchApi(`${baseUrl}/admin/staff/get_salary?salaryRole=all`, "GET", null, token);
      if (response && response.success && Array.isArray(response.salaryRecords)) {
        setTeachersData(response.salaryRecords);
      } else {
        setTeachersData([]);
      }
    } catch (error) {
      console.error("Failed to fetch salaries:", error);
    }
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = useMemo(() => teachersData.slice(indexOfFirstRecord, indexOfLastRecord), [indexOfFirstRecord, indexOfLastRecord, teachersData]);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handlePayClick = (teacher) => {
    setSelectedTeacher(teacher);
    setSidebarOpen(true);
  };

  const handleCreateSalary = async (salaryDetails) => {
    try {
      await fetchApi(`${baseUrl}/staff/create_salary?salaryRole=all`, "POST", salaryDetails, token);
      loadSalaries();
      handleSidebarClose();
    } catch (error) {
      console.error("Failed to create salary:", error);
    }
  };

  const handleUpdateSalary = async (salaryDetails) => {
    try {
      await fetchApi(`${baseUrl}/staff/update_salary?salaryRole=all`, "PUT", salaryDetails, token);
      loadSalaries();
      handleSidebarClose();
    } catch (error) {
      console.error("Failed to update salary:", error);
    }
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
    setSelectedTeacher(null); // Reset selected teacher on close
  };

  return (
    <div>
      <table className="min-w-full leading-normal mt-4 shadow-lg rounded-lg overflow-hidden">
        <thead>
          <tr className="text-left text-gray-700 bg-gray-100">
            <th className="px-5 py-3 border-b-2 border-gray-200">Staff ID</th>
            <th className="px-5 py-3 border-b-2 border-gray-200">Date of Joining</th>
            <th className="px-5 py-3 border-b-2 border-gray-200">Salary Month</th>
            <th className="px-5 py-3 border-b-2 border-gray-200">Salary Amount</th>
            <th className="px-5 py-3 border-b-2 border-gray-200">Paid Date</th>
            <th className="px-5 py-3 border-b-2 border-gray-200">Status</th>
            <th className="px-5 py-3 border-b-2 border-gray-200">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((teacher, index) => (
            <SalaryRow key={index} teacher={teacher} onPayClick={handlePayClick} />
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {[...Array(Math.ceil(teachersData.length / recordsPerPage)).keys()].map(number => (
          <button key={number} onClick={() => handlePageChange(number + 1)}>
            {number + 1}
          </button>
        ))}
      </div>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        title="Add Transaction"
      >
        <PaySalary teacher={selectedTeacher} onSave={handleCreateSalary} onUpdate={handleUpdateSalary} />
      </Sidebar>
    </div>
  );
};

export default StaffSalary;

