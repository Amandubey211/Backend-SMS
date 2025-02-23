import React, { useState, useEffect } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { FaCalendarAlt } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Spinner from "../../../../../../Components/Common/Spinner";
import NoDataFound from "../../../../../../Components/Common/NoDataFound";
import DeleteModal from "../../../../../../Components/Common/DeleteModal";
import {
  deletePage,
  updatePage,
} from "../../../../../../Store/Slices/Admin/Class/Page/pageThunk";
import ProtectedAction from "../../../../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../../../../config/permission";
import { Tag, Tooltip } from "antd"; // Using Ant Design for Tag & Tooltip

const ViewPageHeader = ({ title, LastEdit, page, refetchPage }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isPublished, setIsPublished] = useState(page.publish);
  const navigate = useNavigate();
  const { cid, sid } = useParams();
  const dispatch = useDispatch();

  const { loading: deleteLoading, error: deleteError } = useSelector(
    (state) => state.admin.pages
  );

  const handleEdit = () => {
    navigate(`/class/${cid}/${sid}/page/create_Page`, { state: { page } });
  };

  const handleDeleteClick = () => {
    setModalOpen(true);
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
      publish: !isPublished,
    };

    const success = await dispatch(
      updatePage({ pageId: page._id, pageData: updatedData })
    );
    if (success) {
      setIsPublished(!isPublished);
    } else {
      toast.error("Failed to update the page.");
    }
  };

  return (
    <div className="p-4 border-b">
      <div className="flex flex-col md:flex-row justify-between items-center">
        {/* Left Section: Title with Badge and Last Edit Info */}
        <div className="flex flex-col">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold mb-1">{title}</h2>
            <Tooltip
              title={
                isPublished
                  ? "This page is published"
                  : "This page is not published"
              }
            >
              <Tag className="ml-2" color={isPublished ? "green" : "red"}>
                {isPublished ? "Published" : "Unpublished"}
              </Tag>
            </Tooltip>
          </div>
          <div className="flex items-center text-gray-500">
            <FaCalendarAlt className="w-4 h-4 mr-1" />
            <span className="text-sm">
              Last Edit: {new Date(LastEdit).toLocaleDateString() || "N/A"}
            </span>
          </div>
        </div>

        {/* Right Section: Edit and Delete Buttons */}
        <div className="flex gap-2 mt-4 md:mt-0">
          <ProtectedAction requiredPermission={PERMISSIONS.UPDATE_PAGE}>
            <button
              onClick={handleEdit}
              className="flex items-center space-x-1 px-4 py-1 border rounded-md border-gray-300 text-green-600 hover:bg-gray-100 transition"
              aria-label="Edit Page"
            >
              <AiOutlineEdit aria-hidden="true" />
              <span>Edit</span>
            </button>
          </ProtectedAction>
          <ProtectedAction requiredPermission={PERMISSIONS.DELETE_PAGE}>
            <button
              onClick={handleDeleteClick}
              className="flex items-center space-x-1 px-4 py-1 border rounded-md border-gray-300 text-red-600 hover:bg-red-100 transition"
              aria-label="Delete Page"
            >
              <AiOutlineDelete aria-hidden="true" />
              <span>Delete</span>
            </button>
          </ProtectedAction>
          {/*
          <ProtectedAction requiredPermission={PERMISSIONS.UPDATE_PAGE}>
            <button
              className="flex items-center space-x-1 px-4 py-1 border rounded-md border-gray-300 text-gray-600 hover:bg-gray-100 transition"
              aria-label={isPublished ? "Unpublish Page" : "Publish Page"}
              onClick={handlePublishToggle}
              disabled={deleteLoading}
            >
              {isPublished ? (
                <>
                  <MdOutlineBlock aria-hidden="true" />
                  <span>Unpublish</span>
                </>
              ) : (
                <>
                  <BsPatchCheckFill aria-hidden="true" className="text-green-600" />
                  <span>Publish</span>
                </>
              )}
            </button>
          </ProtectedAction>
          */}
        </div>
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
