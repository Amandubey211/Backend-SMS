import React from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { FaBan } from "react-icons/fa6";
import { HiOutlineDotsVertical } from "react-icons/hi";

const SyllabusHeader = () => {
  return (
    <div className="flex items-center justify-between ps-4  border-b">
      <h1 className="text-lg font-semibold">Subject Syllabus</h1>

      <div className="flex  gap-1 items-end justify-center">
        <div className="flex justify-center gap-2 items-center w-full p-2 text-gray-700">
          <button
            className="flex items-center space-x-1 px-4 py-1 border rounded-md border-gray-300 text-green-600 hover:bg-gray-100 transition"
            aria-label="Edit Assignment"
          >
            <AiOutlineEdit aria-hidden="true" />
            <span>Edit</span>
          </button>
          <button
            className="flex items-center space-x-1  border rounded-full w-8 h-8 justify-center border-gray-300 text-gray-600 hover:bg-gray-100 transition"
            aria-label="More Options"
          >
            <HiOutlineDotsVertical aria-hidden="true" className="" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SyllabusHeader;
