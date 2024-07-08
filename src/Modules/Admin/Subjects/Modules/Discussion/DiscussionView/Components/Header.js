import React, { useState, useRef, useEffect } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { FaBan } from "react-icons/fa6";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { BsChat } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import Sidebar from "../../../../../../../Components/Common/Sidebar";
import DiscussionMessage from "../../DiscussionMessage/DiscussionMessage";
import { useNavigate, useParams } from "react-router-dom";
import useDeleteDiscussion from "../../../../../../../Hooks/AuthHooks/Staff/Admin/Disscussion/useDeleteDiscussion";

const Header = ({ discussion }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { cid, sid } = useParams();
  const menuRef = useRef(null);
  const { deleteDiscussion, loading: deleteLoading, error: deleteError, success: deleteSuccess } = useDeleteDiscussion();

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);

  const handleDeleteClick = async () => {
    await deleteDiscussion(discussion._id);
    if (deleteSuccess) {
      navigate(`/class/${cid}/${sid}/discussions`);
    }
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className="flex items-end justify-between p-2 px-4 border-b">
      <div className="flex items-center">
        <img
          src="https://avatars.githubusercontent.com/u/109097090?v=4"
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
        <div className="ml-3">
          <h1 className="text-lg font-semibold">{discussion.createdBy}</h1>
          <p className="text-sm text-green-600">Discussion</p>
        </div>
      </div>
      <div className="flex flex-col gap-1 items-end justify-center relative">
        <span className="text-sm text-gray-500">
          Due: {new Date(discussion.dueDate).toLocaleDateString()}
        </span>
        <div className="flex items-center space-x-4">
          <div className="flex justify-center gap-2 items-center w-full p-2 text-gray-700">
            <button
              className="flex items-center space-x-1 px-4 py-1 border rounded-md border-gray-300 text-gray-600 hover:bg-gray-100 transition"
              aria-label="Publish Assignment"
            >
              <FaBan aria-hidden="true" />
              <span>Publish</span>
            </button>
            <button
              className="flex items-center space-x-1 px-4 py-1 border rounded-md border-gray-300 text-green-600 hover:bg-gray-100 transition"
              aria-label="Edit Assignment"
              onClick={() =>
                navigate(`/class/${cid}/${sid}/create_discussion`, {
                  state: { discussion },
                })
              }
            >
              <AiOutlineEdit aria-hidden="true" />
              <span>Edit</span>
            </button>
            <button
              className="flex items-center space-x-1 border rounded-full w-8 h-8 justify-center border-gray-300 text-gray-600 hover:bg-gray-100 transition"
              aria-label="More Options"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <HiOutlineDotsVertical aria-hidden="true" className="" />
            </button>
          </div>
          {isMenuOpen && (
            <div
              ref={menuRef}
              className="absolute right-0 top-full mt-2 w-40 bg-white border rounded-md shadow-lg z-10"
            >
              <button
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-gray-100 w-full"
                onClick={handleDeleteClick}
                disabled={deleteLoading}
              >
                <MdDelete aria-hidden="true" />
                <span>Delete</span>
              </button>
              {deleteError && (
                <p className="text-red-500 text-sm px-4">{deleteError}</p>
              )}
            </div>
          )}
          <button
            onClick={handleSidebarOpen}
            className="px-4 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white items-center rounded-md flex gap-2"
          >
            <BsChat /> <span>Discussion</span>
          </button>

          <Sidebar
            width="70%"
            title="Discussion"
            isOpen={isSidebarOpen}
            onClose={handleSidebarClose}
          >
            <DiscussionMessage />
          </Sidebar>
        </div>
      </div>
    </div>
  );
};

export default Header;
