import React from "react";
import toast from "react-hot-toast";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const CreateSyllabusHeader = ({ onSave, loading, isEditing }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between p-2 pe-8 bg-white border-b border-gray-300 shadow-sm">
      <div className="flex items-center">
        <button
          aria-label="Go back"
          onClick={() => navigate(-1)}
          className="mr-2 text-gray-600 text-2xl cursor-pointer"
        >
          <IoIosArrowBack aria-hidden="true" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">
          {isEditing ? "Update Syllabus" : "Create New Syllabus"}
        </h1>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border font-semibold rounded-md transition"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          className="flex-grow rounded-md py-2 px-4 text-center bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 transition"
          disabled={loading}
        >
          {loading ? (
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-indigo-500">
              {isEditing ? "Updating..." : "Saving...."}
            </span>
          ) : (
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-indigo-500">
              {isEditing ? "Update Syllabus" : "Submit Syllabus"}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default CreateSyllabusHeader;
