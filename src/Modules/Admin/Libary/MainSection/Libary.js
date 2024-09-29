// src/Modules/Admin/Libary/MainSection/LibraryAndBookIssue.js
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

const LibraryAndBookIssue = () => {
  const dispatch = useDispatch();
  const { books, bookIssues, loading } = useSelector(
    (state) => state.admin.library
  );

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Library");
  const [editIssueData, setEditIssueData] = useState(null);

  // Fetch books and book issues data on component mount
  useEffect(() => {
    if (!books.length) dispatch(fetchBooksThunk());
    if (!bookIssues.length) dispatch(fetchBookIssuesThunk());
  }, [dispatch, books.length, bookIssues.length]);

  // Sidebar controls
  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);

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
            <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose}>
              {activeTab === "Library" ? (
                <AddBook />
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
