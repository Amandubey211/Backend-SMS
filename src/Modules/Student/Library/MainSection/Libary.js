import React, { useEffect, useMemo, useState } from "react";
import BookCard from "../SubClass/component/BookCard";
import Layout from "../../../../Components/Common/Layout";
import StudentDashLayout from "../../../../Components/Student/StudentDashLayout";
import BookIssue from "./BookIssue";
import Spinner from "../../../../Components/Common/Spinner";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  setActiveTab,
  setCurrentPage,
  setSearchQuery,
  setCategory,
} from "../../../../Store/Slices/Student/Library/libararySlice";
import NoDataFound from "../../../../Components/Common/NoDataFound";
import { gt } from "../../../../Utils/translator/translation";
import { studentIssueBooks } from "../../../../Store/Slices/Student/Library/bookIssues.action";
import { libraryBooksStudent } from "../../../../Store/Slices/Student/Library/libarary.action";
import TabButton from "../../../Admin/Libary/Components/TabButton";
import OfflineModal from "../../../../Components/Common/Offline";
import { setShowError } from "../../../../Store/Slices/Common/Alerts/alertsSlice";
import { CiSearch } from "react-icons/ci";

const Library = () => {
  const dispatch = useDispatch();
  const {
    loading: libraryLoading,
    error: libraryError,
    libararyBooks,
    activeTab,
    totalPages,
    currentPage,
    searchQuery,
    category,
  } = useSelector((store) => store.student.studentLibraryBooks);
  const { showError } = useSelector((store) => store?.common?.alertMsg);
  const { t } = useTranslation();
  const [allCategories, setAllCategories] = useState([]);

  useNavHeading(`${activeTab === "BookIssue" ? "Book Issue" : "Library"}`);

  useEffect(() => {
    if (activeTab === "Library") {
      dispatch(
        libraryBooksStudent({
          page: currentPage,
          limit: 12,
          search: searchQuery,
          category: category,
        })
      );
    } else if (activeTab === "BookIssue") {
      dispatch(studentIssueBooks());
    }
  }, [dispatch, activeTab, currentPage, searchQuery, category]);

  useEffect(() => {
    const categories = new Set(["All"]); // Ensure "All" is included
    libararyBooks?.forEach((book) => {
      if (book?.category) {
        categories.add(book.category);
      }
    });
    if (allCategories.length === 0) {
      setAllCategories(Array.from(categories));
    }
  }, [libararyBooks]);

  const handleSwitchTab = (tab) => {
    dispatch(setActiveTab(tab));
  };

  const handleSearch = (e) => {
    dispatch(setSearchQuery(e.target.value));
    dispatch(setCurrentPage(1));
  };

  const handleDismiss = () => {
    dispatch(setShowError(false));
  };

  // Function to filter books based on search query
  const filteredBooks = () => {
    return libararyBooks?.filter((book) => {
      const searchLower = searchQuery?.toLowerCase() || "";
      return (
        !searchQuery ||
        book?.name?.toLowerCase().includes(searchLower) ||
        book?.author?.toLowerCase().includes(searchLower)
      );
    });
  };

  // Function to filter books by category
  const filteredBooksByCategory = () => {
    if (!category || category === "All") {
      return filteredBooks();
    }
    return filteredBooks()?.filter((book) => book?.category === category);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      dispatch(setCurrentPage(newPage));
    }
  };

  const libraryContent = () => {
    if (libraryLoading) {
      return (
        <div className="text-center py-20">
          <Spinner />
        </div>
      );
    }

    if (
      !libraryLoading &&
      filteredBooks()?.length === 0 &&
      activeTab === "Library"
    ) {
      return (
        <div className="text-center py-20">
          <NoDataFound />
        </div>
      );
    }

    return (
      <div className="">
        <div className="grid grid-cols-4 gap-3 px-4 pb-4">
          {filteredBooksByCategory()?.map((book) => (
            <BookCard
              key={book?._id}
              title={book?.title}
              author={book?.author}
              category={book?.category}
              classLevel={book?.classLevel?.className}
              copies={book?.copies}
              available={book?.available}
              coverImageUrl={book?.image}
              name={book?.name}
              totalCopies={book?.TotalCopies}
              issuedCount={book?.issuedCount}
              studentIssueStatus={book?.studentIssueStatus}
            />
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex w-[100%] justify-center p-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 mx-1 rounded-md border-purple-500 text-purple-500 bg-white 
              hover:bg-purple-500 hover:text-white transition-all duration-300 text-sm
              disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <span className="px-4 py-2 mx-1 text-sm font-semibold text-gray-700">
              {`Page ${currentPage} of ${totalPages}`}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 mx-1 rounded-md border-purple-500 text-purple-500 bg-white text-sm
                 hover:bg-purple-500 hover:text-white transition-all duration-300 
                 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout title="Library | Student Diwan">
      <StudentDashLayout>
        <div>
          <div className="flex items-center gap-5 p-5">
            <TabButton
              isActive={activeTab === "Library"}
              onClick={() => handleSwitchTab("Library")}
            >
              {t("Library", gt.stdLibrary)}
            </TabButton>
            <TabButton
              isActive={activeTab === "BookIssue"}
              onClick={() => handleSwitchTab("BookIssue")}
            >
              {t("Book Issue", gt.stdLibrary)}
            </TabButton>

            {activeTab === "Library" && (
              <>
                <div className="relative flex items-center max-w-xs w-full mr-4">
                  <input
                    type="text"
                    placeholder="Search here"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 w-full"
                  />
                  <button className="absolute right-3">
                    <CiSearch className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="w-[25%] pr-4">
                  <select
                    value={category}
                    onChange={(e) => dispatch(setCategory(e.target.value))}
                    className="px-3 py-2 border rounded w-full text-md text-gray-500"
                  >
                    {allCategories?.map((cat) => (
                      <option key={cat} value={cat === "All" ? "" : cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>

          {activeTab === "Library" ? libraryContent() : <BookIssue />}
        </div>

        {!libraryLoading && showError && (
          <OfflineModal error={libraryError} onDismiss={handleDismiss} />
        )}
      </StudentDashLayout>
    </Layout>
  );
};

export default Library;
