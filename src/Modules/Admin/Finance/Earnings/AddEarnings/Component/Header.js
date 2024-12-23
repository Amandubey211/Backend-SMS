// src/Components/Admin/Finance/Earnings/Component/Header.jsx

import React, { useState, useEffect } from "react";
import DropdownCard from "./DropdownCard";
import { categories, subCategories } from "../constants/categories";
import { useSelector } from "react-redux";

const Header = ({
  onReset,
  onCategoryChange,
  onSubCategoryChange,
  description,
  setDescription,
  initialCategory = "Facility-Based Revenue",
  initialSubCategory = "Rent Income",
  isUpdate = false,
}) => {
  const [category, setCategory] = useState(initialCategory);
  const [subCategory, setSubCategory] = useState(initialSubCategory);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSubCategoryOpen, setIsSubCategoryOpen] = useState(false);
  const readOnly = useSelector((state) => state.admin.earnings.readOnly);

  useEffect(() => {
    // Sync initial state if props change
    setCategory(initialCategory);
    setSubCategory(initialSubCategory);
  }, [initialCategory, initialSubCategory]);

  const handleCategorySelect = (selectedCategory) => {
    if (readOnly) return;
    setCategory(selectedCategory);
    onCategoryChange(selectedCategory);
    setIsCategoryOpen(false);

    // Automatically select the first subcategory
    const firstSubCategory = subCategories[selectedCategory][0];
    setSubCategory(firstSubCategory);
    onSubCategoryChange(firstSubCategory);
  };

  const handleSubCategorySelect = (selectedSubCategory) => {
    if (readOnly) return;
    setSubCategory(selectedSubCategory);
    onSubCategoryChange(selectedSubCategory);
    setIsSubCategoryOpen(false);
  };

  return (
    <div className="bg-white py-3 px-5">
      {/* Header Title and Buttons */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isUpdate ? "Update Earnings" : "Add New Earnings"}
        </h1>
        {!readOnly && ( // Hide buttons if readOnly is true
          <div className="flex gap-4">
            {/* Submit Button (Save or Update) */}
            <button
              type="submit" // Formik will handle the submit
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-medium px-6 py-2 rounded-md shadow-md hover:from-pink-600 hover:to-purple-600 transition"
            >
              {isUpdate ? "Update Earnings" : "Save Earnings"}
            </button>
          </div>
        )}
      </div>

      {/* Dropdown Section */}
      <div className="flex flex-col md:flex-row gap-6">
        <DropdownCard
          label="Category"
          name="category"
          id="category-dropdown" // Unique ID
          value={category}
          options={categories}
          isOpen={isCategoryOpen}
          onToggle={() => setIsCategoryOpen(!isCategoryOpen)}
          onSelect={handleCategorySelect}
          bgColor="bg-red-50"
          borderColor="border-red-300"
          disabled={readOnly} // Disable dropdown if readOnly
        />

        <DropdownCard
          label="Sub-category"
          name="subCategory"
          id="subcategory-dropdown" // Unique ID
          value={subCategory}
          options={subCategories[category]}
          isOpen={isSubCategoryOpen}
          onToggle={() => setIsSubCategoryOpen(!isSubCategoryOpen)}
          onSelect={handleSubCategorySelect}
          bgColor="bg-purple-50"
          borderColor="border-purple-300"
          disabled={readOnly} // Disable dropdown if readOnly
        />

        {/* Description Box */}
        <div className="relative w-full bg-gray-100 border border-gray-300 rounded-lg p-4 h-28">
          <label
            htmlFor="description"
            className="text-sm text-gray-900 block mb-2"
          >
            Add Description
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={100}
            className="bg-gray-50 rounded-lg p-2 text-sm text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-sm"
            placeholder="Write a short description"
            readOnly={readOnly} // Make textarea read-only if readOnly is true
          ></textarea>
          <div className="flex justify-end items-center my-3">
            <span className="text-xs text-gray-500 italic">
              You can write up to 100 characters
            </span>
          </div>
        </div>
      </div>
      <div className="border-b border-gray-300 mt-6"></div>
    </div>
  );
};

export default Header;
