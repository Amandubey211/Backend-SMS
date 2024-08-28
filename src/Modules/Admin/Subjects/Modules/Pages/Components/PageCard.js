import React, { useState } from "react";
import {
  IoCalendarOutline,
  IoBookOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import { NavLink, useParams } from "react-router-dom";
import useDeletePage from "../../../../../../Hooks/AuthHooks/Staff/Admin/Page/useDeletePage"; // Adjust the import path as needed
import DeleteModal from "../../../../../../Components/Common/DeleteModal";
import Spinner from "../../../../../../Components/Common/Spinner";

const PageCard = ({
  title,
  authorName,
  publishDate,
  updateDate,
  id,
  profile,
  publish,
  onDeleteSuccess,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { cid, sid } = useParams();
  const { loading, error, success, deletePage } = useDeletePage();

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDelete = async () => {
    await deletePage(id);

    onDeleteSuccess(); // Refetch the pages after successful deletion
    setIsModalOpen(false);
  };

  const openDeleteModal = () => {
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative max-w-xs bg-white rounded-lg border flex flex-col justify-between transition-shadow duration-300 hover:shadow-lg group">
      <NavLink to={`/class/${cid}/${sid}/page/${id}/view`}>
        <div className="flex justify-center p-3">
          <IoBookOutline className="text-green-500 h-24 w-24" />
        </div>
        <div className="text-center mb-4 mt-2">
          <h2 className="font-semibold">{title}</h2>
          <div className="flex items-center justify-center mt-2">
            {profile ? (
              <img
                className="h-7 w-7 rounded-full"
                src={profile}
                alt={authorName}
              />
            ) : (
              <CiUser className="h-6 w-6" />
            )}

            <span className="ml-2 text-gray-700">{authorName}</span>
          </div>
        </div>
      </NavLink>
      <div className="flex justify-between items-center text-sm text-gray-600 rounded-b-lg p-4 bg-gray-50">
        <div className="flex flex-col items-start">
          <div className="flex items-center">
            <IoCalendarOutline className="mr-1" />
            {publish ? <span>Publish</span> : <span>Unpublish</span>}
          </div>
          <div className="text-lg text-gray-600 capitalize">
            <span>{formatDate(publishDate)}</span>
          </div>
        </div>
        <div className="flex flex-col items-start">
          <div className="flex items-center">
            <IoCalendarOutline className="mr-1" />
            <span>Update</span>
          </div>
          <div className="text-lg text-gray-600 capitalize">
            <span>{formatDate(updateDate)}</span>
          </div>
        </div>
      </div>
      <div
        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        onClick={openDeleteModal}
      >
        <IoTrashOutline className="h-5 w-5" />
      </div>
      {loading && <Spinner />}
      {error && (
        <p className="absolute top-2 left-2 text-sm text-red-500">{error}</p>
      )}
      <DeleteModal
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title={title}
      />
    </div>
  );
};

export default PageCard;
