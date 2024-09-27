import React, { useState, useEffect } from "react";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import Sidebar from "../../../../Components/Common/Sidebar";
import AddAnnouncement from "./AddAnnouncement";
import { MdQueryBuilder, MdExpandMore, MdExpandLess } from "react-icons/md";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { IoSearchCircleOutline, IoCalendarOutline } from "react-icons/io5"; // For no results placeholder
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAnnouncementsThunk,
  deleteAnnouncementThunk,
} from "../../../../Store/Slices/Admin/Announcement/announcementThunk";
import {
  setSelectedNotice,
  setEditMode,
  resetEditMode,
} from "../../../../Store/Slices/Admin/Announcement/announcementSlice";
import DeleteModal from "../../../../Components/Common/DeleteModal";

const Announce = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState(null); // For accordion behavior
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState(null);

  const dispatch = useDispatch();
  const { notices, editMode } = useSelector(
    (state) => state.admin.announcements
  );
  const role = useSelector((store) => store.common.auth.role);

  useEffect(() => {
    dispatch(fetchAnnouncementsThunk());
  }, [dispatch]);

  // Filter notices based on search term
  const filteredNotices = notices.filter((notice) =>
    notice.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle opening add announcement sidebar
  const handleSidebarOpen = () => {
    dispatch(resetEditMode()); // Reset edit mode to make sure data is cleared
    setSidebarOpen(true);
  };
  const handleSidebarClose = () => setSidebarOpen(false);

  // Handle opening edit sidebar
  const handleEditSidebarOpen = (notice) => {
    dispatch(setSelectedNotice(notice));
    dispatch(setEditMode(true));
    setSidebarOpen(true); // Open the sidebar
  };

  // Handle notice delete confirmation
  const handleDeleteNotice = (noticeId) => {
    setNoticeToDelete(noticeId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    await dispatch(deleteAnnouncementThunk(noticeToDelete));
    setDeleteModalOpen(false);
    setNoticeToDelete(null);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setNoticeToDelete(null);
  };

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      <Layout title="Announcement">
        <DashLayout>
          <div className="p-4">
            <h1 className="mb-2 bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent font-semibold bg-clip-text">
              Student Notice Board
            </h1>
            <div className="flex p-[10px] justify-between">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Search by Notice"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="p-2 border rounded w-[250px]"
                />
                <button className="border w-[100px] rounded bg-pink-100 text-center flex justify-center items-center">
                  <span className="font-semibold bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
                    Search
                  </span>
                </button>
              </div>
              {role === "admin" && (
                <button
                  onClick={handleSidebarOpen}
                  className="p-2 border border-red-300 rounded bg-pink-100 text-center flex justify-center items-center"
                >
                  <span className="font-semibold bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
                    Add Notice
                  </span>
                </button>
              )}
            </div>

            <div className="mt-5 rounded-lg overflow-auto">
              {filteredNotices.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-64">
                  <IoSearchCircleOutline className="text-6xl text-gray-400" />
                  <p className="mt-2 text-gray-500">No results found</p>
                </div>
              ) : (
                filteredNotices.map((notice, index) => (
                  <div key={notice._id} className="border mb-2">
                    <div
                      className={`cursor-pointer p-2 flex flex-col ${
                        activeIndex === index ? "bg-gray-100" : "bg-white"
                      }`}
                      onClick={() => toggleAccordion(index)}
                    >
                      <div className="flex gap-6 px-3 py-2">
                        <div className="h-16 w-16 flex justify-center items-center bg-blue-500 rounded-sm">
                          <img
                            className="h-10 w-10 "
                            src={
                              notice.imageUrl ||
                              "https://cdn-icons-png.freepik.com/512/1060/1060360.png"
                            }
                            alt="notice-image"
                          />
                        </div>

                        <div className="flex flex-col gap-3 mt-[-5px] flex-grow">
                          <h2 className="font-semibold text-xl ">
                            {notice.title}
                          </h2>
                          <div className="flex flex-row gap-4 text-xs">
                            <div className="flex flex-wrap justify-center items-center">
                              <IoCalendarOutline className="text-gray-400 text-lg" />
                              <span className="text-sm p-1 font-[400] text-[#7F7F7F]">
                                {new Date(notice.startDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                            <div
                              className={`px-4  ${
                                notice.priority === "High priority"
                                  ? "bg-pink-100 "
                                  : "bg-gray-100"
                              } text-xs rounded-full  text-center flex justify-center items-center`}
                            >
                              <span
                                className={`${
                                  notice.priority === "High priority"
                                    ? "font-semibold bg-gradient-to-r  from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text"
                                    : "text-gray-500"
                                }`}
                              >
                                {notice.priority}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end items-center ml-auto gap-2">
                          {role === "admin" && (
                            <>
                              <FiEdit
                                className="text-gray-400 text-xl cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditSidebarOpen(notice);
                                }}
                              />
                              <FiTrash2
                                className="text-gray-400 text-xl cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteNotice(notice._id);
                                }}
                              />
                            </>
                          )}
                          {activeIndex === index ? (
                            <MdExpandLess className="text-gray-400 text-xl cursor-pointer" />
                          ) : (
                            <MdExpandMore className="text-gray-400 text-xl cursor-pointer" />
                          )}
                        </div>
                      </div>
                    </div>
                    {activeIndex === index && (
                      <div className="p-2 text-[#4D4D4D]">
                        <p>{notice.description}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Sidebar for adding/updating notice */}
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={handleSidebarClose}
              title={editMode ? "Edit Notice" : "Add Notice"}
            >
              <AddAnnouncement
                isEditing={editMode}
                onClose={handleSidebarClose} // Pass sidebar close handler
              />
            </Sidebar>
          </div>
        </DashLayout>
      </Layout>

      {/* Delete confirmation modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={confirmDelete}
        title="Notice"
      />
    </>
  );
};

export default Announce;
