import React, { useState, useEffect, useMemo } from "react";
import axios from 'axios';
import { baseUrl } from "../../../../../config/Common";
import Sidebar from "../../../../../Components/Common/Sidebar";
import { useSelector } from "react-redux";

const OtherExpenses = ({ expenseData, selectedMonth }) => {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const role = useSelector((store) => store.Auth.role);
  const token = localStorage.getItem(`${role}:token`);
  const [loading, setLoading] = useState(false);
  const [isEditSidebarOpen, setEditSidebarOpen] = useState(false);
  const [editExpense, setEditExpense] = useState(null);

  const handleEditSidebarOpen = (expense) => {
    setEditExpense(expense);
    setEditSidebarOpen(true);
  };

  const handleEditSidebarClose = () => {
    setEditSidebarOpen(false);
    setEditExpense(null);
  };

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

  const handlePayNow = async () => {
    if (!selectedItem) return;

    setLoading(true);

    try {
      const expenseId = selectedItem._id;
      await axios.put(`${baseUrl}/api/admin/expenses/${expenseId}`, {
        status: "paid"
      }, {
        headers: {
          Authentication: token
        }
      });

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

  const handleDelete = async (expenseId) => {
    setLoading(true);
    try {
      await axios.delete(`${baseUrl}/api/admin/expenses/${expenseId}`, {
        headers: {
          Authentication: token
        }
      });
      setData(prevData => prevData.filter(item => item._id !== expenseId));
    } catch (error) {
      console.error('Error deleting expense:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSave = async () => {
    if (!editExpense) return;

    setLoading(true);

    try {
      const expenseId = editExpense._id;
      await axios.put(`${baseUrl}/api/admin/expenses/${expenseId}`, editExpense, {
        headers: {
          Authentication: token
        }
      });

      setData((prevData) =>
        prevData.map((item) =>
          item._id === editExpense._id ? editExpense : item
        )
      );
      handleEditSidebarClose();
    } catch (error) {
      console.error('Error updating expense:', error);
    } finally {
      setLoading(false);
    }
  };

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
          {filteredData.map((item, index) => (
            <ExpenseRow
              key={item._id}
              item={item}
              index={index}
              handlePayClick={handlePayClick}
              handleDelete={handleDelete}
              handleEditSidebarOpen={handleEditSidebarOpen}
            />
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

      <Sidebar
        isOpen={isEditSidebarOpen}
        title="Edit Expense"
        onClose={handleEditSidebarClose}
        width="1/3"
      >
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h2 className="text-xl font-semibold">Edit Expense</h2>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason
            </label>
            <input
              type="text"
              value={editExpense?.reason || ''}
              onChange={(e) => setEditExpense({ ...editExpense, reason: e.target.value })}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              value={editExpense?.amount || ''}
              onChange={(e) => setEditExpense({ ...editExpense, amount: e.target.value })}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={editExpense?.date ? new Date(editExpense.date).toISOString().split('T')[0] : ''}
              onChange={(e) => setEditExpense({ ...editExpense, date: e.target.value })}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <button
            onClick={handleEditSave}
            disabled={loading}
            className={`w-full flex justify-center border border-transparent shadow-sm text-sm font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600 ${loading ? 'bg-gray-400' : ''}`}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </Sidebar>
    </div>
  );
};

const ExpenseRow = ({ item, index, handlePayClick, handleDelete, handleEditSidebarOpen }) => {
  const [openDropdown, setOpenDropdown] = useState(false);

  const handleDropdownToggle = () => {
    setOpenDropdown(!openDropdown);
  };

  const handleDropdownClose = () => {
    setOpenDropdown(false);
  };

  return (
    <tr key={item._id} className="bg-white">
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
      <td className="px-5 py-2 border-b border-gray-200 flex items-center justify-between relative">
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
        <button
          onClick={handleDropdownToggle}
          className="text-gray-500 hover:text-gray-700 transition duration-300"
        >
          &#x22EE;
        </button>
        {openDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            <button
              onClick={() => {
                handleEditSidebarOpen(item);
                handleDropdownClose();
              }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-300"
            >
              Edit
            </button>
            <button
              onClick={() => {
                handleDelete(item._id);
                handleDropdownClose();
              }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-300"
            >
              Delete
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};

export default React.memo(OtherExpenses);
