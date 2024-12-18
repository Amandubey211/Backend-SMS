import React, { useState, useEffect } from "react";
import { FilterOutlined } from "@ant-design/icons";
import { Button, Tag, DatePicker, Select } from "antd";
import {
  categories,
  subCategories,
  academicYears,
} from "../AddEarnings/constants/categories"; // Ensure academicYears is imported

const { RangePicker } = DatePicker;
const { Option } = Select;

const FilterRevenueModal = ({ visible, onClose, onFilterApply }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState([]);
  const [paymentType, setPaymentType] = useState("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");

  useEffect(() => {
    if (selectedCategory) {
      setFilteredSubCategories(subCategories[selectedCategory] || []);
      setSelectedSubCategories([]); // Reset subcategories when category changes
    }
  }, [selectedCategory]);

  if (!visible) return null;

  const handleApply = () => {
    onFilterApply({
      category: selectedCategory,
      subCategories: selectedSubCategories,
      dateRange: selectedDateRange,
      paymentType,
      academicYear: selectedAcademicYear,
    });
    onClose();
  };

  const handleClear = () => {
    setSelectedCategory("");
    setSelectedSubCategories([]);
    setSelectedDateRange([]);
    setPaymentType("");
    setSelectedAcademicYear("");
    onFilterApply({});
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-lg w-full max-w-2xl shadow-lg overflow-y-auto max-h-screen p-4">
        {/* Header */}
        <div className="bg-[#C83B62] h-14 flex items-center justify-between px-5">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <FilterOutlined /> Filter
          </h3>
          <button
            className="text-white text-2xl hover:opacity-80 focus:outline-none"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Category Section */}
          <div>
            <h4 className="text-gray-800 font-semibold mb-2">Category</h4>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <Button
                  key={category}
                  type={selectedCategory === category ? "primary" : "default"}
                  className={`rounded-3xl px-4 ${
                    selectedCategory === category
                      ? "bg-[#C83B62] text-white border-none"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Sub-Category Section */}
          {filteredSubCategories.length > 0 && (
            <div>
              <h4 className="text-gray-800 font-semibold mb-2">Sub-Category</h4>
              <div className="flex flex-wrap gap-2">
                {filteredSubCategories.map((subCat) => (
                  <Tag.CheckableTag
                    key={subCat}
                    checked={selectedSubCategories.includes(subCat)}
                    onChange={(checked) =>
                      setSelectedSubCategories((prev) =>
                        checked
                          ? [...prev, subCat]
                          : prev.filter((item) => item !== subCat)
                      )
                    }
                    className="rounded-full border px-4 py-1 cursor-pointer"
                    style={{
                      background: selectedSubCategories.includes(subCat)
                        ? "#C83B62"
                        : "#F3F4F6",
                      color: selectedSubCategories.includes(subCat)
                        ? "white"
                        : "black",
                      borderColor: "transparent",
                    }}
                  >
                    {subCat}
                  </Tag.CheckableTag>
                ))}
              </div>
            </div>
          )}

          {/* Payment Type and Academic Year Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Payment Type Section */}
            <div>
              <h4 className="text-gray-800 font-semibold mb-2">Payment Type</h4>
              <Select
                placeholder="Select Payment Type"
                value={paymentType || undefined}
                onChange={(value) => setPaymentType(value)}
                className="w-full"
                allowClear
              >
                <Option value="cash">Cash</Option>
                <Option value="credit">Credit</Option>
                <Option value="online">Online</Option>
              </Select>
            </div>

            {/* Academic Year Section */}
            <div>
              <h4 className="text-gray-800 font-semibold mb-2">
                Academic Year
              </h4>
              <Select
                placeholder="Select Academic Year"
                value={selectedAcademicYear || undefined}
                onChange={(value) => setSelectedAcademicYear(value)}
                className="w-full"
                allowClear
              >
                {academicYears.map((year) => (
                  <Option key={year.value} value={year.value}>
                    {year.label}
                  </Option>
                ))}
              </Select>
            </div>
          </div>

          {/* Date Range Section */}
          <div>
            <h4 className="text-gray-800 font-semibold mb-2">Date Range</h4>
            <RangePicker
              value={selectedDateRange}
              onChange={setSelectedDateRange}
              className="w-full"
              placeholder={["Start Date", "End Date"]}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center pt-2">
            <Button
              onClick={handleClear}
              className="border border-[#C83B62] text-[#C83B62] rounded-md px-4 py-2 text-xs"
            >
              Clear All
            </Button>
            <Button
              type="primary"
              className="bg-gradient-to-r from-[#C83B62] to-[#8E44AD] text-white rounded-md px-6 py-2 text-xs"
              onClick={handleApply}
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterRevenueModal;
