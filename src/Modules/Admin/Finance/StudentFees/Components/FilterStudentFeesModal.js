// src/Modules/Admin/Finance/StudentFees/Components/FilterStudentFeesModal.js
import React from "react";

const FilterStudentFeesModal = ({ visible, onClose }) => {
  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Filter Fees</h3>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Category</label>
            <select
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none"
            >
              <option value="">All Categories</option>
              <option value="Tuition">Tuition</option>
              <option value="Hostel">Hostel</option>
              <option value="Books">Books</option>
              <option value="Transport">Transport</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Date</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md"
              onClick={onClose}
            >
              Clear
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-md"
              onClick={onClose}
            >
              Apply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FilterStudentFeesModal;
