import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdDelete, MdEdit } from "react-icons/md";
import Sidebar from "../../../../Components/Common/Sidebar";
import DeleteModal from "../../../../Components/Common/DeleteModal";
import CategorySidebar from "./CategorySidebar";
// ^ your existing sidebar that can handle adding/editing categories
import {
  addCategoryThunk,
  deleteCategoryThunk,
  // If you have an "updateCategoryThunk"
  updateCategoryThunk,
} from "../../../../Store/Slices/Admin/Library/LibraryThunks";
import { useTranslation } from "react-i18next";
// If you have a role in redux, for controlling edit/delete
import { PERMISSIONS } from "../../../../config/permission";
import ProtectedAction from "../../../../Routes/ProtectedRoutes/ProtectedAction";

/**
 * Props:
 * - categories (array)
 * - selectedCategory (string or null) => e.g. category._id or null
 * - onCategoryChange(categoryId) => callback when user picks a category bubble
 * - role => user role
 */
const CategoryNavigationBar = ({
  categories,
  selectedCategory,
  onCategoryChange,
  role,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // Local states
  const [hoveredCatId, setHoveredCatId] = useState(null);
  const [sidebarMode, setSidebarMode] = useState(null); // "add" | "edit"
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Toggle for CategorySidebar
  const openAddCategorySidebar = useCallback(() => {
    setSidebarMode("add");
    setEditingCategory(null);
  }, []);
  const openEditCategorySidebar = useCallback((category) => {
    setSidebarMode("edit");
    setEditingCategory(category);
  }, []);
  const closeSidebar = useCallback(() => {
    setSidebarMode(null);
    setEditingCategory(null);
  }, []);

  // Deletion
  const handleDeleteClick = (cat) => {
    setCategoryToDelete(cat);
    setDeleteModalOpen(true);
  };
  const handleDeleteConfirm = async () => {
    if (categoryToDelete) {
      await dispatch(deleteCategoryThunk(categoryToDelete._id));
    }
    setDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  // Decide the classes for a bubble
  const getBubbleClass = (catId) => {
    const isActive = selectedCategory === catId;
    return isActive
      ? "relative px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white"
      : "relative px-4 py-2 rounded-full border border-gray-300 hover:border-pink-400 hover:bg-gray-100";
  };

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        {/* Everyone bubble */}
        <button
          className={
            selectedCategory === null
              ? "relative px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white"
              : "relative px-4 py-2 rounded-full border border-gray-300 hover:border-pink-400 hover:bg-gray-100"
          }
          onClick={() => onCategoryChange(null)}
        >
          {t("Everyone")}
        </button>

        {/* Map categories */}
        {categories?.map((cat) => (
          <button
            key={cat._id}
            className={getBubbleClass(cat._id)}
            onClick={() => onCategoryChange(cat._id)}
            onMouseEnter={() => setHoveredCatId(cat._id)}
            onMouseLeave={() => setHoveredCatId(null)}
          >
            {cat.name}
            {/* Hover icons for edit/delete (if role != teacher, etc.) */}
            {hoveredCatId === cat._id && role !== "teacher" && (
              <span className="absolute top-0 right-0 p-1 flex space-x-2 rounded-full bg-white hover:bg-gray-200 text-lg border -m-1 text-pink-600 cursor-pointer">
                <ProtectedAction
                  requiredPermission={PERMISSIONS.UPDATE_BOOK_CATEGORY}
                >
                  <MdEdit
                    className="hover:text-blue-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditCategorySidebar(cat);
                    }}
                  />
                </ProtectedAction>
                <ProtectedAction
                  requiredPermission={PERMISSIONS.DELETE_BOOK_CATEGORY}
                >
                  <MdDelete
                    className="hover:text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(cat);
                    }}
                  />
                </ProtectedAction>
              </span>
            )}
          </button>
        ))}

        {/* +Add Category bubble (only if admin, or role that can add) */}
        {role === "admin" && (
          <button
            onClick={openAddCategorySidebar}
            className="flex items-center px-4 py-2 border-2 border-dashed border-pink-600 text-pink-600 rounded-full"
          >
            <span className="mr-2">+</span> {t("Add Category")}
          </button>
        )}
      </div>

      {/* Sidebars for add/edit category */}
      <Sidebar
        isOpen={sidebarMode === "add"}
        onClose={closeSidebar}
        title={t("Add Category")}
      >
        <CategorySidebar onClose={closeSidebar} isEditMode={false} />
      </Sidebar>

      <Sidebar
        isOpen={sidebarMode === "edit"}
        onClose={closeSidebar}
        title={t("Edit Category")}
      >
        {editingCategory && (
          <CategorySidebar
            categoryData={editingCategory}
            onClose={closeSidebar}
            isEditMode
          />
        )}
      </Sidebar>

      {/* Delete Confirmation */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={categoryToDelete?.name || "Category"}
      />
    </>
  );
};

export default CategoryNavigationBar;
