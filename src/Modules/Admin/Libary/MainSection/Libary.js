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
  fetchCategoriesThunk,
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
import ProtectedAction from "../../../../Routes/ProtectedRoutes/ProtectedAction";

const LibraryAndBookIssue = () => {
  const { t } = useTranslation("admLibrary");
  const dispatch = useDispatch();
  const { loading, addBookSuccess } = useSelector(
    (state) => state.admin.library
  );

  /* ---------------------------- local UI state ---------------------------- */
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Library");
  const [editIssueData, setEditIssueData] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  /* ------------------------------ data fetch ------------------------------ */
  useEffect(() => {
    dispatch(fetchAllClasses());
  }, [dispatch]);

  useEffect(() => {
    if (activeTab === "Library") {
      dispatch(fetchBooksDetailsThunk({ page, limit }));
      dispatch(fetchCategoriesThunk());
    } else if (activeTab === "BookIssue") {
      dispatch(fetchBookIssuesThunk({ page, limit }));
    }
  }, [activeTab, dispatch, page, limit]);

  /* ---------------------- success-driven sidebar close -------------------- */
  useEffect(() => {
    if (addBookSuccess) {
      setSidebarOpen(false);
      setEditIssueData(null);

      // clear transient flags so they don't affect the next open
      setTimeout(() => dispatch(resetLibraryState()), 500);
    }
  }, [addBookSuccess, dispatch]);

  /* ---------------------------- helpers ---------------------------------- */
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    if (tab === "BookIssue") setPage(1);
  };

  const handleSidebarOpen = () => {
    /* ① – NEW: wipe all transient success / ISBN cache BEFORE opening */
    dispatch(resetLibraryState());
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
    setEditIssueData(null);
  };

  /* --------------------------- nav heading ------------------------------- */
  const currentPath = activeTab === "Library" ? t("Library") : t("Book Issue");
  useNavHeading(t("Admin"), currentPath);

  /* ============================== render ================================= */
  return (
    <Layout title="Library & Book Issues | Admin Panel">
      <DashLayout>
        {loading ? (
          <Spinner />
        ) : (
          <div className="min-h-screen p-2 flex flex-col">
            {/* top bar ---------------------------------------------------- */}
            <div className="flex justify-between items-center mb-2">
              <div className="flex gap-4">
                <TabButton
                  isActive={activeTab === "Library"}
                  onClick={() => handleTabSwitch("Library")}
                >
                  {t("Library")}
                </TabButton>
                <TabButton
                  isActive={activeTab === "BookIssue"}
                  onClick={() => handleTabSwitch("BookIssue")}
                >
                  {t("Book Issue")}
                </TabButton>
              </div>

              {activeTab === "Library" && (
                <ProtectedAction requiredPermission={PERMISSIONS.ADD_BOOK}>
                  <button
                    onClick={handleSidebarOpen}
                    className="flex items-center border border-gray-300 ps-5 py-0 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    <span className="mr-2 text-sm">{t("Add Book")}</span>
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-12 h-12 flex items-center justify-center">
                      <span className="text-3xl">+</span>
                    </div>
                  </button>
                </ProtectedAction>
              )}
            </div>

            {/* main area ---------------------------------------------------- */}
            <div className="flex-1">
              {activeTab === "Library" ? (
                <ProtectedSection
                  requiredPermission={PERMISSIONS.GET_ALL_BOOKS}
                  title="Library"
                >
                  <LibraryTab
                    page={page}
                    setPage={setPage}
                    limit={limit}
                    setLimit={setLimit}
                  />
                </ProtectedSection>
              ) : (
                <ProtectedSection
                  requiredPermission={PERMISSIONS.GET_ALL_ISSUE_BOOKS}
                  title="Book Issue"
                >
                  <BookIssueTab
                    handleSidebarOpen={handleSidebarOpen}
                    setEditIssueData={setEditIssueData}
                    page={page}
                    setPage={setPage}
                    limit={limit}
                    setLimit={setLimit}
                  />
                </ProtectedSection>
              )}
            </div>

            {/* drawer ------------------------------------------------------ */}
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
                  title="Add Library Book"
                >
                  <AddBook onClose={handleSidebarClose} />
                </ProtectedSection>
              ) : (
                <ProtectedSection
                  requiredPermission={PERMISSIONS.ADD_ISSUE_BOOK}
                  title="Add Issue Book"
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
