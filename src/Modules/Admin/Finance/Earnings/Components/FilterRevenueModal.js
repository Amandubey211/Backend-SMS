import React from "react";
import {FilterOutlined} from '@ant-design/icons';
const FilterRevenueModal = ({ visible, onClose }) => {
  if (!visible) return null;

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
            <span className="material-icons"><FilterOutlined /></span> Filter
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
          {/* Category Section */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800">Category</h4>
            <div className="flex flex-wrap gap-2">
              {[
                "Tuition fees",
                "Hostel fees",
                "Stationery fees",
                "Book fees",
                "Transport fees",
                "Other fees",
              ].map((category) => (
                <button
                  key={category}
                  className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-200 transition"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Date Section */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800">Date</h4>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-[#C83B62] focus:outline-none"
              placeholder="Filter by date"
            />
          </div>

          {/* Buttons Section */}
          <div className="flex justify-between items-center">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#C83B62] text-[#C83B62] font-medium rounded-lg hover:bg-red-100 transition"
            >
              Clear All
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gradient-to-r from-[#C83B62] to-[#8E44AD] text-white font-bold rounded-lg hover:opacity-90 transition"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterRevenueModal;
