import React, { useState, useEffect, useCallback } from "react";
import { Input } from "antd";
import { useDispatch } from "react-redux";
import {
  addCategoryThunk,
  updateCategoryThunk,
  deleteCategoryThunk,
} from "../../../../Store/Slices/Admin/Library/LibraryThunks";
import { useTranslation } from "react-i18next";
import { FiTrash2, FiLoader, FiTag, FiAlignLeft } from "react-icons/fi";
import DeleteModal from "../../../../Components/Common/DeleteModal";

const CategorySidebar = ({
  isOpen,
  onClose,
  loading,
  categoryToEdit, // If provided, we're editing this category
}) => {
  const { t } = useTranslation("admLibrary");
  const dispatch = useDispatch();

  // Form data for name/description
  const [formData, setFormData] = useState({ name: "", description: "" });

  // Local state for delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Load category data if in edit mode
  useEffect(() => {
    if (categoryToEdit) {
      setFormData({
        name: categoryToEdit.name || "",
        description: categoryToEdit.description || "",
      });
    } else {
      setFormData({ name: "", description: "" });
    }
  }, [categoryToEdit]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Keyboard handler to close the sidebar when Escape is pressed
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  // Attach keyboard event listener when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  // Submit logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    if (categoryToEdit) {
      // Update existing category
      dispatch(
        updateCategoryThunk({
          categoryId: categoryToEdit._id,
          categoryData: {
            name: formData.name.trim(),
            description: formData.description.trim(),
          },
        })
      ).then(() => {
        onClose();
      });
    } else {
      // Add new category
      dispatch(
        addCategoryThunk({
          name: formData.name.trim(),
          description: formData.description.trim(),
        })
      ).then(() => {
        onClose();
      });
    }
  };

  // Delete confirmation
  const handleDeleteConfirm = () => {
    dispatch(deleteCategoryThunk(categoryToEdit._id)).then(() => {
      setIsDeleteModalOpen(false);
      onClose();
    });
  };

  const sidebarTitle = categoryToEdit
    ? t("Update Category")
    : t("Add Category");

  return (
    <>
      {/* Sidebar Overlay and Container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("Category Sidebar Modal")}
        tabIndex={-1}
        className={`fixed inset-0 z-50 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Blurred overlay */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
        <div
          className={`absolute right-0 top-0 h-full w-[400px] bg-white shadow-xl transform transition-transform flex flex-col ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center">
            <h2 id="sidebar-title" className="font-bold text-xl">
              {sidebarTitle}
            </h2>
            <div className="flex items-center space-x-2">
              {categoryToEdit && (
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="text-red-600 hover:text-red-800"
                  aria-label={t("Delete Category")}
                >
                  <FiTrash2 size={20} />
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-gray-800"
                aria-label={t("Close Sidebar")}
              >
                X
              </button>
            </div>
          </div>

          {/* Form */}
          <form
            role="form"
            className="p-4 flex flex-col h-full"
            onSubmit={handleSubmit}
          >
            <div className="p-4 flex-1 overflow-auto space-y-4">
              <div>
                <label
                  htmlFor="categoryName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <FiTag className="inline mr-1" />
                  {t("Name")}
                </label>
                <Input
                  id="categoryName"
                  name="name"
                  placeholder={t("Enter category name")}
                  value={formData.name}
                  onChange={handleChange}
                  size="large"
                  aria-required="true"
                />
              </div>
              <div>
                <label
                  htmlFor="categoryDescription"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <FiAlignLeft className="inline mr-1" />
                  {t("Description")}
                </label>
                <Input.TextArea
                  id="categoryDescription"
                  name="description"
                  placeholder={t("Enter description (optional)")}
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  size="large"
                />
              </div>
            </div>

            {/* Sticky bottom button */}
            <div className="sticky bottom-0 w-full bg-white p-4 border-t">
              <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                className={`w-full p-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full text-base hover:from-pink-600 hover:to-purple-600 transition ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading && (
                  <FiLoader className="animate-spin inline-block mr-2" />
                )}
                {categoryToEdit ? t("Update Category") : t("Add Category")}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {isDeleteModalOpen && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          title={categoryToEdit ? categoryToEdit.name : t("Delete Category")}
          description={t(
            'Are you sure you want to delete the category "%s"? This action cannot be undone.',
            categoryToEdit ? categoryToEdit.name : ""
          )}
          icon={<FiTrash2 size={24} className="text-red-600" />}
        />
      )}
    </>
  );
};

export default CategorySidebar;
