import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { ImSpinner8 } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import ProtectedAction from "../../../../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../../../../config/permission";
import { useTranslation } from "react-i18next";

const AddPageHeader = ({
  onSave,
  isUpdating,
  loadingType,
  isPublishDateSet,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation("admAccounts");

  return (
    <div className="flex items-center justify-between p-2 pe-5 bg-white border-b border-gray-300 shadow-sm">
      <div className="flex items-center">
        <IoIosArrowBack
          className="mr-2 text-gray-600 text-2xl cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-lg font-semibold text-gray-800">
          {isUpdating ? t("Update Page") : t("Create New Page")}
        </h1>
      </div>
      <div className="flex items-center space-x-2">
        <ProtectedAction
          requiredPermission={
            PERMISSIONS.UPDATE_PAGE || PERMISSIONS.CREATE_PAGE
          }
        >
          <button
            onClick={() => onSave(false)}
            className="flex-grow rounded-md py-2 px-6 text-center bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 transition"
          >
            <span className="text-gradient flex items-center justify-center">
              {loadingType === "save" ? (
                <>
                  <ImSpinner8 className="animate-spin mr-2" />
                  {isUpdating ? t("Updating...") : t("Saving...")}
                </>
              ) : isUpdating ? (
                t("Update")
              ) : (
                t("Save")
              )}
            </span>
          </button>
        </ProtectedAction>
        <ProtectedAction
          requiredPermission={
            PERMISSIONS.UPDATE_PAGE || PERMISSIONS.CREATE_PAGE
          }
        >
          <button
            onClick={() => onSave(true)}
            className="flex-grow rounded-md py-2 px-6 text-center bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 transition"
            title={
              !isPublishDateSet
                ? "Publish date is required to publish the page."
                : ""
            }
          >
            <span className="text-gradient flex items-center justify-center">
              {loadingType === "publish" ? (
                <>
                  <ImSpinner8 className="animate-spin mr-2" />
                  {isUpdating ? t("Updating...") : t("Publishing...")}
                </>
              ) : isUpdating ? (
                t("Update & Publish")
              ) : (
                t("Save & Publish")
              )}
            </span>
          </button>
        </ProtectedAction>
      </div>
    </div>
  );
};

AddPageHeader.propTypes = {
  onSave: PropTypes.func.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  loadingType: PropTypes.string.isRequired,
  isPublishDateSet: PropTypes.bool.isRequired,
};

export default AddPageHeader;
