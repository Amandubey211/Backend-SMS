// src/Modules/Admin/Finance/StudentFees/Components/AddNewFeeSidebar.js
import React, { useState } from "react";

const AddNewFeeSidebar = ({ visible, onClose }) => {
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    date: "",
  });

  if (!visible) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    console.log("New Fee Data:", formData);
    onClose(); // Close sidebar after submitting
  };

  return (
    <div
      className="fixed top-0 bottom-0 right-0 w-[400px] bg-white shadow-lg z-50 p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <h3 className="text-lg font-medium text-gray-700 mb-4">Add New Fee</h3>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">Category</label>
          <input
            type="text"
            name="category"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none"
            placeholder="Enter fee category"
            value={formData.category}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Amount</label>
          <input
            type="number"
            name="amount"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none"
            placeholder="Enter amount"
            value={formData.amount}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Date</label>
          <input
            type="date"
            name="date"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none"
            value={formData.date}
            onChange={handleChange}
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-md"
            onClick={handleSubmit}
          >
            Add Fee
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewFeeSidebar;
