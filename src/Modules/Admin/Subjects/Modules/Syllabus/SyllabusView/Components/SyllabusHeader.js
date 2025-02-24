import React, { useState } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { RiDeleteBin5Line } from "react-icons/ri";
import DeleteModal from "../../../../../../../Components/Common/DeleteModal";
import { useTranslation } from "react-i18next";
import ProtectedAction from "../../../../../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../../../../../config/permission";

const SyllabusHeader = ({ onEditClick, onDeleteClick, syllabus }) => {
  const { t } = useTranslation("admModule");
  const [isModalOpen, setModalOpen] = useState(false);

  const handleDeleteClick = () => {
    setModalOpen(true); // Open the delete confirmation modal
  };

  return (
    <div className="flex items-center justify-between py-2 border-b">
      <h1 className="text-lg font-semibold">{t("Subject Syllabus")}</h1>
      <div className="flex gap-2  items-center">
        <ProtectedAction requiredPermission={PERMISSIONS.EDIT_SYLLABUS}>
          <button
            className="flex items-center space-x-1 px-4 py-1 border rounded-md border-gray-300 text-green-600 hover:bg-gray-100 transition"
            aria-label={t("Edit Syllabus")}
            onClick={onEditClick}
          >
            <AiOutlineEdit aria-hidden="true" />
            <span>{t("Edit")}</span>
          </button>
        </ProtectedAction>

        <ProtectedAction requiredPermission={PERMISSIONS.DELETE_SYLLABUS}>
          <button
            className="flex items-center space-x-1 px-4 py-1 border rounded-md border-gray-300 text-red-600 hover:bg-gray-100 transition"
            aria-label={t("Delete Syllabus")}
            onClick={handleDeleteClick}
          >
            <RiDeleteBin5Line aria-hidden="true" />
            <span>{t("Delete")}</span>
          </button>
        </ProtectedAction>
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
