import React from "react";
import { useDispatch, useSelector } from "react-redux";
import BookCard from "../Components/BookCard";
import FormField from "../Components/FormField";
import NoDataFound from "../../../../Components/Common/NoDataFound";
import { setFilters } from "../../../../Store/Slices/Admin/Library/LibrarySlice";
import { useTranslation } from "react-i18next";
import ProtectedAction from "../../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../../config/permission";
import { FaBookOpen } from "react-icons/fa"; // Importing relevant icon

const LibraryTab = ({ handleSidebarOpen }) => {
  const { t } = useTranslation("admLibrary");
  const dispatch = useDispatch();
  const { books, filters } = useSelector((state) => state.admin.library);
  const role = useSelector((store) => store.common.auth.role);

  const classLevels = [
    ...new Set(books?.map((book) => book.classId?.className)),
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
        {role !== "teacher" && (
          <ProtectedAction requiredPermission={PERMISSIONS.ADD_BOOK}>
            <button
              onClick={handleSidebarOpen}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
            >
              {t("Add Book")}
            </button>
          </ProtectedAction>
        )}
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
              icon={FaBookOpen} // Proper icon for library context
              iconColor="text-blue-500" // Icon color for a friendly UI
              textColor="text-gray-600"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default LibraryTab;
