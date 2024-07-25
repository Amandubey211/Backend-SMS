import React, { useState, useEffect, useMemo, useCallback } from "react";
import Sidebar from "../../../../../Components/Common/Sidebar";
import PaySalary from "./PaySalary";
import { fetchApi } from '../api/api';
import { baseUrl } from "../../../../../config/Common";
import axios from "axios";

const TeacherRow = React.memo(({ teacher, onPayClick }) => (
  <tr className="bg-white">
    <td className="px-5 py-3 border-b border-gray-200 flex items-center">
      {teacher.staffId?.profile ? (
        <img src={teacher.staffId?.profile} alt="Profile" className="w-10 h-10 rounded-full mr-3" />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
          <span className="text-gray-700 font-semibold">
            {teacher.staffId?.fullName[0]}
          </span>
        </div>
      )}
      <div>
        <div>{teacher.staffId?.fullName}</div>
        <div className="text-sm text-gray-500">{teacher.staffId?.position}</div>
      </div>
    </td>
    <td className="px-5 py-2 border-b border-gray-200">{teacher.staffId?.mobileNumber}</td>
    <td className="px-5 py-2 border-b border-gray-200">{teacher.month}</td>
    <td className="px-5 py-2 border-b border-gray-200">{teacher.salaryAmount} QR</td>
    <td className="px-5 py-2 border-b border-gray-200">
      {teacher.paidDate ? new Date(teacher.paidDate).toLocaleDateString() : "---"}
    </td>
    <td className="px-5 py-2 border-b border-gray-200">
      <span className={`px-3 py-1 text-xs font-semibold ${teacher.status === "paid" ? " text-green-800" : " text-red-800"}`}>
        {teacher.status}
      </span>
    </td>
    <td className="px-5 py-2 border-b border-gray-200">
      {teacher.status === "paid" ? (
        <span className="inline-flex items-center border border-transparent text-xs font-medium shadow-sm bg-green-200 text-green-800 py-1 px-2 rounded-md">
          Completed
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

const TeacherSalary = ({ initialTeacherData, selectedOption, selectedMonth }) => {
  const [teacherData, setTeacherData] = useState(initialTeacherData || []);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const token = localStorage.getItem('admin:token');

  // Fetch salaries based on filter
  const fetchSalaries = useCallback(async (query, month) => {
    try {
      const year = new Date().getFullYear();
      const response = await axios.get(`${baseUrl}/admin/staff/get_salary?salaryRole=teacher&status=${query}&month=${month}&year=${year}`,
        {
          headers: {
            Authentication: token
          }
        }
      );
      setTeacherData(response.data.salaryRecords);
      console.log("teacgerDara",response);
    } catch (error) {
      console.error('Error fetching salaries:', error);
    }
  }, [token]);

  useEffect(() => {
    fetchSalaries(selectedOption, selectedMonth);
  }, [selectedOption, selectedMonth, fetchSalaries]);

  // Handle clicking the pay button
  const handlePayClick = (teacher) => {
    setSelectedTeacher(teacher);
    setSidebarOpen(true);
  };

  // Handle salary update
  const handleUpdateSalary = async (salaryDetails) => {
    try {
      await fetchApi(`${baseUrl}/admin/staff/update_salary`, "PUT", salaryDetails, token);
      // Reload the salaries after update
      await fetchSalaries(selectedOption, selectedMonth);
      handleSidebarClose();
    } catch (error) {
      console.error("Failed to update salary:", error);
    }
  };

  // Close the sidebar
  const handleSidebarClose = () => {
    setSidebarOpen(false);
    setSelectedTeacher(null);
  };

  return (
    <div>
      <table className="min-w-full leading-normal mt-4 shadow-lg rounded-lg overflow-hidden">
        <thead>
          <tr className="text-left text-gray-700 bg-gray-100">
            <th className="px-5 py-3 border-b-2 border-gray-200">Teachers Name</th>
            <th className="px-5 py-3 border-b-2 border-gray-200">Contact Info</th>
            <th className="px-5 py-3 border-b-2 border-gray-200">Salary Month</th>
            <th className="px-5 py-3 border-b-2 border-gray-200">Salary Amount</th>
            <th className="px-5 py-3 border-b-2 border-gray-200">Paid Date</th>
            <th className="px-5 py-3 border-b-2 border-gray-200">Status</th>
            <th className="px-5 py-3 border-b-2 border-gray-200">Action</th>
          </tr>
        </thead>
        <tbody>
          {teacherData?.reverse()?.map((teacher, index) => (
            <TeacherRow key={index} teacher={teacher} onPayClick={handlePayClick} />
          ))}
        </tbody>
      </table>
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} title="Add Transaction">
        <PaySalary teacher={selectedTeacher} onSave={handleUpdateSalary} />
      </Sidebar>
    </div>
  );
};

export default TeacherSalary;

