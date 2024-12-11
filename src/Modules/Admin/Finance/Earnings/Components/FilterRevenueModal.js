import React from "react";

const FilterRevenueModal = ({ visible, onClose }) => {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-[400px] space-y-4">
        <h3 className="text-lg font-bold">Filter</h3>
        <div className="space-y-2">
          <h4 className="font-medium">Category</h4>
          <div className="flex flex-wrap gap-2">
            {["Tuition fees", "Hostel fees", "Stationery fees", "Book fees", "Transport fees", "Other fees"].map(
              (category) => (
                <button key={category} className="bg-gray-100 rounded-full px-4 py-2">{category}</button>
              )
            )}
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium">Date</h4>
          <input
            type="date"
            className="w-full border rounded-md p-2"
          />
        </div>
        <div className="flex justify-between">
          <button onClick={onClose} className="text-red-500 font-medium">Clear All</button>
          <button onClick={onClose} className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-md">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterRevenueModal;
