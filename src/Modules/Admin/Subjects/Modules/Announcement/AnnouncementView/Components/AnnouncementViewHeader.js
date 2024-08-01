import React, { useState, useRef, useEffect } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { BsChat } from "react-icons/bs";
import { RiDeleteBin5Line } from "react-icons/ri";
import Sidebar from "../../../../../../../Components/Common/Sidebar";
import DiscussionMessage from "../../../Discussion/DiscussionMessage/DiscussionMessage";
import { useParams, useNavigate } from "react-router-dom";
import useDeleteAnnouncement from "../../../../../../../Hooks/AuthHooks/Staff/Admin/Announcement/useDeleteAnnouncement";
import DeleteModal from "../../../../../../../Components/Common/DeleteModal";

const AnnouncementViewHeader = ({ announcement }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false); // State for modal
  const { cid, sid } = useParams();
  const navigate = useNavigate();
  const { deleteAnnouncement, loading: deleteLoading } =
    useDeleteAnnouncement();
  const menuRef = useRef(null);

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleEditClick = () => {
    navigate(`/class/${cid}/${sid}/announcements/create_announcement`, {
      state: { announcement },
    });
  };

  const handleDeleteClick = () => {
    setModalOpen(true); // Open the modal on delete click
  };

  const confirmDelete = async () => {
    await deleteAnnouncement(announcement._id);
    setModalOpen(false); // Close the modal after deletion
  };

  return (
    <div className="flex items-end justify-between p-2 px-4 border-b">
      <div className="flex items-center">
        <img
          src="https://avatars.githubusercontent.com/u/109097090?v=4"
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
        <div className="ml-3">
          <h1 className="text-lg font-semibold">
            {announcement?.title || "Announcement Title"}
          </h1>
          <p className="text-sm text-green-600">
            {announcement?.author || "Author Name"}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-1 justify-center relative">
        <div className="flex gap-2 items-center ">
          <div className="text-sm flex items-center gap-1 pr-2 border-r">
            <span className="bg-gradient-to-r from-purple-100 rounded-full px-1 gap-1 to-pink-100 text-white">
              <span className="text-gradient text-xs font-semibold">
                {announcement?.replies?.length || 0}
              </span>
            </span>{" "}
            <span>Comments</span>
          </div>
          <span className="text-sm pr-2 border-r">
            For: {announcement?.postTo || "Everyone"}
          </span>
          <span className="text-sm">
            Posted on: {formatDate(announcement?.createdAt) || "Date"}
          </span>
        </div>
        <div className="flex items-center gap-2 justify-center">
          <button
            className="flex items-center space-x-1 px-4 py-2 border rounded-md border-gray-300 text-green-600 hover:bg-gray-100 transition"
            aria-label="Edit Announcement"
            onClick={handleEditClick}
          >
            <AiOutlineEdit aria-hidden="true" />
            <span>Edit</span>
          </button>
          <button
            className="flex items-center space-x-1 border rounded-full w-8 h-8 justify-center border-gray-300 text-gray-600 hover:bg-gray-100 transition"
            aria-label="More Options"
            onClick={toggleMenu}
          >
            <HiOutlineDotsVertical aria-hidden="true" />
          </button>
          {menuOpen && (
            <div
              ref={menuRef}
              className="absolute right-0 mt-10 w-48 bg-white border rounded shadow-md"
            >
              <button
                className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                onClick={handleDeleteClick} // Open the modal instead of deleting directly
                disabled={deleteLoading}
              >
                <RiDeleteBin5Line className="mr-2 text-red-700" />
                <span>{deleteLoading ? "Deleting..." : "Delete"}</span>
              </button>
              {/* Add more menu items here if needed */}
            </div>
          )}
          <button
            onClick={handleSidebarOpen}
            className="px-4 py-2 bg-gradient-to-r w-full from-pink-500 to-purple-500 text-white items-center rounded-md flex gap-2"
          >
            <BsChat /> <span> View Comments</span>
          </button>
          <Sidebar
            width="70%"
            title="Announcement"
            isOpen={isSidebarOpen}
            onClose={handleSidebarClose}
          >
            <div>will be added </div>
            {/* <DiscussionMessage /> */}
          </Sidebar>
        </div>
      </div>

      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDelete}
        title={announcement?.title || "this announcement"}
      />
    </div>
  );
};

export default AnnouncementViewHeader;
