import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import ProtectedAction from "../../../../../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../../../../../config/permission";

const AddDiscussionHeader = ({ onSave, isUpdating }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between p-2 pe-5 bg-white border-b border-gray-300 shadow-sm">
      <div className="flex items-center">
        <IoIosArrowBack
          className="mr-2 text-gray-600 text-2xl cursor-pointer"
          onClick={() => navigate(-1)} // Navigate to the previous page
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
            onClick={() => {
              onSave(true); // Save and publish the discussion
            }}
            className="flex-grow rounded-md py-2 px-6 text-center bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 transition"
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
            onClick={() => {
              onSave(false); // Save without publishing
            }}
            className="flex-grow rounded-md py-2 px-6 text-center bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 transition"
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
