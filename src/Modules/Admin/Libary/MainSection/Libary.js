// src/Modules/Admin/Library/Library.js

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BookCard from "../Components/BookCard";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import FormField from "../Components/FormField";
import Sidebar from "../../../../Components/Common/Sidebar";
import AddBook from "../Components/AddBook";
import TabButton from "../Components/TabButton";
import Spinner from "../../../../Components/Common/Spinner";
import BookIssue from "./BookIssue";

import { fetchBooksThunk } from "../../../../Store/Slices/Admin/Library/LibraryThunks";
import { setFilters } from "../../../../Store/Slices/Admin/Library/LibrarySlice";

const Library = () => {
  const dispatch = useDispatch();
  const { books, loading, filters } = useSelector(
    (state) => state.admin.library
  );
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Library");

  // Fetch books data on component mount
  useEffect(() => {
    dispatch(fetchBooksThunk());
  }, [dispatch]);

  // Get unique class levels and categories from the books data
  const classLevels = [
    ...new Set(books.map((book) => book.classId?.className)),
  ];
  const categories = [...new Set(books.map((book) => book.category))];

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFilters({ key: name, value })); // Use the updated setFilters structure
  };

  // Sidebar control for Add Book form
  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);

  // Filter books based on selected filters (class and category)
  const filteredBooks = books.filter((book) => {
    const bookClassName = book.classId?.className?.toLowerCase() || "";
    const bookCategory = book.category?.toLowerCase() || "";

    const selectedClass = filters.class?.toLowerCase() || "";
    const selectedCategory = filters.category?.toLowerCase() || "";

    // If both class and category are selected, filter based on both
    if (selectedClass && selectedCategory) {
      return (
        bookClassName === selectedClass && bookCategory === selectedCategory
      );
    }

    // If only class is selected, filter by class
    if (selectedClass && !selectedCategory) {
      return bookClassName === selectedClass;
    }

    // If only category is selected, filter by category
    if (!selectedClass && selectedCategory) {
      return bookCategory === selectedCategory;
    }

    // If neither class nor category is selected, show all books
    return true;
  });

  return (
    <Layout title="Library | Admin Panel">
      <DashLayout>
        {loading ? (
          <Spinner />
        ) : (
          <div className="min-h-screen p-4 ">
            {/* Tabs for Library and Book Issue */}
            <div className="flex flex-col items-start mb-4 gap-5">
              <div className="flex gap-7">
                <TabButton
                  isActive={activeTab === "Library"}
                  onClick={() => setActiveTab("Library")}
                >
                  Library
                </TabButton>
                {/* <TabButton
                  isActive={activeTab === "BookIssue"}
                  onClick={() => setActiveTab("BookIssue")}
                >
                  Book Issue
                </TabButton> */}
              </div>
            </div>

            {/* Library Tab */}
            {activeTab === "Library" && (
              <>
                <div className="flex justify-between items-end space-x-2 w-full">
                  <div className="flex gap-6">
                    {/* Class Filter */}
                    <FormField
                      id="class"
                      name="class"
                      label="Class"
                      value={filters.class}
                      onChange={handleFilterChange}
                      options={classLevels}
                    />
                    {/* Category Filter */}
                    <FormField
                      id="category"
                      name="category"
                      label="Category"
                      value={filters.category}
                      onChange={handleFilterChange}
                      options={categories}
                    />
                  </div>

                  {/* Add Book Button */}
                  <button
                    onClick={handleSidebarOpen}
                    className="h-12 inline-flex items-center border border-transparent text-sm font-medium shadow-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
                  >
                    Add Books
                  </button>
                </div>

                {/* Display Filtered Books */}
                <div className="grid grid-cols-3 gap-4 p-4">
                  {filteredBooks.length > 0 ? (
                    filteredBooks.map((book) => (
                      <BookCard key={book._id} book={book} />
                    ))
                  ) : (
                    <div className="flex w-[80vw] h-[80vh] text-gray-500 items-center justify-center flex-col text-2xl">
                      <span>No Books Found</span>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Book Issue Tab */}
            {/* {activeTab === "BookIssue" && <BookIssue />} */}

            {/* Add Book Sidebar */}
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={handleSidebarClose}
              title="Add New Book"
            >
              <AddBook />
            </Sidebar>
          </div>
        )}
      </DashLayout>
    </Layout>
  );
};

export default Library;
