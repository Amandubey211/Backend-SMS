import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import Spinner from "../../../../Components/Common/Spinner";
import Sidebar from "../../../../Components/Common/Sidebar";
import TabButton from "../Components/TabButton";
import {
  fetchBookIssuesThunk,
  fetchBooksDetailsThunk,
  fetchCategoriesThunk, // <-- new import
} from "../../../../Store/Slices/Admin/Library/LibraryThunks";
import { resetLibraryState } from "../../../../Store/Slices/Admin/Library/LibrarySlice";

import LibraryTab from "../Components/LibraryTab";
import AddIssue from "../Components/AddIssue";
import AddBook from "../Components/BookForm";
import BookIssueTab from "../Components/BookIssueTab";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import { fetchAllClasses } from "../../../../Store/Slices/Admin/Class/actions/classThunk";
import { useTranslation } from "react-i18next";
import { PERMISSIONS } from "../../../../config/permission";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";

const LibraryAndBookIssue = () => {
  const { t } = useTranslation("admLibrary");
  const dispatch = useDispatch();
  const { loading, addBookSuccess } = useSelector(
    (state) => state.admin.library
  );
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Library");
  const [editIssueData, setEditIssueData] = useState(null);

  // Fetch initial data on mount
  useEffect(() => {
    dispatch(fetchAllClasses());
  }, [dispatch]);

  // Re-fetch data when switching tabs
  useEffect(() => {
    if (activeTab === "Library") {
      dispatch(fetchBooksDetailsThunk());
      dispatch(fetchCategoriesThunk()); // <-- fetch categories here
    } else if (activeTab === "BookIssue") {
      dispatch(fetchBookIssuesThunk());
    }
  }, [activeTab, dispatch]);

  useEffect(() => {
    if (addBookSuccess) {
      setSidebarOpen(false);
      setEditIssueData(null);
      // Reset success state after closing sidebar
      setTimeout(() => {
        dispatch(resetLibraryState());
      }, 500);
    }
  }, [addBookSuccess, dispatch]);

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
            <div className="flex gap-4 mb-4">
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
                  requiredPermission={PERMISSIONS.GET_ALL_BOOKS}
                  title={"Library"}
                >
                  <LibraryTab handleSidebarOpen={handleSidebarOpen} />
                </ProtectedSection>
              ) : (
                <ProtectedSection
                  requiredPermission={PERMISSIONS.GET_ALL_ISSUE_BOOKS}
                  title={"Book Issue"}
                >
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
                <ProtectedSection
                  requiredPermission={PERMISSIONS.ADD_BOOK}
                  title={"Add Library Book"}
                >
                  <AddBook onClose={handleSidebarClose} />
                </ProtectedSection>
              ) : (
                <ProtectedSection
                  requiredPermission={PERMISSIONS.ADD_ISSUE_BOOK}
                  title={"Add Issue Book"}
                >
                  <AddIssue
                    editIssueData={editIssueData}
                    onClose={handleSidebarClose}
                  />
                </ProtectedSection>
              )}
            </Sidebar>
          </div>
        )}
      </DashLayout>
    </Layout>
  );
};

export default LibraryAndBookIssue;
