import React, { useEffect, useState } from "react";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import { AiOutlineSearch } from "react-icons/ai";
import Spinner from "../../../../Components/Common/Spinner";
import NoDataFound from "../../../../Components/Common/NoDataFound";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNoticesThunk,
  deleteNoticeThunk,
} from "../../../../Store/Slices/Admin/NoticeBoard/Notice/noticeThunks";
import AdminNoticeItem from "./AdminNoticeItem";
import { FiPlus } from "react-icons/fi";
import DeleteModal from "../../../../Components/Common/DeleteModal";
import AddNotice from "./AddNotice";
import Sidebar from "../../../../Components/Common/Sidebar";
import {
  resetEditMode,
  setEditMode,
  setSelectedNotice,
  setTitleToDelete,
  resetTitleToDelete,
} from "../../../../Store/Slices/Admin/NoticeBoard/Notice/noticeSlice";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";

const AdminNotice = () => {
  const { loading, error, notices, editMode, titleToDelete } = useSelector(
    (store) => store.admin.notice
  );
  const role = useSelector((store) => store.common.auth.role);
  const dispatch = useDispatch();

  const [isSidebarOpen, setSidebarOpen] = useState(false); // Sidebar state
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false); // Delete modal state
  const [noticeToDelete, setNoticeToDelete] = useState(null); // For storing the notice to delete
  const [activeIndex, setActiveIndex] = useState(null); // To control accordion behavior
  const [searchTerm, setSearchTerm] = useState(""); // Search term state

  useEffect(() => {
    dispatch(fetchNoticesThunk()); // Fetch all notices on component mount
  }, [dispatch]);

  const handleSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredNotices = notices?.filter((notice) =>
    notice.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setNoticeToDelete(null);
    dispatch(resetTitleToDelete()); // Reset title
  };

  const confirmDelete = async () => {
    await dispatch(deleteNoticeThunk(noticeToDelete)); // Dispatch delete thunk
    setDeleteModalOpen(false);
    setNoticeToDelete(null);
    dispatch(resetTitleToDelete()); // Reset title
  };

  const toggleAccordion = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
    dispatch(resetEditMode()); // Reset edit mode when sidebar is closed
  };

  const handleEditNotice = (notice) => {
    dispatch(setSelectedNotice(notice));
    dispatch(setEditMode(true));
    setSidebarOpen(true); // Open sidebar with edit mode
  };
  useNavHeading(role, "Notices");
  return (
    <Layout title=" Notice | Student diwan">
      <DashLayout>
        <div className="p-5">
          <h1 className="bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text font-semibold">
            {role === "admin" && "Admin Notice Board"}
            {role === "librarian" && "Librarian Notice Board"}
            {role === "teacher" && "Teacher Notice Board"}
            {role === "staff" && "Staff Notice Board"}
            {role === "accountant" && "Accountant Notice Board"}
          </h1>


          {/* Search Bar */}
          <div className="flex p-2 justify-between">
            <div className="flex gap-4">
              <div className="relative flex items-center">
                <AiOutlineSearch className="absolute left-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by Notice"
                  value={searchTerm} // Controlled search term input
                  onChange={handleSearchTerm}
                  className="p-2 pl-10 border rounded-md w-72 text-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-200"
                />
              </div>
            </div>
            <button
              className="flex items-center justify-center border border-transparent bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-300 transform hover:scale-105 hover:shadow-xl"
              onClick={() => setSidebarOpen(true)} // Open sidebar
            >
              <FiPlus className="mr-2" />
              Add Notice
            </button>
          </div>

          {/* Notices List */}
          <div className="mt-5">
            {loading ? (
              <Spinner />
            ) : error ? (
              <p>{error}</p>
            ) : filteredNotices.length > 0 ? (
              filteredNotices.map((notice, index) => (
                <AdminNoticeItem
                  key={notice._id}
                  notice={notice}
                  index={index}
                  activeIndex={activeIndex}
                  toggleAccordion={toggleAccordion}
                  handleEditNotice={handleEditNotice}
                  setDeleteModalOpen={setDeleteModalOpen}
                  setNoticeToDelete={setNoticeToDelete}
                  dispatch={dispatch} // Pass dispatch to set title for delete
                />
              ))
            ) : (
              <NoDataFound title="Notices" />
            )}
          </div>

          <Sidebar
            isOpen={isSidebarOpen}
            onClose={handleSidebarClose}
            title={editMode ? "Edit Notice" : "Add Notice"}
          >
            <AddNotice
              isEditing={editMode}
              onClose={handleSidebarClose} // Pass sidebar close handler
            />
          </Sidebar>

          {/* Delete confirmation modal */}
          <DeleteModal
            isOpen={isDeleteModalOpen}
            onClose={handleDeleteModalClose}
            onConfirm={confirmDelete}
            title={`${titleToDelete}`} // Use title from Redux state
          />
        </div>
      </DashLayout>
    </Layout>
  );
};

export default AdminNotice;
