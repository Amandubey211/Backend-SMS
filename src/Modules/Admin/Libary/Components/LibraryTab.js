import React from "react";
import { useDispatch, useSelector } from "react-redux";
import BookCard from "../Components/BookCard";
import FormField from "../Components/FormField";
import NoDataFound from "../../../../Components/Common/NoDataFound";
import { setFilters } from "../../../../Store/Slices/Admin/Library/LibrarySlice";
import { useTranslation } from "react-i18next";
import ProtectedAction from "../../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../../config/permission";
import { FaBookOpen } from "react-icons/fa";
import { Pagination } from "antd"; // Import Ant Design Pagination
import { fetchBooksDetailsThunk } from "../../../../Store/Slices/Admin/Library/LibraryThunks";

const LibraryTab = ({ handleSidebarOpen }) => {
  const { t } = useTranslation("admLibrary");
  const dispatch = useDispatch();
  // Destructure new pagination properties from the state
  const { books, filters, totalBooks, totalPages, currentPage } = useSelector(
    (state) => state.admin.library
  );
  const role = useSelector((store) => store.common.auth.role);

  const classLevels = [
    ...new Set(books?.map((book) => book?.className)),
  ].filter(Boolean);
  const categories = [...new Set(books?.map((book) => book.category))].filter(
    Boolean
  );

  const filteredBooks = books?.filter((book) => {
    const bookClassName = book?.classId?.className?.toLowerCase() || "";
    const bookCategory = book?.category?.toLowerCase() || "";
    const selectedClass = filters?.class?.toLowerCase() || "";
    const selectedCategory = filters?.category?.toLowerCase() || "";

    if (selectedClass && selectedCategory) {
      return (
        bookClassName === selectedClass && bookCategory === selectedCategory
      );
    }
    if (selectedClass && !selectedCategory) {
      return bookClassName === selectedClass;
    }
    if (!selectedClass && selectedCategory) {
      return bookCategory === selectedCategory;
    }
    return true;
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFilters({ key: name, value }));
  };

  // Handler for pagination change
  const handlePageChange = (page) => {
    dispatch(fetchBooksDetailsThunk(page));
  };

  // Calculate pageSize (assuming consistent page size from backend)
  const pageSize = totalPages > 0 ? Math.ceil(totalBooks / totalPages) : 0;

  return (
    <>
      <div className="flex justify-between items-end space-x-2">
        <div className="flex gap-4">
          <FormField
            id="class"
            name="class"
            label={t("Class")}
            value={filters.class}
            onChange={handleFilterChange}
            options={classLevels}
          />
          <FormField
            id="category"
            name="category"
            label={t("Category")}
            value={filters.category}
            onChange={handleFilterChange}
            options={categories}
          />
        </div>
        <ProtectedAction requiredPermission={PERMISSIONS.ADD_BOOK}>
          <button
            onClick={handleSidebarOpen}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
          >
            {t("Add Book")}
          </button>
        </ProtectedAction>
      </div>

      <div className="flex justify-center items-center w-full min-h-[70vh]">
        {filteredBooks?.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 w-full p-4">
            {filteredBooks?.map((book) => (
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

      {/* Pagination Component (only show if there are multiple pages) */}
      {totalPages > 1 && (
        <div className="flex justify-end mt-4">
          <Pagination
            current={currentPage}
            total={totalBooks}
            pageSize={pageSize}
            onChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
};

export default LibraryTab;
