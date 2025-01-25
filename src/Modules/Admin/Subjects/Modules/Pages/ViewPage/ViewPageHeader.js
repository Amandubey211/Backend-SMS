import React, { useState, useEffect, useRef } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { FaCalendarAlt } from "react-icons/fa";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { BsPatchCheckFill } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import toast from "react-hot-toast";
import Spinner from "../../../../../../Components/Common/Spinner";
import NoDataFound from "../../../../../../Components/Common/NoDataFound";
import DeleteModal from "../../../../../../Components/Common/DeleteModal";
import { MdOutlineBlock } from "react-icons/md";
import {
  deletePage,
  updatePage,
} from "../../../../../../Store/Slices/Admin/Class/Page/pageThunk";
import ProtectedAction from "../../../../../../Routes/ProtectedRoutes/ProtectedAction";

const ViewPageHeader = ({ title, LastEdit, page, refetchPage }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isPublished, setIsPublished] = useState(page.publish); // State for publish status
  const menuRef = useRef(null); // Reference for the menu
  const navigate = useNavigate();
  const { cid, sid } = useParams();
  const dispatch = useDispatch();

  const {
    loading: deleteLoading,
    error: deleteError,
    success: deleteSuccess,
  } = useSelector((state) => state.admin.pages);

  const handleEdit = () => {
    navigate(`/class/${cid}/${sid}/page/create_Page`, { state: { page } });
  };

  const handleDeleteClick = () => {
    setModalOpen(true); // Open the delete confirmation modal
  };

  const handleConfirmDelete = async () => {
    await dispatch(deletePage({ pid: page._id }));
    if (!deleteError) {
      toast.success("Page deleted successfully!");
      navigate(`/class/${cid}/${sid}/page`);
    } else {
      toast.error("Failed to delete the page.");
    }
  };

  const handlePublishToggle = async () => {
    const updatedData = {
      ...page,
      publish: !isPublished, // Toggle publish status
    };

    const success = await dispatch(
      updatePage({ pageId: page._id, pageData: updatedData })
    );
    if (success) {
      setIsPublished(!isPublished); // Update local state if successful
      // refetchPage(); // Refetch page data after update
    } else {
      toast.error("Failed to update the page.");
    }
  };

  // Effect to handle clicks outside the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div className="flex justify-between items-end p-4 border-b">
      <div className="w-full">
        <h2 className="text-xl font-semibold mb-1">{title}</h2>
        <div className="flex items-center w-60 text-gray-500">
          <span className="text-green-600 font-medium mr-2">Page</span>
          <span className="mx-2">|</span>
          <FaCalendarAlt className="w-4 h-4 mr-2" />
          <span className="text-sm">
            Last Edit: {new Date(LastEdit).toLocaleDateString() || "N/A"}
          </span>
        </div>
      </div>

      <div className="relative flex justify-end gap-2 items-center w-full p-2 text-gray-700">
        <ProtectedAction requiredPermission="Update page">
          <button
            className="flex items-center space-x-1 px-4 py-1 border rounded-md border-gray-300 text-gray-600 hover:bg-gray-100 transition"
            aria-label={isPublished ? "Unpublish Page" : "Publish Page"}
            onClick={handlePublishToggle}
            disabled={deleteLoading}
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
        </ProtectedAction>

        <ProtectedAction requiredPermission="Update page">
          <button
            onClick={handleEdit}
            className="flex items-center space-x-1 px-4 py-1 border rounded-md border-gray-300 text-green-600 hover:bg-gray-100 transition"
            aria-label="Edit Page"
          >
            <AiOutlineEdit aria-hidden="true" />
            <span>Edit</span>
          </button>
        </ProtectedAction>
        <ProtectedAction requiredPermission="delete page">
          <button
            className="flex items-center space-x-1 border rounded-full w-8 h-8 justify-center border-gray-300 text-gray-600 hover:bg-gray-100 transition relative"
            aria-label="More Options"
            onClick={() => setShowMenu(!showMenu)}
          >
            <HiOutlineDotsVertical aria-hidden="true" />
            {showMenu && (
              <div
                ref={menuRef} // Attach ref to menu
                className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg"
              >
                <button
                  onClick={handleDeleteClick}
                  className="flex items-center space-x-2 px-4 py-2 hover:bg-red-100 w-full text-left"
                  aria-label="Delete Page"
                >
                  <AiOutlineDelete
                    aria-hidden="true"
                    className="text-red-600"
                  />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </button>
        </ProtectedAction>
      </div>

      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={page.title}
      />

      {deleteLoading && <Spinner />}
      {deleteError && <NoDataFound />}
    </div>
  );
};

export default ViewPageHeader;
