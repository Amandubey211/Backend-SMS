import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ProtectedAction from "../../../../../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../../../../../config/permission";

const AddDiscussionHeader = ({ onSave, isUpdating }) => {
  const navigate = useNavigate();
  const globalIsLoading = useSelector(
    (state) => state.admin.discussions.loading
  );
  const [actionInProgress, setActionInProgress] = useState(null);

  const handlePublish = () => {
    setActionInProgress("publish");
    onSave(true).finally(() => setActionInProgress(null));
  };

  const handleSave = () => {
    setActionInProgress("save");
    onSave(false).finally(() => setActionInProgress(null));
  };

  return (
    <div className="w-full flex items-center justify-between px-4 py-2 bg-white border-b border-gray-300 shadow-sm">
      <div className="flex items-center">
        <IoIosArrowBack
          className="mr-3 text-gray-600 text-2xl cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-lg font-semibold text-gray-800">
          {isUpdating ? "Update Discussion" : "Create New Discussion"}
        </h1>
      </div>
      <div className="flex items-center space-x-2">
        <ProtectedAction
          requiredPermission={
            PERMISSIONS.UPDATE_DISCUSSION || PERMISSIONS.CREATE_DISCUSSION
          }
        >
          <button
            onClick={handlePublish}
            disabled={globalIsLoading}
            className="rounded-md py-2 px-6 bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionInProgress === "publish"
              ? "Processing..."
              : isUpdating
              ? "Update & Publish"
              : "Save & Publish"}
          </button>
        </ProtectedAction>
        <ProtectedAction
          requiredPermission={
            PERMISSIONS.UPDATE_DISCUSSION || PERMISSIONS.CREATE_DISCUSSION
          }
        >
          <button
            onClick={handleSave}
            disabled={globalIsLoading}
            className="rounded-md py-2 px-6 bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionInProgress === "save"
              ? "Processing..."
              : isUpdating
              ? "Update"
              : "Save"}
          </button>
        </ProtectedAction>
      </div>
    </div>
  );
};

export default AddDiscussionHeader;
