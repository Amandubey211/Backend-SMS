import React from "react";
import toast from "react-hot-toast";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

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
        <button
          onClick={() => {
            onSave();
            toast.success(
              isUpdating ? "Updated and Published" : "Saved and Published",
              { position: "bottom-left" }
            );
          }}
          className="flex-grow rounded-md py-2 px-6 text-center bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 transition"
        >
          <span className="text-gradient">
            {isUpdating ? "Update & Publish" : "Save & Publish"}
          </span>
        </button>
        <button className="flex-grow rounded-md py-2 px-6 text-center bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 transition">
          <span className="text-gradient">{isUpdating ? "Update" : "Save"}</span>
        </button>
      </div>
    </div>
  );
};

export default AddDiscussionHeader;
