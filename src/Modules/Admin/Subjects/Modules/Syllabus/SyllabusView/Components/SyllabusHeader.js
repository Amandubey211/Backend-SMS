import React, { useState } from "react";
import { AiOutlineEdit, AiOutlineArrowLeft } from "react-icons/ai";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import DeleteModal from "../../../../../../../Components/Common/DeleteModal";
import { useTranslation } from "react-i18next";
import ProtectedAction from "../../../../../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../../../../../config/permission";
import { setSelectedSyllabus } from "../../../../../../../Store/Slices/Admin/Class/Syllabus/syllabusSlice";

const SyllabusHeader = ({ onEditClick, onDeleteClick, syllabus }) => {
  const { t } = useTranslation("admModule");
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDeleteClick = () => {
    setModalOpen(true);
  };

  const handleNavigateBack = () => {
    navigate(-1);
  };

  const handleEditClick = () => {
    // Store the syllabus in Redux before calling onEditClick
    dispatch(setSelectedSyllabus(syllabus));
    onEditClick();
  };

  return (
    <div className="flex items-center justify-between py-2 border-b">
      <button
        className="flex items-center space-x-1 px-4 py-1 border rounded-md border-gray-300 text-gray-600 hover:bg-gray-100 transition"
        aria-label={t("Navigate Back")}
        onClick={handleNavigateBack}
      >
        <AiOutlineArrowLeft aria-hidden="true" />
        <span>{t("Back")}</span>
      </button>
      <h1 className="text-lg font-semibold capitalize">
        {t("Subject Syllabus")}
      </h1>
      <div className="flex gap-2 items-center">
        <ProtectedAction requiredPermission={PERMISSIONS.EDIT_SYLLABUS}>
          <button
            className="flex items-center space-x-1 px-4 py-1 border rounded-md border-gray-300 text-green-600 hover:bg-gray-100 transition"
            aria-label={t("Edit Syllabus")}
            onClick={handleEditClick}
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
