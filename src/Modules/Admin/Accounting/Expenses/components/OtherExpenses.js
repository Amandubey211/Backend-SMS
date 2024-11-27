import React, { useState, useEffect, useRef, useMemo } from "react";
import Sidebar from "../../../../../Components/Common/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { deleteExpenseById, fetchSalaries, updateExpense } from "../../../../../Store/Slices/Admin/Accounting/Expenses/expenses.action";
import toast from "react-hot-toast";
import NoDataFound from "../../../../../Components/Common/NoDataFound";
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

const OtherExpenses = ({ selectedOption, selectedMonth }) => {
  const { t } = useTranslation('admExpense'); // Initialize useTranslation hook
  const { otherExpenses, loading } = useSelector((store) => store?.admin?.expenses)
  const dispatch = useDispatch();

  const [selectedItem, setSelectedItem] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

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
    dispatch(fetchSalaries({ query: selectedOption, activeTab: "OtherExpenses", month: selectedMonth }))
  }, [dispatch, selectedMonth, selectedOption]);

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
    const expenseId = selectedItem._id;
    dispatch(updateExpense({ expenseId, editExpense: { status: "paid" } })).then(() => {
      dispatch(fetchSalaries({ query: selectedOption, activeTab: "OtherExpenses", month: selectedMonth }))
      handleSidebarClose();
    })
  };

  const handleDelete = async (expenseId) => {
    dispatch(deleteExpenseById(expenseId)).then(() => {
      dispatch(fetchSalaries({ query: selectedOption, activeTab: "OtherExpenses", month: selectedMonth }))
    })
  };

  const handleEditSave = async () => {
    if (!editExpense) return;
    const expenseId = editExpense._id;
    dispatch(updateExpense({ expenseId, editExpense })).then(() => {
      dispatch(fetchSalaries({ query: selectedOption, activeTab: "OtherExpenses", month: selectedMonth }))
      handleEditSidebarClose();
    })
  };

  return (
    <div>
      <table className="min-w-full leading-normal mt-4 rounded-lg overflow-hidden">
        <thead>
          <tr className="text-left text-gray-700 bg-gray-100">
            <th className="px-5 py-1 border-b-2 border-gray-200">{t('Serial No.')}</th>
            <th className="px-5 py-3 border-b-2 border-gray-200">{t('Expenses Reason')}</th>
            <th className="px-5 py-3 border-b-2 border-gray-200">{t('Amount')}</th>
            <th className="px-5 py-3 border-b-2 border-gray-200">{t('Expense Date')}</th>
            <th className="px-5 py-3 border-b-2 border-gray-200">{t('Status')}</th>
            <th className="px-5 py-3 border-b-2 border-gray-200">{t('Action')}</th>
          </tr>
        </thead>
        <tbody>
          {otherExpenses?.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center px-5 py-5">
                <NoDataFound /> {/* Display NoDataFound when no data */}
              </td>
            </tr>
          ) : (
            otherExpenses?.map((item, index) => (
              <ExpenseRow
                key={item._id}
                item={item}
                index={index}
                handlePayClick={handlePayClick}
                handleDelete={handleDelete}
                handleEditSidebarOpen={handleEditSidebarOpen}
              />
            ))
          )}
        </tbody>
      </table>

      <Sidebar
        isOpen={isSidebarOpen}
        title={t('Pay Expense')}
        onClose={handleSidebarClose}
        width="1/3"
      >
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h2 className="text-xl font-semibold">{t('Pay Expense')}</h2>
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
              {t('Amount')}
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
            {loading ? t('Processing...') : t('Pay Now')}
          </button>
        </div>
      </Sidebar>

      <Sidebar
        isOpen={isEditSidebarOpen}
        title={t('Edit Expense')}
        onClose={handleEditSidebarClose}
        width="1/3"
      >
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h2 className="text-xl font-semibold">{t('Edit Expense')}</h2>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('Reason')}
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
              {t('Amount')}
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
              {t('Date')}
            </label>
            <input
              type="date"
              value={editExpense?.date ? new Date(editExpense.date).toISOString().split('T')[0] : ''}
              onChange={(e) => setEditExpense({ ...editExpense, date: e.target.value })}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('Status')}
            </label>
            <select
              value={editExpense?.status || ''}
              onChange={(e) => setEditExpense({ ...editExpense, status: e.target.value })}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
            >
              <option value="unpaid">{t('Unpaid')}</option>
              <option value="paid">{t('Paid')}</option>
            </select>
          </div>
          <button
            onClick={handleEditSave}
            disabled={loading}
            className={`w-full flex justify-center border border-transparent shadow-sm text-sm font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600 ${loading ? 'bg-gray-400' : ''}`}
          >
            {loading ? t('Saving...') : t('Save')}
          </button>
        </div>
      </Sidebar>
    </div>
  );
};

const capitalizeFirstLetter = (str) => {
  if (!str) return ''; // Handle cases with undefined or empty strings
  const firstLetter = str.charAt(0);
  // Check if the first letter is already uppercase
  if (firstLetter === firstLetter?.toUpperCase()) {
    return str;
  } else {
    return firstLetter?.toUpperCase() + str?.slice(1);
  }
};


const ExpenseRow = ({ item, index, handlePayClick, handleDelete, handleEditSidebarOpen }) => {
  const { t } = useTranslation('admExpense'); // Initialize useTranslation hook
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleDropdownToggle = () => {
    setOpenDropdown(!openDropdown);
  };

  const handleDropdownClose = () => {
    setOpenDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        handleDropdownClose();
      }
    };

    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  return (
    <tr key={item._id} className="bg-white border border-gray-200">
      {/* Dynamic serial number */}
      <td className="px-5 py-2">{index + 1}</td> 

      <td className="px-5 py-2">{item.reason}</td>
      <td className="px-5 py-2">{item.amount} {t('QR')}</td>
      <td className="px-5 py-2">{new Date(item.date).toLocaleDateString()}</td>
      <td className="px-5 py-2">
        <span
          className={`px-3 py-1 text-m font-semibold rounded-full ${item.status === "paid" ? "text-green-800" : "text-red-600"}`}
        >
          {capitalizeFirstLetter(t(item.status))}
        </span>
      </td>
      <td className="px-5 py-2 flex items-center justify-between ">
        {item.status === "paid" ? (
          <span className="inline-flex items-center border border-transparent text-sm font-medium shadow-sm bg-green-200 text-green-800 py-1.5 px-3 rounded-md">
            {t('Completed')}
          </span>
        ) : (
          <button
            className="inline-flex items-center border border-transparent text-sm font-medium shadow-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
            onClick={() => handlePayClick(item)}
          >
            {t('Pay Now')}
          </button>
        )}

        <button
          onClick={handleDropdownToggle}
          className="text-gray-500 hover:text-gray-700 transition duration-300"
        >
          &#x22EE;
        </button>
        {openDropdown && (
          <div ref={dropdownRef} className="absolute right-4 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            <button
              onClick={() => {
                handleEditSidebarOpen(item);
                handleDropdownClose();
              }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-300"
            >
              {t('Edit')}
            </button>
            <button
              onClick={() => {
                handleDelete(item._id);
                handleDropdownClose();
              }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-300"
            >
              {t('Delete')}
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};

export default React.memo(OtherExpenses);
