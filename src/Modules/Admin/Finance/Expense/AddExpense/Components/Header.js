// src/Modules/Admin/Finance/Expense/AddExpense/Components/Header.jsx

import React, { useState } from "react";
import { Button } from "antd";
import DropdownCard from "./DropdownCard";
import { useSelector } from "react-redux";
import { subCategories, categories } from "../../Config/categories";

const Header = ({
  onCategoryChange,
  onSubCategoryChange,
  onReset,
  description,
  setDescription,
  initialCategory = "Salaries and Wages",
  initialSubCategory = "Teaching Staffs",
  isUpdate = false,
}) => {
  const readOnly = useSelector((state) => state.admin.expenses.readOnly);

  // Determine if subcategory dropdown should be displayed
  const shouldShowSubCategory =
    subCategories[initialCategory] && subCategories[initialCategory].length > 1;

  // Manage dropdown open states
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSubCategoryDropdownOpen, setIsSubCategoryDropdownOpen] =
    useState(false);

  // Toggle functions
  const toggleCategoryDropdown = () => {
    setIsCategoryDropdownOpen((prev) => !prev);
    if (shouldShowSubCategory) {
      setIsSubCategoryDropdownOpen(false); // Close subcategory dropdown when category is toggled
    }
  };

  const toggleSubCategoryDropdown = () => {
    setIsSubCategoryDropdownOpen((prev) => !prev);
  };

  return (
    <div className="bg-white py-3 px-5">
      {/* Header Title and Buttons */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isUpdate ? "Update Expense" : "Add New Expense"}
        </h1>
        {!readOnly && (
          <div className="flex gap-4">
            <Button
              type="primary"
              htmlType="submit"
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-medium px-6 py-2 rounded-md shadow-md hover:from-pink-600 hover:to-purple-600 transition"
            >
              {isUpdate ? "Update Expense" : "Save Expense"}
            </Button>
          </div>
        )}
      </div>

      {/* Dropdown Section */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Category Selector */}
        <DropdownCard
          label="Category"
          name="category"
          id="category-dropdown"
          value={initialCategory}
          options={categories}
          isOpen={isCategoryDropdownOpen}
          onToggle={toggleCategoryDropdown}
          onSelect={(selectedCategory) => {
            onCategoryChange(selectedCategory);
            setIsCategoryDropdownOpen(false); // Close dropdown after selection
          }}
          bgColor="bg-red-50"
          borderColor="border-red-300"
          disabled={readOnly}
        />

        {/* SubCategory Selector (Conditional) */}
        {shouldShowSubCategory && (
          <DropdownCard
            label="Sub-category"
            name="subCategory"
            id="subcategory-dropdown"
            value={initialSubCategory}
            options={subCategories[initialCategory]}
            isOpen={isSubCategoryDropdownOpen}
            onToggle={toggleSubCategoryDropdown}
            onSelect={(selectedSubCategory) => {
              onSubCategoryChange(selectedSubCategory);
              setIsSubCategoryDropdownOpen(false); // Close dropdown after selection
            }}
            bgColor="bg-purple-50"
            borderColor="border-purple-300"
            disabled={readOnly}
          />
        )}

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
            onChange={(e) => {
              const words = e.target.value
                .split(/\s+/)
                .filter((word) => word.length > 0);
              if (words.length <= 100) setDescription(e.target.value);
            }}
            className="bg-gray-50 z-40 rounded-lg p-2 text-sm text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-sm"
            placeholder="Write a short description"
            readOnly={readOnly}
          ></textarea>
          <div className="flex justify-end items-center my-3">
            <span className="text-xs text-gray-500 italic">
              {`You can write up to 100 words (${
                100 -
                description.split(/\s+/).filter((word) => word.length > 0)
                  .length
              } words left)`}
            </span>
          </div>
        </div>
      </div>
      <div className="border-b border-gray-300 mt-6"></div>
    </div>
  );
};

export default Header;
