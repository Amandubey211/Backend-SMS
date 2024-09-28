// src/Modules/Admin/Libary/MainSection/LibraryTab.js
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import BookCard from "../Components/BookCard";
import FormField from "../Components/FormField";
import NoDataFound from "../../../../Components/Common/NoDataFound";
import { setFilters } from "../../../../Store/Slices/Admin/Library/LibrarySlice";

const LibraryTab = ({ handleSidebarOpen }) => {
  const dispatch = useDispatch();
  const { books, filters } = useSelector((state) => state.admin.library);

  // Get unique class levels and categories for book filtering
  const classLevels = [
    ...new Set(books.map((book) => book.classId?.className)),
  ];
  const categories = [...new Set(books.map((book) => book.category))];

  // Filter books based on selected filters
  const filteredBooks = books.filter((book) => {
    const bookClassName = book.classId?.className?.toLowerCase() || "";
    const bookCategory = book.category?.toLowerCase() || "";
    const selectedClass = filters.class?.toLowerCase() || "";
    const selectedCategory = filters.category?.toLowerCase() || "";

    // Only return books that match both selected class and category
    if (selectedClass && selectedCategory) {
      return (
        bookClassName === selectedClass && bookCategory === selectedCategory
      );
    }

    // Return books that match only the selected class
    if (selectedClass && !selectedCategory) {
      return bookClassName === selectedClass;
    }

    // Return books that match only the selected category
    if (!selectedClass && selectedCategory) {
      return bookCategory === selectedCategory;
    }

    // If no filters are applied, return all books
    return true;
  });

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFilters({ key: name, value }));
  };

  return (
    <>
      <div className="flex justify-between items-end space-x-2">
        <div className="flex gap-6">
          <FormField
            id="class"
            name="class"
            label="Class"
            value={filters.class}
            onChange={handleFilterChange}
            options={classLevels}
          />
          <FormField
            id="category"
            name="category"
            label="Category"
            value={filters.category}
            onChange={handleFilterChange}
            options={categories}
          />
        </div>
        <button
          onClick={handleSidebarOpen}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
        >
          Add Book
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 p-4">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => <BookCard key={book._id} book={book} />)
        ) : (
          <NoDataFound message="No Books Found" />
        )}
      </div>
    </>
  );
};

export default LibraryTab;
