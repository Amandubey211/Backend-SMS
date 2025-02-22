import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import ProtectedAction from "../../../../../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../../../../../config/permission";

const AddDiscussionHeader = ({ onSave, isUpdating }) => {
  const navigate = useNavigate();

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
            onClick={() => onSave(true)}
            className="rounded-md py-2 px-6 bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 transition"
          >
            <span className="text-gradient">
              {isUpdating ? "Update & Publish" : "Save & Publish"}
            </span>
          </button>
        </ProtectedAction>
        <ProtectedAction
          requiredPermission={
            PERMISSIONS.UPDATE_DISCUSSION || PERMISSIONS.CREATE_DISCUSSION
          }
        >
          <button
            onClick={() => onSave(false)}
            className="rounded-md py-2 px-6 bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 transition"
          >
            <span className="text-gradient">
              {isUpdating ? "Update" : "Save"}
            </span>
          </button>
        </ProtectedAction>
      </div>
    </div>
  );
};

export default AddDiscussionHeader;
