import React, { useState, useRef, useEffect, Suspense } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineBlock } from "react-icons/md";
import { BsPatchCheckFill } from "react-icons/bs";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { BsChat } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import Sidebar from "../../../../../../../Components/Common/Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import DeleteModal from "../../../../../../../Components/Common/DeleteModal";
import {
  deleteDiscussion,
  updateDiscussion,
} from "../../../../../../../Store/Slices/Admin/Class/Discussion/discussionThunks";

const DiscussionMessage = React.lazy(() =>
  import("../../DiscussionMessage/DiscussionMessage")
);

const Header = ({ discussion, refetchDiscussion }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isPublished, setIsPublished] = useState(discussion.publish);

  const navigate = useNavigate();
  const { cid, sid } = useParams();
  const menuRef = useRef(null);
  const dispatch = useDispatch();

  const { loading: deleteLoading, error: deleteError } = useSelector(
    (state) => state.admin.discussions
  );

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);

  const handleDeleteClick = () => {
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    await dispatch(deleteDiscussion({ discussionId: discussion._id }));
    navigate(`/class/${cid}/${sid}/discussions`);
    setModalOpen(false);
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

  const handlePublishToggle = async () => {
    const updatedData = {
      ...discussion,
      publish: !isPublished, // Toggle publish status
    };

    await dispatch(
      updateDiscussion({
        discussionId: discussion._id,
        discussionData: updatedData,
      })
    );
    setIsPublished(!isPublished); // Update local state if successful
    refetchDiscussion(); // Refetch discussion data after update
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
          <h1 className="text-lg font-semibold">{discussion.createdBy}</h1>
          <p className="text-sm text-green-600">Discussion</p>
        </div>
      </div>
      <div className="flex flex-col gap-1 items-end justify-center relative">
        <span className="text-sm text-gray-500">
          Due: {new Date(discussion.dueDate).toLocaleDateString()}
        </span>
        <div className="flex items-center space-x-4">
          <button
            className="flex items-center space-x-1 px-4 py-1 border rounded-md border-gray-300 text-gray-600 hover:bg-gray-100 transition"
            aria-label={
              isPublished ? "Unpublish Discussion" : "Publish Discussion"
            }
            onClick={handlePublishToggle}
          >
            {isPublished ? (
              <>
                <BsPatchCheckFill
                  aria-hidden="true"
                  className="text-green-600"
                />
                <span>Publish</span>
              </>
            ) : (
              <>
                <MdOutlineBlock aria-hidden="true" />
                <span>Unpublish</span>
              </>
            )}
          </button>
          <button
            className="flex items-center space-x-1 px-4 py-1 border rounded-md border-gray-300 text-green-600 hover:bg-gray-100 transition"
            aria-label="Edit Discussion"
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
            <HiOutlineDotsVertical aria-hidden="true" />
          </button>
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
            <Suspense fallback={<div>Loading...</div>}>
              {/* <DiscussionMessage /> */}
            </Suspense>
          </Sidebar>
        </div>
      </div>

      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDelete}
        title={discussion.title || "discussion"}
      />
    </div>
  );
};

export default Header;
