import React, { useState, useEffect, useMemo } from "react";
import { baseUrl } from "../../../../../config/Common";




const OtherExpenses = (({ expenseData, selectedMonth }) => {
  const [data, setData] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Pagination state


  // const handleSidebarOpen = () => {
  //   if (selectedTeacher) setSidebarOpen(true);
  // };
  // const handleSidebarClose = () => setSidebarOpen(false);

  // const handlePayClick = (teacher) => {
  //   setSelectedTeacher(teacher);
  //   handleSidebarOpen();
  // };

  // Memoized filtering to optimize performance
  const filteredData = useMemo(() => {
    return data.filter(
      (item) => item.salaryMonth === selectedMonth || selectedMonth === "All"
    );
  }, [data, selectedMonth]);

  return (
    <div>
      <table className="min-w-full leading-normal mt-4 shadow-lg rounded-lg overflow-hidden">
        <thead>
          <tr className="text-left text-gray-700 bg-gray-100">
            <th className="px-5 py-3 border-b-2 border-gray-200">Expenses Reason</th>
            <th className="px-5 py-3 border-b-2 border-gray-200">Amount</th>
            <th className="px-5 py-3 border-b-2 border-gray-200">Expense Date</th>
            <th className="px-5 py-3 border-b-2 border-gray-200">Status</th>
            <th className="px-5 py-3 border-b-2 border-gray-200">Action</th>
          </tr>
        </thead>
        <tbody>
          {expenseData?.reverse()?.map((item, index) => (
            <tr key={index} className="bg-white">
              <td className="px-5 py-2 border-b border-gray-200">{item?.reason}</td>
              <td className="px-5 py-2 border-b border-gray-200">{item?.amount} QR</td>
              <td className="px-5 py-2 border-b border-gray-200">{new Date(item?.date).toLocaleDateString()}</td>
              <td className="px-5 py-2 border-b border-gray-200">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${item?.status === "Paid" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}
                >
                  {item?.status}
                </span>
              </td>
              <td className="px-5 py-2 border-b border-gray-200">
                {item?.status === "Paid" ? (
                  <span className="inline-flex items-center border border-transparent text-xs font-medium shadow-sm bg-green-200 text-green-800 py-1 px-2 rounded-md">
                    Complete
                  </span>
                ) : (
                  <button
                    className="inline-flex items-center border border-transparent text-xs font-medium shadow-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white py-1 px-2 rounded-md hover:from-pink-600 hover:to-purple-600"
                  // onClick={() => handlePayClick(item)}
                  >
                    Pay Now
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default OtherExpenses;

