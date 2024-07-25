import React, { useState, useEffect, useMemo } from "react";
import axios from 'axios';
import { baseUrl } from "../../../../../config/Common";
import Sidebar from "../../../../../Components/Common/Sidebar";


const OtherExpenses = ({ expenseData, selectedMonth }) => {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Track loading state
  const token = localStorage.getItem('admin:token');

  // Debugging useEffect to see if expenseData is being set correctly
  useEffect(() => {
    setData(expenseData);
  }, [expenseData]);

  const handleSidebarOpen = () => {
    if (selectedItem) setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
    setSelectedItem(null);
  };

  useEffect(() => {
    if (selectedItem) {
      handleSidebarOpen();
    }
  }, [selectedItem]);

  const handlePayClick = (item) => {
    setSelectedItem(item);
  };

  // Function to handle API call
  const handlePayNow = async () => {
    if (!selectedItem) return;

    setLoading(true);

    try {
      const expenseId = selectedItem._id
      // Replace with your actual API endpoint and request
      await axios.put(`${baseUrl}/api/admin/expenses/${expenseId}`, {
        status: "paid"
      },
        {
          headers: {
            Authentication: token
          }
        });

      // Update the local state or handle response as needed
      setData((prevData) =>
        prevData.map((item) =>
          item._id === selectedItem._id ? { ...item, status: "paid" } : item
        )
      );
      setSelectedItem(null);
      handleSidebarClose();
    } catch (error) {
      console.error('Error processing payment:', error);
    } finally {
      setLoading(false);
    }
  };

  // Memoized filtering to optimize performance
  const filteredData = useMemo(() => {
    const filtered = selectedMonth === "All" || !selectedMonth
      ? data
      : data.filter((item) => item.month === selectedMonth);
    return filtered;
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
          {filteredData.reverse().map((item, index) => (
            <tr key={index} className="bg-white">
              <td className="px-5 py-2 border-b border-gray-200">{item.reason}</td>
              <td className="px-5 py-2 border-b border-gray-200">{item.amount} QR</td>
              <td className="px-5 py-2 border-b border-gray-200">{new Date(item.date).toLocaleDateString()}</td>
              <td className="px-5 py-2 border-b border-gray-200">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${item.status === "paid" ? "text-green-800" : "text-red-800"}`}
                >
                  {item.status}
                </span>
              </td>
              <td className="px-5 py-2 border-b border-gray-200">
                {item.status === "paid" ? (
                  <span className="inline-flex items-center border border-transparent text-xs font-medium shadow-sm bg-green-200 text-green-800 py-1 px-2 rounded-md">
                    Completed
                  </span>
                ) : (
                  <button
                    className="inline-flex items-center border border-transparent text-xs font-medium shadow-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white py-1 px-2 rounded-md hover:from-pink-600 hover:to-purple-600"
                    onClick={() => handlePayClick(item)}
                  >
                    Pay Now
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Sidebar
        isOpen={isSidebarOpen}
        title="Pay Expense"
        onClose={handleSidebarClose}
        width="1/3"
      >
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h2 className="text-xl font-semibold">Pay Expense</h2>
          </div>
          <div className="flex flex-col items-center mb-4">
            {selectedItem?.profile ? (
              <img
                src={selectedItem.profile}
                alt={selectedItem.reason}
                className="w-24 h-24 rounded-full"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-700 font-semibold text-3xl">{selectedItem?.reason[0]}</span>
              </div>
            )}
            <h3 className="mt-2 text-lg font-semibold">{selectedItem?.reason}</h3>
            <p>{selectedItem?.position}</p>
            <p className="text-green-600">{selectedItem?.mobileNumber}</p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              value={selectedItem?.amount}
              readOnly
              className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <button
            onClick={handlePayNow}
            disabled={loading}
            className={`w-full flex justify-center border border-transparent shadow-sm text-sm font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600 ${loading ? 'bg-gray-400' : ''}`}
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </Sidebar>
    </div>
  );
};
export default OtherExpenses;
