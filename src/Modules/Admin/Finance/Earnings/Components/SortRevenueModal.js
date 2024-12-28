

import React, { useState } from "react";
import { FilterOutlined } from "@ant-design/icons";
import { Select, Button } from "antd";

const { Option } = Select;

const SortRevenueModal = ({ visible, onClose, onSortChange }) => {
  const [sortField, setSortField] = useState("earnedDate");
  const [sortOrder, setSortOrder] = useState("desc");

  if (!visible) return null;

  const handleApply = () => {
    onSortChange({ sortBy: sortField, sortOrder });
    onClose();
  };

  const handleClear = () => {
    setSortField("earnedDate");
    setSortOrder("desc");
    onSortChange({ sortBy: "earnedDate", sortOrder: "desc" });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[1000]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-lg w-[400px] shadow-lg overflow-hidden">
        {/* Top Purple Strip */}
        <div className="bg-[#8E44AD] h-10 flex items-center justify-between px-4">
          <h3 className="text-white font-bold flex items-center gap-2">
            <FilterOutlined />
            Sort
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
          {/* Sort Field Selection */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800">Sort By</h4>
            <Select
              value={sortField}
              onChange={setSortField}
              className="w-full"
            >
              <Option value="category">Category</Option>
              <Option value="from">From</Option>
              <Option value="final_amount">Final Amount</Option>
              <Option value="paid_amount">Paid Amount</Option>
              <Option value="earnedDate">Earned Date</Option>
            </Select>
          </div>

          {/* Sort Order Selection */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800">Order</h4>
            <Select
              value={sortOrder}
              onChange={setSortOrder}
              className="w-full"
            >
              <Option value="asc">Ascending</Option>
              <Option value="desc">Descending</Option>
            </Select>
          </div>

          {/* Buttons Section */}
          <div className="flex justify-between items-center">
            <Button
              onClick={handleClear}
              className="px-4 py-2 border border-[#8E44AD] text-[#8E44AD] font-medium rounded-lg hover:bg-purple-100 transition"
            >
              Clear
            </Button>
            <Button
              onClick={handleApply}
              type="primary"
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:opacity-90 transition"
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortRevenueModal;
