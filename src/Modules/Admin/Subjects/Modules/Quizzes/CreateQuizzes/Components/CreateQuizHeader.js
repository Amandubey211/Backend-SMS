import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import ProtectedAction from "../../../../../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../../../../../config/permission";

const CreateQuizHeader = ({ onSave, isEditing, activeTab }) => {
  const navigate = useNavigate();

  return (
    <div className="flex h-14 items-center justify-between p-2 bg-white border-b border-gray-300 shadow-sm">
      <div className="flex items-center">
        <IoIosArrowBack
          className="mr-2 text-gray-600 text-2xl cursor-pointer"
          onClick={() => navigate(-1)} // navigate to previous page
        />
        <h1 className="text-lg font-semibold text-gray-800">
          {isEditing ? "Update Quiz" : "Create New Quiz"}
        </h1>
      </div>

      {activeTab === "instructions" && (
        <div className="flex items-center space-x-2">
          <ProtectedAction requiredPermission={PERMISSIONS.UPDATE_QUIZ}>
            <button
              onClick={() => onSave(true)} // attempt to Save & Publish
              className="flex-grow rounded-md py-2 px-4 text-center bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 transition"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-indigo-500">
                {isEditing ? "Update & Publish" : "Save & Publish"}
              </span>
            </button>
          </ProtectedAction>

          <ProtectedAction requiredPermission={PERMISSIONS.CREATE_QUIZ}>
            <button
              onClick={() => onSave(false)} // attempt to Save (draft)
              className="px-4 py-2 text-white font-semibold rounded-md bg-gradient-to-r from-purple-500 to-red-500 hover:from-purple-600 hover:to-red-600 transition"
            >
              Save
            </button>
          </ProtectedAction>
        </div>
      )}
    </div>
  );
};

export default CreateQuizHeader;
