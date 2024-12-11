import React from "react";
import PropTypes from "prop-types";

const SortRevenueModal = ({ visible, onClose, onSortChange }) => {
  if (!visible) return null;

  const handleSortSelection = (event) => {
    onSortChange(event.target.value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white w-96 rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-800">Sort</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Sorting Options */}
        <div className="space-y-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="sort"
              value="newest"
              onChange={handleSortSelection}
              className="form-radio text-purple-500"
            />
            <span>Newest to oldest</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="sort"
              value="oldest"
              onChange={handleSortSelection}
              className="form-radio text-purple-500"
            />
            <span>Oldest to newest</span>
          </label>
        </div>

        {/* Apply Button */}
        <div className="mt-6 text-right">
          <button
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-md hover:shadow-lg transition duration-200"
            onClick={onClose}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

SortRevenueModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
};

export default SortRevenueModal;
