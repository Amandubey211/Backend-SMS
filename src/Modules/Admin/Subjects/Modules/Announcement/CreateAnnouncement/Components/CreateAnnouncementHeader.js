import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const CreateAnnouncementHeader = ({ onSave, loading, isEditing }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between p-2 pe-5 bg-white border-b border-gray-300 shadow-sm">
      <div className="flex items-center">
        <IoIosArrowBack
          className="mr-2 text-gray-600 text-2xl cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-lg font-semibold text-gray-800">
          {isEditing ? "Update Announcement" : "Create New Announcement"}
        </h1>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => navigate(-1)}
          className="flex-grow rounded-md py-2 px-6 text-center border"
          disabled={loading}
        >
          <span>Cancel</span>
        </button>
        <button
          onClick={onSave}
          className="flex-grow rounded-md py-2 px-6 text-center border bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 transition"
          disabled={loading}
        >
          <span className="text-gradient">
            {loading
              ? "Saving..."
              : isEditing
              ? "Update Announcement"
              : "Submit Announcement"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default CreateAnnouncementHeader;
