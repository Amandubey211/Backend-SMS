import React, { useState, useRef, useEffect } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { RiDeleteBin5Line } from "react-icons/ri";
import DeleteModal from "../../../../../../../Components/Common/DeleteModal";
import { useTranslation } from "react-i18next";
import ProtectedAction from "../../../../../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../../../../../config/permission";

const SyllabusHeader = ({ onEditClick, onDeleteClick, syllabus }) => {
  const { t } = useTranslation("admModule");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const menuRef = useRef(null);

  const handleDeleteClick = () => {
    setModalOpen(true); // Open the delete confirmation modal
  };

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

  return (
    <div className="flex items-center justify-between ps-4 border-b">
      <h1 className="text-lg font-semibold">{t("Subject Syllabus")}</h1>
      <div className="flex gap-1 items-end justify-center relative">
        <div className="flex justify-center gap-2 items-center w-full p-2 text-gray-700">
          <ProtectedAction requiredPermission={PERMISSIONS.EDIT_SYLLABUS}>
            <button
              className="flex items-center space-x-1 px-4 py-1 border rounded-md border-gray-300 text-green-600 hover:bg-gray-100 transition"
              aria-label={t("Edit Assignment")}
              onClick={onEditClick}
            >
              <AiOutlineEdit aria-hidden="true" />
              <span>{t("Edit")}</span>
            </button>
          </ProtectedAction>
          <ProtectedAction requiredPermission={PERMISSIONS.DELETE_SYLLABUS}>
            <button
              className="flex items-center space-x-1 border rounded-full w-8 h-8 justify-center border-gray-300 text-gray-600 hover:bg-gray-100 transition"
              aria-label={t("More Options")}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <HiOutlineDotsVertical aria-hidden="true" />
            </button>
          </ProtectedAction>
          {menuOpen && (
            <div
              ref={menuRef}
              className="absolute right-0 top-10 w-48 bg-white border rounded shadow-md"
            >
              <button
                className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                onClick={handleDeleteClick}
              >
                <RiDeleteBin5Line className="mr-2 text-red-700" />
                <span>{t("Delete")}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => {
          onDeleteClick(syllabus._id);
          setModalOpen(false);
        }}
        title={syllabus?.title || t("this syllabus")}
      />
    </div>
  );
};

export default SyllabusHeader;
