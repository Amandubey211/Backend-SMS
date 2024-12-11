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
import { useTranslation } from "react-i18next";
import { PERMISSIONS } from "../../../../config/permission";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";

const LibraryAndBookIssue = () => {
  const { t } = useTranslation("admLibrary");
  const dispatch = useDispatch();
  const { books, bookIssues, loading, addBookSuccess, addIssueSuccess } =
    useSelector((state) => state.admin.library);
  const classList = useSelector((state) => state.admin.class.classes);
  const StudentList = useSelector((store) => store.admin.students.studentsList);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Library");
  const [editIssueData, setEditIssueData] = useState(null);

  useEffect(() => {
    if (!books?.length) dispatch(fetchBooksThunk());
    if (!bookIssues?.length) dispatch(fetchBookIssuesThunk());
    if (!classList?.length) dispatch(fetchAllClasses());
    if (!StudentList?.length) dispatch(fetchAllStudents());
  }, [
    dispatch,
    books?.length,
    bookIssues?.length,
    classList?.length,
    StudentList?.length,
  ]);

  useEffect(() => {
    if (addBookSuccess || addIssueSuccess) {
      setSidebarOpen(false);
      setEditIssueData(null);
    }
  }, [addBookSuccess, addIssueSuccess]);

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => {
    setSidebarOpen(false);
    setEditIssueData(null);
  };
  const currentPath = activeTab === "Library" ? t("Library") : t("Book Issue");
  useNavHeading(t("Admin"), currentPath);

  return (
    <Layout title={`${"Library & Book Issues"} | ${"Admin Panel"}`}>
      <DashLayout>
        {loading ? (
          <Spinner />
        ) : (
          <div className="min-h-screen p-4 flex flex-col">
            {/* Tab Buttons */}
            <div className="flex gap-7 mb-4">
              <TabButton
                isActive={activeTab === "Library"}
                onClick={() => setActiveTab("Library")}
              >
                {t("Library")}
              </TabButton>
              <TabButton
                isActive={activeTab === "BookIssue"}
                onClick={() => setActiveTab("BookIssue")}
              >
                {t("Book Issue")}
              </TabButton>
            </div>

            {/* Tab Content */}
            <div className="flex-1">
              {activeTab === "Library" ? (
                <ProtectedSection
                  requiredPermission={PERMISSIONS.MANAGE_LIBRARY}
                >
                  <LibraryTab handleSidebarOpen={handleSidebarOpen} />
                </ProtectedSection>
              ) : (
                <ProtectedSection requiredPermission={PERMISSIONS.ISSUE_BOOK}>
                  <BookIssueTab
                    handleSidebarOpen={handleSidebarOpen}
                    setEditIssueData={setEditIssueData}
                  />
                </ProtectedSection>
              )}
            </div>

            {/* Sidebar for Add/Edit Book or Issue */}
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={handleSidebarClose}
              title={
                activeTab === "Library"
                  ? t("Add New Book")
                  : editIssueData
                  ? t("Edit Book Issue")
                  : t("Add Book Issue")
              }
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
