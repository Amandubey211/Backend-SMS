// src/Modules/Admin/Finance/Expense/AddExpense/Components/Header.jsx

import React, { useState } from "react";
import { Button, Spin, Modal, Input } from "antd"; // Added Modal & Input
import { ArrowsAltOutlined } from "@ant-design/icons"; // Maximize icon
import DropdownCard from "./DropdownCard";
import { useSelector } from "react-redux";
import { subCategories, categories } from "../../Config/categories";

const Header = ({
  onCategoryChange,
  onSubCategoryChange,
  onReset,
  description,
  setDescription, // Now uses Formik's setFieldValue
  initialCategory = "Salaries and Wages",
  initialSubCategory = "Teaching Staffs",
  isUpdate = false,
}) => {
  const { readOnly, loading } = useSelector((state) => state.admin.expenses);

  // Determine if subcategory dropdown should be displayed
  const shouldShowSubCategory =
    subCategories[initialCategory] && subCategories[initialCategory].length > 1;

  // Manage dropdown open states
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSubCategoryDropdownOpen, setIsSubCategoryDropdownOpen] =
    useState(false);

  // Modal state for expanded description
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalDesc, setModalDesc] = useState(description);

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

  // Handle opening the modal
  const handleMaximize = () => {
    setModalDesc(description); // Initialize modal description with current state
    setIsModalVisible(true);
  };

  // Handle closing and saving changes from the modal
  const handleModalOk = () => {
    // If word limit is enforced, do it here as well:
    const words = modalDesc.split(/\s+/).filter((w) => w.length > 0);
    if (words.length <= 100) {
      setDescription(modalDesc);
    }
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
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
            {/* Reset Button */}
            <Button
              type="default"
              onClick={onReset}
              className="border border-pink-500 text-black bg-white text-sm font-medium px-6 py-2 rounded-md shadow-md hover:bg-pink-50 hover:text-black transition"
              disabled={loading} // Disable Reset when loading
            >
              Reset
            </Button>

            {/* Save/Update Button */}
            <Button
              type="primary"
              htmlType="submit"
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-medium px-6 py-2 rounded-md shadow-md hover:from-pink-600 hover:to-purple-600 transition"
              disabled={loading} // Disable Save/Update when loading
            >
              {/* Show spinner if loading */}
              {loading && <Spin size="small" className="mr-2" />}
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
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="description"
              className="text-sm text-gray-900 block"
            >
              Add Description
            </label>
            {!readOnly && (
              <Button
                type="text"
                size="small"
                onClick={handleMaximize}
                icon={<ArrowsAltOutlined />}
                className="p-0 text-gray-500 hover:text-gray-800"
              />
            )}
          </div>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => {
              const desc = e.target.value;
              const words = desc.split(/\s+/).filter((word) => word.length > 0);
              if (words.length <= 100) setDescription(desc);
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

      {/* Modal for expanded description */}
      <Modal
        title="Add Description"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Save"
        cancelText="Cancel"
        destroyOnClose
      >
        <Input.TextArea
          rows={6}
          value={modalDesc}
          onChange={(e) => setModalDesc(e.target.value)}
          placeholder="Write a detailed description..."
        />
        <div className="text-right text-xs text-gray-500 italic mt-1">
          {`Words left: ${
            100 -
            modalDesc.split(/\s+/).filter((word) => word.length > 0).length
          }`}
        </div>
      </Modal>
    </div>
  );
};

export default Header;
