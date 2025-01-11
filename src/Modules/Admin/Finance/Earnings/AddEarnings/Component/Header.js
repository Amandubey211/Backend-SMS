import React, { useState, useEffect } from "react";
import DropdownCard from "./DropdownCard";
import { categories, subCategories } from "../constants/categories";
import { useSelector } from "react-redux";
import { Spin, Modal, Input, Button as AntButton } from "antd"; // <-- Added Modal, Input, and re-aliasing Button
import { ArrowsAltOutlined } from "@ant-design/icons"; // Maximize icon

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
  const { readOnly, loading } = useSelector((state) => state.admin.earnings);

  // For the expanded description modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalDesc, setModalDesc] = useState(description);

  const filteredCategories = categories.filter(
    (cat) => cat !== "Student-Based Revenue"
  );

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
    const firstSubCategory = subCategories[selectedCategory]?.[0];
    setSubCategory(firstSubCategory);
    onSubCategoryChange(firstSubCategory);
  };

  const handleSubCategorySelect = (selectedSubCategory) => {
    if (readOnly) return;
    setSubCategory(selectedSubCategory);
    onSubCategoryChange(selectedSubCategory);
    setIsSubCategoryOpen(false);
  };

  // Open the modal to expand description
  const handleMaximize = () => {
    setModalDesc(description); // Load the current description into modal state
    setIsModalVisible(true);
  };

  // Handle modal "Ok": save changes if under 100 words
  const handleModalOk = () => {
    const words = modalDesc.split(/\s+/).filter((word) => word.length > 0);
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
          {isUpdate ? "Update Earnings" : "Add New Earnings"}
        </h1>
        {!readOnly && ( // Hide buttons if readOnly is true
          <div className="flex gap-4">
            {/* Reset Button */}
            {!isUpdate && ( // Show Reset button only when not in update mode
              <button
                type="button" // Prevent form submission
                onClick={onReset}
                disabled={loading} // Disable when loading
                className="border border-pink-500 text-black bg-white text-sm font-medium px-6 py-2 rounded-md shadow-md hover:bg-pink-50 hover:text-black transition"
              >
                Reset
              </button>
            )}

            {/* Submit Button (Save or Update) */}
            <button
              type="submit" // Formik will handle the submit
              disabled={loading} // Disable when loading
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-medium px-6 py-2 rounded-md shadow-md hover:from-pink-600 hover:to-purple-600 transition"
            >
              {/* Show spinner if loading */}
              {loading && <Spin size="small" className="mr-2" />}
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
          options={filteredCategories}
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
          options={subCategories[category] || []}
          isOpen={isSubCategoryOpen}
          onToggle={() => setIsSubCategoryOpen(!isSubCategoryOpen)}
          onSelect={handleSubCategorySelect}
          bgColor="bg-purple-50"
          borderColor="border-purple-300"
          disabled={readOnly} // Disable dropdown if readOnly
        />
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
              <AntButton
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
              const words = e.target.value
                .split(/\s+/)
                .filter((word) => word.length > 0);
              if (words.length <= 100) setDescription(e.target.value); // Limit to 100 words
            }}
            className="bg-gray-50 rounded-lg p-2 text-sm text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-sm"
            placeholder="Write a short description"
            readOnly={readOnly} // Make textarea read-only if readOnly is true
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
