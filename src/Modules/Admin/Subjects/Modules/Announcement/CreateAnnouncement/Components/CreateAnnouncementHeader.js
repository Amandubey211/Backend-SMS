import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ProtectedAction from "../../../../../../../Routes/ProtectedRoutes/ProtectedAction";

const CreateAnnouncementHeader = ({ onSave, loading, isEditing }) => {
  const navigate = useNavigate();
  const { t } = useTranslation("admClass");

  return (
    <div className="flex items-center justify-between p-2 pe-5 bg-white border-b border-gray-300 shadow-sm">
      <div className="flex items-center">
        <IoIosArrowBack
          className="mr-2 text-gray-600 text-2xl cursor-pointer"
          onClick={() => navigate(-1)}
          aria-label={t("Go Back")}
        />
        <h1 className="text-lg font-semibold text-gray-800">
          {isEditing ? t("Update Announcement") : t("Create New Announcement")}
        </h1>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => navigate(-1)}
          className="flex-grow rounded-md py-2 px-6 text-center border"
          disabled={loading}
        >
          <span>{t("Cancel")}</span>
        </button>
        <ProtectedAction requiredPermission="add/edit announcement">
          <button
            onClick={onSave}
            className="flex-grow rounded-md py-2 px-6 text-center border bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 transition"
            disabled={loading}
          >
            <span className="text-gradient">
              {loading
                ? t("Saving...")
                : isEditing
                ? t("Update Announcement")
                : t("Submit Announcement")}
            </span>
          </button>
        </ProtectedAction>
      </div>
    </div>
  );
};

export default CreateAnnouncementHeader;
