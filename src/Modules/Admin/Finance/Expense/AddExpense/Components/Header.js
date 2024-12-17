import React, { useState } from "react";
import DropdownCard from "./DropdownCard";

const Header = ({
  onReset,
  onSave,
  onCategoryChange,
  onSubCategoryChange,
  description,
  setDescription,
}) => {
  const [category, setCategory] = useState("Maintenance");
  const [subCategory, setSubCategory] = useState("Salaries and Wages");

  const categories = [
    "Maintenance",
    "Utility Expenses",
    "Event Expenses",
    "Library Expenses",
    "Canteen",
    "Others",
  ];

  const subCategories = {
    Maintenance: [
      "Building Repairs",
      "Furniture Maintenance",
      "IT Equipment Maintenance",
      "Others",
    ],
    "Utility Expenses": ["Electricity", "Water", "Internet", "Others"],
    "Event Expenses": [
      "Event Planning",
      "Decoration",
      "Refreshments",
      "Others",
    ],
    "Library Expenses": ["Stationery", "Book Repairs", "Others"],
    Canteen: ["Classroom & Office purpose", "Others"],
    Others: ["Others"],
  };

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSubCategoryOpen, setIsSubCategoryOpen] = useState(false);

  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
    if (typeof onCategoryChange === "function") {
      onCategoryChange(selectedCategory);
    }
    setIsCategoryOpen(false);

    const firstSubCategory = subCategories[selectedCategory][0];
    setSubCategory(firstSubCategory);
    if (typeof onSubCategoryChange === "function") {
      onSubCategoryChange(firstSubCategory);
    }
  };

  const handleSubCategorySelect = (selectedSubCategory) => {
    setSubCategory(selectedSubCategory);
    if (typeof onSubCategoryChange === "function") {
      onSubCategoryChange(selectedSubCategory);
    }
    setIsSubCategoryOpen(false);
  };

  return (
    <div className="bg-white py-3 px-5">
      {/* Header Title and Buttons */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Add new expense</h1>
        <div className="flex gap-4">
          <button
            onClick={onReset}
            className="bg-gray-100 text-gray-700 text-sm font-medium px-6 py-2 rounded-md border border-gray-300 hover:bg-gray-200 transition"
          >
            Reset
          </button>
          <button
            onClick={onSave}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-medium px-6 py-2 rounded-md shadow-md hover:from-pink-600 hover:to-purple-600 transition"
          >
            Save expense
          </button>
        </div>
      </div>

      {/* Dropdown Section */}
      <div className="flex gap-6">
        <DropdownCard
          label="Category"
          value={category}
          options={categories}
          isOpen={isCategoryOpen}
          onToggle={() => setIsCategoryOpen(!isCategoryOpen)}
          onSelect={handleCategorySelect}
          bgColor="bg-red-50"
          borderColor="border-red-300"
        />

        <DropdownCard
          label="Sub-category"
          value={subCategory}
          options={subCategories[category]}
          isOpen={isSubCategoryOpen}
          onToggle={() => setIsSubCategoryOpen(!isSubCategoryOpen)}
          onSelect={handleSubCategorySelect}
          bgColor="bg-purple-50"
          borderColor="border-purple-300"
        />

        {/* Description Box */}
        <div className="relative w-full bg-gray-100 border border-gray-300 rounded-lg p-4 h-28">
          <label className="text-sm text-gray-900 block mb-2">
            Add description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={100}
            className="bg-gray-50 rounded-lg p-2 text-sm text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-sm"
            placeholder="Write a short description"
          ></textarea>
          <div className="flex justify-end items-center my-3">
            <span className="text-xs text-gray-500 italic">
              You can write 100 characters
            </span>
          </div>
        </div>
      </div>
      <div className="border-b border-gray-300 mt-6"></div>
    </div>
  );
};

export default Header;
