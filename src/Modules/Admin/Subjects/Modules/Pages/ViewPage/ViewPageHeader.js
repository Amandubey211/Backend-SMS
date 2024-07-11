import React, { useState, useEffect } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { FaCalendarAlt } from "react-icons/fa";
import { FaBan } from "react-icons/fa6";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useNavigate, useParams } from "react-router-dom";
import useDeletePage from "../../../../../../Hooks/AuthHooks/Staff/Admin/Page/useDeletePage"; // Adjust the import path as needed
import toast from "react-hot-toast";

const ViewPageHeader = ({ title, LastEdit, page }) => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const { cid, sid } = useParams();
  const { loading, error, success, deletePage } = useDeletePage();

  const handleEdit = () => {
    navigate(`/class/${cid}/${sid}/page/create_Page`, { state: { page } });
  };

  const handleDelete = async () => {
    await deletePage(page._id);
  };

  useEffect(() => {
    if (success) {
      navigate(`/class/${cid}/${sid}/page`);
    }
  }, [success, navigate, cid, sid]);

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
        <button
          className="flex items-center space-x-1 px-4 py-1 border rounded-md border-gray-300 text-gray-600 hover:bg-gray-100 transition"
          aria-label="Publish Assignment"
        >
          <FaBan aria-hidden="true" />
          <span>Publish</span>
        </button>
        <button
          onClick={handleEdit}
          className="flex items-center space-x-1 px-4 py-1 border rounded-md border-gray-300 text-green-600 hover:bg-gray-100 transition"
          aria-label="Edit Assignment"
        >
          <AiOutlineEdit aria-hidden="true" />
          <span>Edit</span>
        </button>
        <button
          className="flex items-center space-x-1 border rounded-full w-8 h-8 justify-center border-gray-300 text-gray-600 hover:bg-gray-100 transition relative"
          aria-label="More Options"
          onClick={() => setShowMenu(!showMenu)}
        >
          <HiOutlineDotsVertical aria-hidden="true" />
          {showMenu && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
              <button
                onClick={handleDelete}
                className="flex items-center space-x-2 px-4 py-2 hover:bg-red-100 w-full text-left"
                aria-label="Delete Page"
              >
                <AiOutlineDelete aria-hidden="true" className="text-red-600" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default ViewPageHeader;
