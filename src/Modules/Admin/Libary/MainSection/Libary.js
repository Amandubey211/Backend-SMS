import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import Spinner from "../../../../Components/Common/Spinner";
import Sidebar from "../../../../Components/Common/Sidebar";
import TabButton from "../Components/TabButton";
import {
  fetchBooksThunk,
  fetchBookIssuesThunk,
} from "../../../../Store/Slices/Admin/Library/LibraryThunks";
import LibraryTab from "../Components/LibraryTab";
import AddIssue from "../Components/AddIssue";
import AddBook from "../Components/AddBook";
import BookIssueTab from "../Components/BookIssueTab";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import { fetchAllClasses } from "../../../../Store/Slices/Admin/Class/actions/classThunk";
import { fetchAllStudents } from "../../../../Store/Slices/Admin/Class/Students/studentThunks";

const LibraryAndBookIssue = () => {
  const dispatch = useDispatch();
  const { books, bookIssues, loading, addBookSuccess, addIssueSuccess } =
    useSelector((state) => state.admin.library);
  const classList = useSelector((state) => state.admin.class.classes);
  const StudentList = useSelector((store) => store.admin.students.studentsList);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Library");
  const [editIssueData, setEditIssueData] = useState(null);

  // Fetch books, book issues, classes, and students on component mount
  useEffect(() => {
    if (!books.length) dispatch(fetchBooksThunk());
    if (!bookIssues.length) dispatch(fetchBookIssuesThunk());
    if (!classList.length) dispatch(fetchAllClasses());
    if (!StudentList.length) dispatch(fetchAllStudents());
  }, [
    dispatch,
    books.length,
    bookIssues.length,
    classList.length,
    StudentList.length,
  ]);

  // Close sidebar automatically after a successful add or edit operation
  useEffect(() => {
    if (addBookSuccess || addIssueSuccess) {
      setSidebarOpen(false);
      setEditIssueData(null); // Reset edit data
    }
  }, [addBookSuccess, addIssueSuccess]);

  // Sidebar controls
  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => {
    setSidebarOpen(false);
    setEditIssueData(null); // Reset edit data after closing the sidebar
  };
  const currentPath = activeTab === "Library" ? "Library" : "Book Issue";
  useNavHeading("Admin", currentPath);

  return (
    <Layout title="Library & Book Issues | Admin Panel">
      <DashLayout>
        {loading ? (
          <Spinner />
        ) : (
          <div className="min-h-screen p-4">
            {/* Tab Buttons */}
            <div className="flex gap-7 mb-4">
              <TabButton
                isActive={activeTab === "Library"}
                onClick={() => setActiveTab("Library")}
              >
                Library
              </TabButton>
              <TabButton
                isActive={activeTab === "BookIssue"}
                onClick={() => setActiveTab("BookIssue")}
              >
                Book Issue
              </TabButton>
            </div>

            {/* Tab Content */}
            {activeTab === "Library" ? (
              <LibraryTab handleSidebarOpen={handleSidebarOpen} />
            ) : (
              <BookIssueTab
                handleSidebarOpen={handleSidebarOpen}
                setEditIssueData={setEditIssueData}
              />
            )}

            {/* Sidebar for Add/Edit Book or Issue */}
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={handleSidebarClose}
              title={
                activeTab === "Library"
                  ? "Add New Book"
                  : editIssueData
                  ? "Edit Book Issue"
                  : "Add Book Issue"
              } // Dynamically set the sidebar title
            >
              {activeTab === "Library" ? (
                <AddBook onClose={handleSidebarClose} />
              ) : (
                <AddIssue
                  editIssueData={editIssueData}
                  onClose={handleSidebarClose}
                />
              )}
            </Sidebar>
          </div>
        )}
      </DashLayout>
    </Layout>
  );
};

export default LibraryAndBookIssue;
