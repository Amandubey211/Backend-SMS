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
import { fetchBooksDetailsThunk } from "../../../../Store/Slices/Admin/Library/LibraryThunks";
import { useTranslation } from "react-i18next";
import { fetchAllClasses } from "../../../../Store/Slices/Admin/Class/actions/classThunk";
import { deleteCategoryThunk } from "../../../../Store/Slices/Admin/Library/LibraryThunks";
import Pagination from "../../../../Components/Common/pagination";

const { Option } = Select;

const LibraryTab = ({ page, setPage, limit, setLimit }) => {
  const { t } = useTranslation("admLibrary");
  const dispatch = useDispatch();

  // Fetch classes on mount
  useEffect(() => {
    dispatch(fetchAllClasses());
  }, [dispatch]);

  // Redux state
  const {
    books,
    categories,
    loading,
    filters,
    totalBooks,
    totalPages,
    currentPage,
    categoriesLoading,
  } = useSelector((state) => state.admin.library);
  const { classes } = useSelector((store) => store?.admin?.class);
  const role = useSelector((state) => state.common.auth.role);

  // Local states
  const [isBookSidebarOpen, setBookSidebarOpen] = useState(false);
  const [isCategorySidebarOpen, setCategorySidebarOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // For category deletion
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // For viewing category details
  const [viewCategory, setViewCategory] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Sidebar handlers
  const openBookSidebar = () => setBookSidebarOpen(true);
  const closeBookSidebar = () => setBookSidebarOpen(false);
  const openCategorySidebar = () => setCategorySidebarOpen(true);
  const closeCategorySidebar = () => {
    setCategorySidebarOpen(false);
    setEditCategory(null);
  };

  // Deletion handlers
  const handleDeleteCategory = (cat) => {
    setCategoryToDelete(cat);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCategoryToDelete(null);
  };
  const confirmDeleteCategory = () => {
    dispatch(deleteCategoryThunk(categoryToDelete._id)).then(() => {
      closeDeleteModal();
    });
  };

  // Class select filter
  const handleClassSelect = (value) => {
    dispatch(setFilters({ key: "class", value }));
  };

  // Reset filters: clear class filter and selected category
  const resetFilters = () => {
    dispatch(setFilters({ key: "class", value: "" }));
    setSelectedCategory(null);
  };

  // Category selection (filtering books)
  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
  };

  // Add category
  const handleAddCategory = () => {
    setEditCategory(null);
    setCategorySidebarOpen(true);
  };

  // Edit category
  const handleEditCategory = (cat) => {
    setEditCategory(cat);
    setCategorySidebarOpen(true);
  };

  // View category details
  const handleViewCategory = (cat) => {
    setViewCategory(cat);
    setIsViewModalOpen(true);
  };
  const closeViewModal = () => {
    setViewCategory(null);
    setIsViewModalOpen(false);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    dispatch(setCurrentPage(1));
    dispatch(fetchBooksDetailsThunk({ page: 1, limit: newLimit }));
  };

  // Helper to get count of books per category based on the class filter
  const getBookCount = useCallback(
    (catId) => {
      if (!books) return 0;
      return books.filter((book) => {
        if (filters?.class && book.classId !== filters.class) return false;
        if (!catId) return true;
        return book.categories?.some((cat) => cat._id === catId);
      }).length;
    },
    [books, filters]
  );

  // Filtered books for listing
  const filteredBooks = books?.filter((book) => {
    const selClass = filters?.class || "";
    if (selClass && book.classId !== selClass) return false;
    if (!selectedCategory) return true;
    return book.categories?.some((cat) => cat._id === selectedCategory);
  });

  // Category badge classes
  const getBubbleClasses = (catId) => {
    const base =
      "relative px-4 py-2 rounded-full max-w-[120px] truncate text-sm";
    return catId === selectedCategory
      ? `${base} bg-gradient-to-r from-pink-500 to-purple-500 text-white`
      : `${base} border border-gray-300 hover:border-pink-400 hover:bg-gray-100`;
  };

  // Pastel purple background & darker purple text for the badge count
  const badgeStyle = {
    backgroundColor: "#E1BEE7", // pastel purple
    color: "#8E24AA", // darker purple text
    fontSize: "0.75rem",
    fontWeight: "bold",
  };

  return (
    <div className="w-full">
      {/* TOP ROW: Categories on left; Filter controls on right */}
      <div className="flex items-center justify-between w-full gap-2">
        {/* Left: Category badges with a reduced width scroll and subtle blur on the right */}
        <div
          className="flex-1 relative overflow-x-auto whitespace-nowrap pb-3 pt-3 no-scrollbar"
          style={{ maxWidth: "calc(100vw - 550px)" }}
        >
          <div className="flex gap-2">
            <Badge count={getBookCount(null)} showZero style={badgeStyle}>
              <button
                className={getBubbleClasses(null)}
                onClick={() => handleCategoryChange(null)}
              >
                {t("All Books")}
              </button>
            </Badge>
            {categories?.map((cat) => (
              <div key={cat._id} className="relative group inline-block z-30">
                <Badge
                  count={getBookCount(cat._id)}
                  showZero
                  style={badgeStyle}
                >
                  <button
                    className={getBubbleClasses(cat._id)}
                    onClick={() => handleCategoryChange(cat._id)}
                  >
                    <Tooltip title={cat.name}>
                      <span>{cat.name}</span>
                    </Tooltip>
                  </button>
                </Badge>
                {role !== "teacher" && (
                  <div className="absolute top-0 right-0 flex items-center space-x-2 p-2 bg-white rounded-full shadow text-pink-600 opacity-0 group-hover:opacity-100 transition transform translate-x-1/2 -translate-y-1/2 overflow-visible z-40 border">
                    <Tooltip title={t("View Category")}>
                      <FiEye
                        className="hover:text-green-500 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewCategory(cat);
                        }}
                      />
                    </Tooltip>
                    <ProtectedAction
                      requiredPermission={PERMISSIONS.UPDATE_BOOK_CATEGORY}
                    >
                      <Tooltip title={t("Edit Category")}>
                        <FiEdit2
                          className="hover:text-blue-500 cursor-pointer"
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
                      <Tooltip title={t("Delete Category")}>
                        <FiTrash2
                          className="hover:text-red-500 cursor-pointer"
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
          {/* Right-side overlay with a subtle blur effect */}
          <div className="pointer-events-none absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-white to-transparent backdrop-blur-sm" />
        </div>

        {/* "Add Category" button always visible */}
        <ProtectedAction requiredPermission={PERMISSIONS.ADD_BOOK_CATEGORY}>
          <button
            onClick={handleAddCategory}
            className="flex items-center px-4 py-2 border-2 border-dashed border-pink-600 text-pink-600 rounded-full text-sm shrink-0"
          >
            <span className="mr-1">+</span> {t("Add Category")}
          </button>
        </ProtectedAction>

        {/* Right: Class select filter and Reset button */}
        <div className="flex-shrink-0 flex items-center gap-2">
          <Select
            value={filters.class || ""}
            onChange={handleClassSelect}
            placeholder={t("All Classes")}
            style={{ width: 160 }}
            className="rounded-full"
            size="large"
            allowClear
          >
            <Option value="">{t("All Classes")}</Option>
            {classes?.map((c) => (
              <Option key={c?._id} value={c?._id}>
                {c?.className}
              </Option>
            ))}
          </Select>
          <Tooltip title={t("Reset Filters")}>
            <Button
              onClick={resetFilters}
              className="focus:outline-none rounded-full h-12 w-12"
            >
              <FiRefreshCcw className="hover:animate-spin" size={20} />
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* BOOKS LISTING */}
      <div className="w-full p-3 mt-4">
        {loading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : filteredBooks?.length ? (
          <div className="grid grid-cols-3 gap-4 w-full">
            {filteredBooks?.reverse()?.map((book) => (
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

      {/* PAGINATION */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-end mt-4">
          <Pagination
            page={page}
            totalPages={totalPages}
            totalRecords={totalBooks}
            limit={limit}
            setPage={setPage}
            setLimit={setLimit}
            t={t}
          />
        </div>
      )}

      {/* SIDEBAR: BookForm */}
      <Sidebar
        isOpen={isBookSidebarOpen}
        onClose={() => setBookSidebarOpen(false)}
        title={t("Add New Book")}
      >
        <BookForm onClose={() => setBookSidebarOpen(false)} />
      </Sidebar>

      {/* SIDEBAR: Category management */}
      <CategorySidebar
        isOpen={isCategorySidebarOpen}
        onClose={closeCategorySidebar}
        loading={categoriesLoading}
        categoryToEdit={editCategory}
      />

      {/* Delete Modal for category */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteCategory}
        title={categoryToDelete ? categoryToDelete.name : t("Delete Category")}
        description={t(
          "Are you sure you want to delete this category? This action cannot be undone."
        )}
        icon={<FiTrash2 size={24} className="text-red-600" />}
      />

      {/* View Category Modal */}
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
          <div>
            <p>
              <strong>{t("Name")}:</strong> {viewCategory.name}
            </p>
            <p>
              <strong>{t("Description")}:</strong>{" "}
              {viewCategory.description || t("No description available.")}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LibraryTab;
