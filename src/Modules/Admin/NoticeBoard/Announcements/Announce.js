import React, { useState, useEffect } from "react";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import Sidebar from "../../../../Components/Common/Sidebar";
import AddAnnouncement from "./AddAnnouncement";
import { MdQueryBuilder, MdExpandMore, MdExpandLess } from "react-icons/md";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import { baseUrl } from "../../../../config/Common";
import { useSelector } from "react-redux";
import { useDeleteNotice, useUpdateNotice } from "../../../../Hooks/AuthHooks/Staff/Admin/Notices/useNoticeActions";
import Modal from "react-modal";

const Announce = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [notices, setNotices] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isEditSidebarOpen, setEditSidebarOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    description: "",
    priority: "High priority",
  });

  const role = useSelector((store) => store.Auth.role);
  const { updateNotice } = useUpdateNotice();
  const { deleteNotice } = useDeleteNotice();

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    const token = localStorage.getItem(`${role}:token`);
    try {
      const response = await axios.get(`${baseUrl}/admin/all/notices`, {
        headers: {
          Authentication: token,
        },
      });
      if (response.data.success) {
        setNotices(response.data.notices);
      }
    } catch (error) {
      console.error("Failed to fetch notices", error);
    }
  };

  const filteredNotices = notices.filter((notice) =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);

  const handleEditSidebarOpen = (notice) => {
    setEditFormData({
      ...notice,
      startDate: new Date(notice.startDate).toISOString().split("T")[0],
      endDate: new Date(notice.endDate).toISOString().split("T")[0],
    });
    setEditSidebarOpen(true);
  };

  const handleEditSidebarClose = () => setEditSidebarOpen(false);

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditNotice = async () => {
    await updateNotice(editFormData._id, editFormData);
    setNotices(
      notices.map((notice) =>
        notice._id === editFormData._id ? editFormData : notice
      )
    );
    setEditSidebarOpen(false);
  };

  const handleDeleteNotice = (noticeId) => {
    setNoticeToDelete(noticeId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    await deleteNotice(noticeToDelete);
    setNotices(notices.filter((notice) => notice._id !== noticeToDelete));
    setDeleteModalOpen(false);
    setNoticeToDelete(null);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setNoticeToDelete(null);
  };

  return (
    <>
      <Layout title="Event">
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
              <button
                onClick={handleSidebarOpen}
                className="p-2 border border-red-300 rounded bg-pink-100 text-center flex justify-center items-center"
              >
                <span className="font-semibold bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
                  Add Notice
                </span>
              </button>
            </div>
            <div className="mt-5 rounded-lg overflow-auto">
              {filteredNotices.map((notice, index) => (
                <div key={notice._id} className="border">
                  <div
                    className={`cursor-pointer p-2 flex flex-col ${activeIndex === index ? 'bg-gray-100' : 'bg-white'}`}
                    onClick={() => toggleAccordion(index)}
                  >
                    <div className="flex gap-6 px-3 py-2">
                      <img
                        className="h-10 w-10 rounded"
                        src={notice.imageUrl || "https://cdn-icons-png.freepik.com/512/1060/1060360.png"}
                        alt="notice-image"
                      />
                      <div className="flex flex-col gap-3 mt-[-5px] flex-grow">
                        <h2 className="font-[500] text-[#4D4D4D]">{notice.title}</h2>
                        <div className="flex flex-row gap-[50px] text-xs">
                          <div className="flex flex-wrap justify-center items-center">
                            <MdQueryBuilder className="text-gray-400 text-xl" />
                            <span className="text-sm p-1 font-[400] text-[#7F7F7F]">
                              {new Date(notice.startDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="px-2 text-xs bg-pink-100 text-center flex justify-center items-center">
                            <span className={`${notice.priority === "High priority"
                                ? "font-semibold bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text"
                                : "text-blue-500 font-bold"
                              }`}>
                              {notice.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end items-center ml-auto gap-2">
                        <FiEdit
                          className="text-gray-400 text-xl cursor-pointer"
                          onClick={(e) => { e.stopPropagation(); handleEditSidebarOpen(notice); }}
                        />
                        <FiTrash2
                          className="text-gray-400 text-xl cursor-pointer"
                          onClick={(e) => { e.stopPropagation(); handleDeleteNotice(notice._id); }}
                        />
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
              ))}
            </div>
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={handleSidebarClose}
              title="Create New Notice"
            >
              <AddAnnouncement onSuccess={fetchNotices} onClose={handleSidebarClose} />
            </Sidebar>

            {/* Sidebar for editing notice */}
            <Sidebar
              isOpen={isEditSidebarOpen}
              onClose={handleEditSidebarClose}
              title="Edit Notice"
            >
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-4">Edit Notice</h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Event Name</label>
                  <input
                    type="text"
                    name="title"
                    value={editFormData.title}
                    onChange={handleEditChange}
                    className="mt-1 p-2 border rounded w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={editFormData.startDate}
                    onChange={handleEditChange}
                    className="mt-1 p-2 border rounded w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={editFormData.endDate}
                    onChange={handleEditChange}
                    className="mt-1 p-2 border rounded w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Notice Details</label>
                  <textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditChange}
                    className="mt-1 p-2 border rounded w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="radio"
                      name="priority"
                      value="High priority"
                      checked={editFormData.priority === "High priority"}
                      onChange={handleEditChange}
                      className="mr-2"
                    />
                    <span className="mr-4">High priority</span>
                    <input
                      type="radio"
                      name="priority"
                      value="Low priority"
                      checked={editFormData.priority === "Low priority"}
                      onChange={handleEditChange}
                      className="mr-2"
                    />
                    <span>Low priority</span>
                  </div>
                </div>
                <button
                  onClick={handleEditNotice}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded"
                >
                  Edit Changes
                </button>
              </div>
            </Sidebar>
          </div>
        </DashLayout>
      </Layout>

      {/* Modal for confirming delete */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={handleDeleteModalClose}
        style={{
          content: {
            position: "absolute",
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            transform: "translate(-50%, -50%)",
            background: "white",
            padding: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            borderRadius: "8px",
            width: "300px",
            textAlign: "center",
          },
          overlay: {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
        }}
      >
        <h2 style={{ marginBottom: "10px" }}>Confirm Delete</h2>
        <p style={{ marginBottom: "20px" }}>Are you sure you want to delete this notice?</p>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={confirmDelete}
            style={{
              background: "red",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Yes, Delete
          </button>
          <button
            onClick={handleDeleteModalClose}
            style={{
              background: "gray",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Announce;
