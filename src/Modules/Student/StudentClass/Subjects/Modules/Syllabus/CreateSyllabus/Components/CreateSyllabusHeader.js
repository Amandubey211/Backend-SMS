import React from "react";
import toast from "react-hot-toast";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
const CreateSyllabusHeader = ({onSave}) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between p-2 pe-8 bg-white border-b border-gray-300 shadow-sm">
      <div className="flex items-center">
        <IoIosArrowBack
          className="mr-2 text-gray-600 text-2xl cursor-pointer"
          onClick={() => navigate(-1)} // Navigate to the previous page
        />
        <h1 className="text-lg font-semibold text-gray-800">
          Create New Syllabus
        </h1>
      </div>
      <div className="flex items-center space-x-2">
      <button    onClick={() => navigate(-1)}  className="px-4 py-2 border font-semibold rounded-md  transition">
          cancel
        </button>
        <button
          onClick={() => {
            onSave();
            toast.success("Saved Syllabus");
          }}
          className="flex-grow rounded-md py-2 px-4 text-center bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 transition"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-indigo-500">
            Submit Syllabus
          </span>
        </button>
      
        
     
      </div>
    </div>
  );
};

export default CreateSyllabusHeader;
