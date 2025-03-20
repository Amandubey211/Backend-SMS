import React, { useEffect, useState } from "react";
import BookCard from "../SubClass/component/BookCard";
import Layout from "../../../../Components/Common/Layout";
import StudentDashLayout from "../../../../Components/Student/StudentDashLayout";
import BookIssue from "./BookIssue";
import Spinner from "../../../../Components/Common/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  setActiveTab,
  setCurrentPage,
  setSearchQuery,
  setCategory,
} from "../../../../Store/Slices/Student/Library/libararySlice";
import NoDataFound from "../../../../Components/Common/NoDataFound";
import { studentIssueBooks } from "../../../../Store/Slices/Student/Library/bookIssues.action";
import { libraryBooksStudent } from "../../../../Store/Slices/Student/Library/libarary.action";
import TabButton from "../../../Admin/Libary/Components/TabButton";
import OfflineModal from "../../../../Components/Common/Offline";
import { setShowError } from "../../../../Store/Slices/Common/Alerts/alertsSlice";
import { CiSearch } from "react-icons/ci";
import Pagination from "../../../../Components/Common/pagination";
import { Tooltip } from "antd";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";

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
    totalBooks,
  } = useSelector((store) => store.student.studentLibraryBooks);

  const {
    loading: issueLoading,
    error: issueError,
    totalIssueBookPages,
    totalIssuedBook,
    currentIssuedBookPage,
  } = useSelector((store) => store?.student?.studentIssueBooks);
 console.log("currentIssuedBook", currentIssuedBookPage,totalIssuedBook,totalIssueBookPages)
  const { showError } = useSelector((store) => store?.common?.alertMsg);
  const { t } = useTranslation();
  const [allCategories, setAllCategories] = useState([]);
  const [limit, setLimit] = useState(8);

  useNavHeading(`${activeTab === "BookIssue" ? "Book Issue" : "Library"}`);

  useEffect(() => {
    if (activeTab === "Library") {
      dispatch(
        libraryBooksStudent({
          page: currentPage,
          limit: limit,
          search: searchQuery,
          category: category === "All" ? "" : category,
        })
      );
    } else if (activeTab === "BookIssue") {
      dispatch(studentIssueBooks({
        page: currentIssuedBookPage,
        limit: limit,
      }));
    }
  }, [dispatch, activeTab, currentPage, currentIssuedBookPage, searchQuery, category, limit]);

  const handleSwitchTab = (tab) => dispatch(setActiveTab(tab));

  const handleSearch = (e) => {
    dispatch(setSearchQuery(e.target.value));
    dispatch(setCurrentPage(1));
  };

  const handleDismiss = () => dispatch(setShowError(false));

  const handlePageChange = (newPage) => {
    if (
      newPage > 0 &&
      (activeTab === "Library" ? newPage <= totalPages : newPage <= totalIssueBookPages)
    ) {
      dispatch(setCurrentPage(newPage));
    }
  };

  const libraryContent = () => {
    if (libraryLoading) return <Spinner />;
    if (!libraryLoading && libararyBooks?.length === 0 && activeTab === "Library") {
      return <NoDataFound />;
    }
    return (
      <div className="grid grid-cols-4 gap-3 px-4 pb-4">
        {libararyBooks?.map((book) => (
          <BookCard
            key={book?._id}
            title={book?.title}
            author={book?.author}
            categories={book?.categories || []}
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
    );
  };

  return (
    <Layout title="Library | Student Diwan">
      <StudentDashLayout>
        <div>
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-5">
              <TabButton isActive={activeTab === "Library"} onClick={() => handleSwitchTab("Library")}>
                Library
              </TabButton>
              <TabButton isActive={activeTab === "BookIssue"} onClick={() => handleSwitchTab("BookIssue")}>
                Book Issue
              </TabButton>
            </div>

            {activeTab === "Library" && (
              <div className="flex items-center gap-4 ml-auto w-1/3">
                <div className="relative flex items-center w-full">
                  <input
                    type="text"
                    placeholder="Search here"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 w-full"
                  />
                  <CiSearch className="w-5 h-5 text-gray-500 absolute right-3" />
                </div>
              </div>
            )}
          </div>

          {activeTab === "Library" ? libraryContent() : <BookIssue />}

          <Pagination
            page={activeTab === "Library" ? currentPage :  currentIssuedBookPage}
            totalPages={activeTab === "Library" ? totalPages : totalIssueBookPages}
            totalRecords={activeTab === "Library" ? totalBooks : totalIssuedBook}
            limit={limit}
            setPage={handlePageChange}
            setLimit={setLimit}
            t={t}
          />

          {!libraryLoading && showError && <OfflineModal error={libraryError || issueError} onDismiss={handleDismiss} />}
        </div>
      </StudentDashLayout>
    </Layout>
  );
};

export default Library;
