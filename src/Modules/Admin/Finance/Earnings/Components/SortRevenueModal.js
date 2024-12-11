import React from "react";
import PropTypes from "prop-types";
import {SortAscendingOutlined} from '@ant-design/icons';

const SortRevenueModal = ({ visible, onClose, onSortChange }) => {
  if (!visible) return null;

  const handleSortSelection = (event) => {
    onSortChange(event.target.value);
  };

  return (
    <div
      className="fixed -top-6 bottom-0 left-0 right-0 bg-black bg-opacity-70 flex items-center justify-center z-[1000]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose(); // Close modal on backdrop click
      }}
    >
      <div className="bg-white rounded-lg w-[400px] shadow-lg overflow-hidden">
        {/* Top Red Strip */}
        <div className="bg-[#C83B62] h-10 flex items-center justify-between px-4">
          <h3 className="text-white font-bold flex items-center gap-2">
            <span className="material-icons"><SortAscendingOutlined /></span> Sort
          </h3>
          <button
            className="text-white hover:opacity-80 focus:outline-none"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-6">
          {/* Sorting Options */}
          <div className="space-y-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="sort"
                value="newest"
                onChange={handleSortSelection}
                className="text-purple-600"
              />
              <span className="text-gray-800 font-medium">Newest to oldest</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="sort"
                value="oldest"
                onChange={handleSortSelection}
                className="text-purple-600"
              />
              <span className="text-gray-800 font-medium">Oldest to newest</span>
            </label>
          </div>

          {/* Apply Button */}
          <button
            className="w-full px-4 py-2 bg-gradient-to-r from-[#C83B62] to-[#8E44AD] text-white font-bold rounded-lg hover:opacity-90 transition"
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
