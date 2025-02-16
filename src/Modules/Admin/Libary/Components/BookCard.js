import React, { useState } from "react";
import ReactDOM from "react-dom"; // Import for portal usage
import { useDispatch, useSelector } from "react-redux";
import { FiEdit, FiTrash2 } from "react-icons/fi"; // Icons for edit and delete
import EditBook from "./EditBook";
import { deleteBookThunk } from "../../../../Store/Slices/Admin/Library/LibraryThunks";
import Sidebar from "../../../../Components/Common/Sidebar";
import DeleteModal from "../../../../Components/Common/DeleteModal";
import { useTranslation } from "react-i18next";
import ProtectedAction from "../../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../../config/permission";

const BookCard = ({ book }) => {
  const { t } = useTranslation("admLibrary");
  // Destructure properties from book. If TotalCopies is missing, we'll fallback later.
  const {
    _id,
    name,
    author,
    category,
    className,
    copies,
    image,
    issuedCount,
    TotalCopies, // This is expected from your API (case sensitive)
  } = book;
  const dispatch = useDispatch();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const role = useSelector((store) => store.common.auth.role);

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);

  const handleDeleteModalOpen = () => setDeleteModalOpen(true);
  const handleDeleteModalClose = () => setDeleteModalOpen(false);

  const handleDelete = async () => {
    dispatch(deleteBookThunk(_id));
  };

  return (
    <>
      <div
        className="border p-2 bg-white rounded-lg shadow capitalize overflow-hidden relative 
       hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
      >
        <div className="w-full h-40 flex">
          <img
            src={image}
            alt={name}
            className="w-[65%] h-full object-cover rounded-md"
          />
          <div className="flex flex-col p-2 space-y-1">
            <span className="font-semibold text-[#7F7F7F] text-sm">
              {t("Class")}: {className}
            </span>
            <span className="text-sm font-semibold text-gray-700">
              {t("Total Copies")}: {TotalCopies ?? 0}
            </span>
            <span className="text-sm font-semibold text-gray-700">
              {t("Issued")}: {issuedCount}
            </span>
            <span className="text-sm font-semibold text-gray-700">
              {t("Remaining")}: {copies}
            </span>
          </div>
        </div>
        <div className="relative p-4">
          <h3 className="text-lg font-bold text-[#333333]">{name}</h3>
          <p className="text-base font-semibold">{category}</p>
          <div className="flex gap-2">
            <p className="text-sm font-medium text-gray-500">
              {t("Author")}:{" "}
            </p>
            <p className="text-sm font-medium text-gray-600">{author}</p>
          </div>
          {role !== "teacher" && (
            <div className="absolute right-2 bottom-2 flex gap-3">
              <ProtectedAction requiredPermission={PERMISSIONS.EDIT_BOOK}>
                <button
                  onClick={handleSidebarOpen}
                  className="text-indigo-600 hover:text-indigo-900"
                  aria-label={t("Edit")}
                >
                  <FiEdit className="w-6 h-6" />
                </button>
              </ProtectedAction>
              <ProtectedAction requiredPermission={PERMISSIONS.REMOVE_BOOK}>
                <button
                  onClick={handleDeleteModalOpen}
                  className="text-red-600 hover:text-red-900"
                  aria-label={t("Delete")}
                >
                  <FiTrash2 className="w-6 h-6" />
                </button>
              </ProtectedAction>
            </div>
          )}
        </div>
      </div>

      {/* Render Sidebar in a Portal */}
      {isSidebarOpen &&
        ReactDOM.createPortal(
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={handleSidebarClose}
            title={t("Edit Book")}
          >
            <EditBook book={book} onClose={handleSidebarClose} />
          </Sidebar>,
          document.body
        )}

      {/* Render DeleteModal in a Portal */}
      {isDeleteModalOpen &&
        ReactDOM.createPortal(
          <DeleteModal
            isOpen={isDeleteModalOpen}
            onClose={handleDeleteModalClose}
            onConfirm={handleDelete}
            title={name}
          />,
          document.body
        )}
    </>
  );
};

export default BookCard;
