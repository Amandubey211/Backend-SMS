// src/Modules/Admin/Finance/StudentFees/Components/SortStudentFeesModal.js
import React from "react";

const SortStudentFeesModal = ({ visible, onClose, onSortChange }) => {
  if (!visible) return null;

  const handleSortSelection = (event) => {
    onSortChange(event.target.value);
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Sort Fees</h3>
        <div className="space-y-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="sort"
              value="amount"
              onChange={handleSortSelection}
            />
            <span>By Amount</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="sort"
              value="date"
              onChange={handleSortSelection}
            />
            <span>By Date</span>
          </label>
        </div>
        <div className="flex justify-end mt-6">
          <button
            type="button"
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-md"
            onClick={onClose}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default SortStudentFeesModal;
