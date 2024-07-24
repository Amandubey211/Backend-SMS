import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../../../../../Components/Common/Sidebar";
import PaySalary from "./PaySalary";
import { fetchApi } from '../api/api';
import { baseUrl } from "../../../../../config/Common";

// Memoized row component
const SalaryRow = React.memo(({ staff, onPayClick }) => (
  
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
      <span className={`px-3 py-1 text-xs font-semibold ${staff.status === "Paid" ? " text-green-800" : " text-red-800"}`}>
        {staff.status}
      </span>
    </td>
    <td className="px-5 py-2 border-b border-gray-200">
      {staff.status === "Paid" ? (
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
    </td>
  </tr>
));

const StaffSalary = ({ staffData, selectedMonth }) => {
  const [teachersData, setTeachersData] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10); // Adjust the number per page as needed
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const token = localStorage.getItem('admin:token');

  // useEffect(() => {
  //   loadSalaries();
  // }, [selectedMonth]);

  // const loadSalaries = async () => {
  //   try {
  //     const response = await fetchApi(`${baseUrl}/admin/staff/get_salary?salaryRole=all`, "GET", null, token);
  //     if (response && response.success && Array.isArray(response.salaryRecords)) {
  //       const formattedData = response.salaryRecords.map(record => ({
  //         profile: record.staffId.profile,
  //         staffName: record.staffId.fullName,
  //         position: record.staffId.position,
  //         contactInfo: record.staffId.mobileNumber,
  //         month: record.month,
  //         salaryAmount: record.salaryAmount,
  //         paidDate: record.paidDate,
  //         status: record.status === "unpaid" ? "Unpaid" : "Paid"
  //       }));
  //       console.log("formattedData", formattedData)
  //       setTeachersData(formattedData);
  //     } else {
  //       setTeachersData([]);
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch salaries:", error);
  //   }
  // };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  //const currentRecords = useMemo(() => teachersData.slice(indexOfFirstRecord, indexOfLastRecord), [indexOfFirstRecord, indexOfLastRecord, teachersData]);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handlePayClick = (teacher) => {
    setSelectedTeacher(teacher);
    setSidebarOpen(true);
  };

  // const handleCreateSalary = async (salaryDetails) => {
  //   try {
  //     await fetchApi(`${baseUrl}/staff/create_salary?salaryRole=all`, "POST", salaryDetails, token);
  //     loadSalaries();
  //     handleSidebarClose();
  //   } catch (error) {
  //     console.error("Failed to create salary:", error);
  //   }
  // };

  // const handleUpdateSalary = async (salaryDetails) => {
  //   try {
  //     await fetchApi(`${baseUrl}/admin/staff/update_salary`, "PUT", salaryDetails, token);
  //     loadSalaries();
  //     handleSidebarClose();
  //   } catch (error) {
  //     console.error("Failed to update salary:", error);
  //   }
  // };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
    setSelectedTeacher(null); // Reset selected teacher on close
  };

  return (
    <div>
      <table className="min-w-full leading-normal mt-4 shadow-lg rounded-lg overflow-hidden">
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
          
          {staffData?.reverse()?.map((staff, index) => (
            <SalaryRow key={index} staff={staff} onPayClick={handlePayClick} />
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
        <PaySalary teacher={selectedTeacher} />
      </Sidebar>
    </div>
  );
};

export default StaffSalary;

