import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ProtectedAction from "../../../../../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../../../../../config/permission";

const CreateSyllabusHeader = ({ onSave, loading, isEditing }) => {
  const { t } = useTranslation("admModule");
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between p-2 pe-8 bg-white border-b border-gray-300 shadow-sm">
      <div className="flex items-center">
        <button
          aria-label={t("Go back")}
          onClick={() => navigate(-1)}
          className="mr-2 text-gray-600 text-2xl cursor-pointer"
        >
          <IoIosArrowBack aria-hidden="true" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">
          {isEditing ? t("Update Syllabus") : t("Create New Syllabus")}
        </h1>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border font-semibold rounded-md transition"
        >
          {t("Cancel")}
        </button>
        <ProtectedAction requiredPermission={PERMISSIONS.CREATE_SYLLABUS}>
          <button
            type="button"
            onClick={onSave}
            className="flex-grow rounded-md py-2 px-4 text-center bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 transition"
            disabled={loading}
          >
            {loading ? (
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-indigo-500">
                {isEditing ? t("Updating...") : t("Saving....")}
              </span>
            ) : (
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-indigo-500">
                {isEditing ? t("Update Syllabus") : t("Submit Syllabus")}
              </span>
            )}
          </button>
        </ProtectedAction>
      </div>
    </div>
  );
};

export default CreateSyllabusHeader;
