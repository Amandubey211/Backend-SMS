import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton, Select, Tooltip, Modal, Button, Badge } from "antd";
import { FaBookOpen } from "react-icons/fa";
import { FiEdit2, FiTrash2, FiEye, FiRefreshCcw } from "react-icons/fi";
import ProtectedAction from "../../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../../config/permission";
import BookCard from "../Components/BookCard";
import NoDataFound from "../../../../Components/Common/NoDataFound";
import Sidebar from "../../../../Components/Common/Sidebar";
import BookForm from "./BookForm";
import CategorySidebar from "./CategorySidebar";
import DeleteModal from "../../../../Components/Common/DeleteModal";
import {
  setCurrentPage,
  setFilters,
} from "../../../../Store/Slices/Admin/Library/LibrarySlice";
import {
  fetchBooksDetailsThunk,
  deleteCategoryThunk,
} from "../../../../Store/Slices/Admin/Library/LibraryThunks";
import { useTranslation } from "react-i18next";
import { fetchAllClasses } from "../../../../Store/Slices/Admin/Class/actions/classThunk";
import Pagination from "../../../../Components/Common/pagination";

const { Option } = Select;

const LibraryTab = ({ page, setPage, limit, setLimit }) => {
  const { t } = useTranslation("admLibrary");
  const dispatch = useDispatch();

  // Fetch class list
  useEffect(() => {
    dispatch(fetchAllClasses());
  }, [dispatch]);

  const {
    books,
    categories,
    loading,
    filters,
    totalBooks,
    totalPages,
    categoriesLoading,
  } = useSelector((state) => state.admin.library);
  const { classes } = useSelector((s) => s.admin.class);
  const role = useSelector((s) => s.common.auth.role);

  // Local state
  const [isBookSidebarOpen, setBookSidebarOpen] = useState(false);
  const [isCategorySidebarOpen, setCategorySidebarOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [viewCategory, setViewCategory] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Show blur overlay when there are more than 3 categories
  const showBlur = (categories?.length || 0) > 3;

  // Handlers
  const handleAddCategory = () => {
    setEditCategory(null);
    setCategorySidebarOpen(true);
  };
  const handleEditCategory = (cat) => {
    setEditCategory(cat);
    setCategorySidebarOpen(true);
  };
  const handleViewCategory = (cat) => {
    setViewCategory(cat);
    setIsViewModalOpen(true);
  };
  const closeViewModal = () => setIsViewModalOpen(false);

  const handleDeleteCategory = (cat) => {
    setCategoryToDelete(cat);
    setIsDeleteModalOpen(true);
  };
  const confirmDeleteCategory = () => {
    dispatch(deleteCategoryThunk(categoryToDelete._id)).then(() => {
      setIsDeleteModalOpen(false);
    });
  };

  const handleClassSelect = (value) =>
    dispatch(setFilters({ key: "class", value }));
  const resetFilters = () => {
    dispatch(setFilters({ key: "class", value: "" }));
    setSelectedCategory(null);
  };

  const handleCategoryChange = (catId) => setSelectedCategory(catId);

  const handlePageChange = (newPage) => setPage(newPage);
  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    dispatch(setCurrentPage(1));
    dispatch(fetchBooksDetailsThunk({ page: 1, limit: newLimit }));
  };

  const getBookCount = useCallback(
    (catId) => {
      if (!books) return 0;
      return books.filter((b) => {
        if (filters.class && b.classId !== filters.class) return false;
        if (!catId) return true;
        return b.categories?.some((c) => c._id === catId);
      }).length;
    },
    [books, filters]
  );

  const filteredBooks = books.filter((b) => {
    if (filters.class && b.classId !== filters.class) return false;
    if (selectedCategory) {
      return b.categories?.some((c) => c._id === selectedCategory);
    }
    return true;
  });

  const badgeStyle = {
    backgroundColor: "#E1BEE7",
    color: "#8E24AA",
    fontSize: "0.75rem",
    fontWeight: "bold",
  };
  const bubbleClass = (catId) => {
    const base =
      "relative px-4 py-2 rounded-full max-w-[120px] truncate text-sm";
    return catId === selectedCategory
      ? `${base} bg-gradient-to-r from-pink-500 to-purple-500 text-white`
      : `${base} border border-gray-300 hover:border-pink-400 hover:bg-gray-100`;
  };

  return (
    <div className="w-full">
      {/* Top row: badges, add-category, filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4">
        {/* Badges with blur overlay */}
        <div className="relative flex-1 min-w-[300px]">
          <div className="overflow-x-auto whitespace-nowrap no-scrollbar">
            <div className="inline-flex gap-2 py-3">
              <Badge count={getBookCount(null)} showZero style={badgeStyle}>
                <button
                  className={bubbleClass(null)}
                  onClick={() => handleCategoryChange(null)}
                >
                  {t("All Books")}
                </button>
              </Badge>
              {categories.map((cat) => (
                <div key={cat._id} className="relative inline-block group">
                  <Badge
                    count={getBookCount(cat._id)}
                    showZero
                    style={badgeStyle}
                  >
                    <button
                      className={bubbleClass(cat._id)}
                      onClick={() => handleCategoryChange(cat._id)}
                    >
                      <Tooltip title={cat.name}>
                        <span>{cat.name}</span>
                      </Tooltip>
                    </button>
                  </Badge>
                  {role !== "teacher" && (
                    <div className="absolute top-0 right-0 flex space-x-2 p-2 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transform translate-x-1/2 -translate-y-1/2 z-30">
                      <Tooltip title={t("View")}>
                        <FiEye
                          className="cursor-pointer hover:text-green-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewCategory(cat);
                          }}
                        />
                      </Tooltip>
                      <ProtectedAction
                        requiredPermission={PERMISSIONS.UPDATE_BOOK_CATEGORY}
                      >
                        <Tooltip title={t("Edit")}>
                          <FiEdit2
                            className="cursor-pointer hover:text-blue-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditCategory(cat);
                            }}
                          />
                        </Tooltip>
                      </ProtectedAction>
                      <ProtectedAction
                        requiredPermission={PERMISSIONS.DELETE_BOOK_CATEGORY}
                      >
                        <Tooltip title={t("Delete")}>
                          <FiTrash2
                            className="cursor-pointer hover:text-red-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCategory(cat);
                            }}
                          />
                        </Tooltip>
                      </ProtectedAction>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {showBlur && (
            <div className="pointer-events-none absolute z-10 top-0 right-0 h-full w-8 bg-gradient-to-l from-white to-transparent backdrop-blur-sm" />
          )}
        </div>

        {/* Add category and Add Book buttons */}
        <div className="flex items-center gap-4">
          <ProtectedAction requiredPermission={PERMISSIONS.ADD_BOOK_CATEGORY}>
            <button
              onClick={handleAddCategory}
              className="flex items-center px-4 py-2 border-2 border-dashed border-pink-600 text-pink-600 rounded-full text-sm hover:bg-pink-50 transition-colors"
            >
              <span className="mr-1">+</span> {t("Add Category")}
            </button>
          </ProtectedAction>
        </div>

        {/* Filters pushed to right */}
        <div className="flex items-center gap-2">
          <Select
            value={filters.class || ""}
            onChange={handleClassSelect}
            placeholder={t("All Classes")}
            allowClear
            size="large"
            className="rounded-full"
            style={{ width: 160 }}
          >
            <Option value="">{t("All Classes")}</Option>
            {classes.map((c) => (
              <Option key={c._id} value={c._id}>
                {c.className}
              </Option>
            ))}
          </Select>
          <Tooltip title={t("Reset Filters")}>
            <Button
              onClick={resetFilters}
              className="rounded-full h-12 w-12 flex items-center justify-center"
            >
              <FiRefreshCcw size={20} className="hover:animate-spin" />
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* Book listing */}
      <div className="mt-4 p-3">
        {loading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...filteredBooks].reverse().map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-[50vh]">
            <NoDataFound
              title={t("Books")}
              desc={t("Try adjusting your filters or adding new books.")}
              icon={FaBookOpen}
              iconColor="text-blue-500"
              textColor="text-gray-600"
            />
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          totalRecords={totalBooks}
          limit={limit}
          setPage={handlePageChange}
          setLimit={handleLimitChange}
          t={t}
        />
      )}

      {/* Sidebars & Modals */}
      <Sidebar
        isOpen={isBookSidebarOpen}
        onClose={() => setBookSidebarOpen(false)}
        title={t("Add New Book")}
        width="60%"
      >
        <BookForm onClose={() => setBookSidebarOpen(false)} />
      </Sidebar>
      <CategorySidebar
        isOpen={isCategorySidebarOpen}
        onClose={() => {
          setCategorySidebarOpen(false);
          setEditCategory(null);
        }}
        loading={categoriesLoading}
        categoryToEdit={editCategory}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteCategory}
        title={categoryToDelete?.name || t("Delete Category")}
        description={t(
          "Are you sure you want to delete this category? This action cannot be undone."
        )}
        icon={<FiTrash2 size={24} className="text-red-600" />}
      />
      <Modal
        visible={isViewModalOpen}
        title={t("Category Details")}
        onCancel={closeViewModal}
        footer={[
          <Button key="ok" type="primary" onClick={closeViewModal}>
            {t("Ok")}
          </Button>,
        ]}
        centered
        maskStyle={{ backdropFilter: "blur(5px)" }}
      >
        {viewCategory && (
          <>
            <p>
              <strong>{t("Name")}:</strong> {viewCategory.name}
            </p>
            <p>
              <strong>{t("Description")}:</strong>{" "}
              {viewCategory.description || t("No description available.")}
            </p>
          </>
        )}
      </Modal>
    </div>
  );
};

export default LibraryTab;
