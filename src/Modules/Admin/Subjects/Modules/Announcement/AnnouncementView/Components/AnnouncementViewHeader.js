import React, { useState, useRef, useEffect } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { BsChat } from "react-icons/bs";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../../../../../../../Components/Common/Sidebar";
import DeleteModal from "../../../../../../../Components/Common/DeleteModal";
import AnnouncementCommentSection from "../AnnouncementMessage/AnnouncementCommentSection";
import { deleteAnnouncement } from "../../../../../../../Store/Slices/Admin/Class/Announcement/announcementThunk";
import { FaUserCircle } from "react-icons/fa";
import ProtectedAction from "../../../../../../../Routes/ProtectedRoutes/ProtectedAction";

const AnnouncementViewHeader = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const { cid, sid, did: announcementId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { announcement, loading: deleteLoading } = useSelector(
    (state) => state.admin.announcements
  );

  const menuButtonRef = useRef(null);
  const menuRef = useRef(null);

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleClickOutside = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      !menuButtonRef.current.contains(event.target)
    ) {
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
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    await dispatch(deleteAnnouncement(announcement._id));
    setModalOpen(false);
  };

  return (
    <div className="flex items-center justify-between p-2 px-4 border-b">
      <div className="flex items-center">
        {/* {announcement?.authorUrl ? (
          <img
            src={announcement.authorUrl}
            alt={`${announcement.authorName || "Author"}'s Profile`}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <FaUserCircle
            className="w-12 h-12 text-gray-400"
            aria-label="Default Profile Icon"
          />
        )} */}

        <div className="ml-3">
          <h1 className="text-lg font-semibold">
            {announcement?.title || "Announcement Title"}
          </h1>
          <p className="text-sm text-green-600">
            {announcement?.author || "Author Name"}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 justify-center relative">
        <div className="flex gap-2 items-center">
          <div className="text-sm flex items-center gap-1 pr-2 border-r">
            <span className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full h-6 w-6 flex items-center justify-center text-white">
              <span className="text-gradient text-xs font-semibold">
                {announcement?.replies?.length || 0}
              </span>
            </span>
            <span>Comments</span>
          </div>

          <span className="text-sm pr-2 border-r">
            For: {announcement?.postTo || "Everyone"}
          </span>
          <span className="text-sm">
            Posted on: {formatDate(announcement?.createdAt) || "Date"}
          </span>
        </div>
        <div className="flex items-center gap-2 justify-end relative">
          <ProtectedAction requiredPermission="edit Announcment">
            <button
              className="flex items-center space-x-1 px-4 py-2 border rounded-md border-gray-300 text-green-600 hover:bg-gray-100 transition"
              aria-label="Edit Announcement"
              onClick={handleEditClick}
            >
              <AiOutlineEdit aria-hidden="true" />
              <span>Edit</span>
            </button>
          </ProtectedAction>
          <ProtectedAction requiredPermission="delete Announcment">
            <div className="relative">
              <button
                className="flex items-center space-x-1 border rounded-md p-2 justify-center border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                aria-label="More Options"
                onClick={toggleMenu}
                ref={menuButtonRef}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
              >
                <HiOutlineDotsVertical
                  aria-hidden="true"
                  className="text-2xl"
                />
              </button>
              {menuOpen && (
                <div
                  ref={menuRef}
                  className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-10"
                  style={{ top: "100%", right: "0" }}
                  role="menu"
                  aria-label="Options"
                >
                  <button
                    className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                    onClick={handleDeleteClick}
                    disabled={deleteLoading}
                    role="menuitem"
                  >
                    <RiDeleteBin5Line className="mr-2 text-red-700" />
                    <span>{deleteLoading ? "Deleting..." : "Delete"}</span>
                  </button>
                </div>
              )}
            </div>
          </ProtectedAction>

          <ProtectedAction requiredPermission="View Announcment Comments">
            <button
              onClick={handleSidebarOpen}
              className="px-4 py-2 bg-gradient-to-r w-full from-pink-500 to-purple-500 text-white items-center rounded-md flex gap-2"
            >
              <BsChat /> <span> View Comments</span>
            </button>
          </ProtectedAction>

          <Sidebar
            width="70%"
            title="Announcement"
            isOpen={isSidebarOpen}
            onClose={handleSidebarClose}
          >
            <AnnouncementCommentSection />
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
