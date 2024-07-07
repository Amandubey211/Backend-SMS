import React, { useState, useRef, useEffect } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { GiArrest } from "react-icons/gi";
import { RiDeleteBin5Line } from "react-icons/ri";
import useDeleteSyllabus from "../../../../../../../Hooks/AuthHooks/Staff/Admin/Syllabus/useDeleteSyllabus";

const SyllabusHeader = ({ onEditClick, onDeleteClick, syllabus }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { deleteSyllabus, loading: deleteLoading } = useDeleteSyllabus();
  const menuRef = useRef(null);

  const handleDeleteClick = async () => {
    await deleteSyllabus(syllabus._id);
    onDeleteClick(syllabus._id);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className="flex items-center justify-between ps-4 border-b">
      <h1 className="text-lg font-semibold">Subject Syllabus</h1>
      <div className="flex gap-1 items-end justify-center relative">
        <div className="flex justify-center gap-2 items-center w-full p-2 text-gray-700">
          <button
            className="flex items-center space-x-1 px-4 py-1 border rounded-md border-gray-300 text-green-600 hover:bg-gray-100 transition"
            aria-label="Edit Assignment"
            onClick={onEditClick}
          >
            <AiOutlineEdit aria-hidden="true" />
            <span>Edit</span>
          </button>
          <button
            className="flex items-center space-x-1 border rounded-full w-8 h-8 justify-center border-gray-300 text-gray-600 hover:bg-gray-100 transition"
            aria-label="More Options"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <HiOutlineDotsVertical aria-hidden="true" />
          </button>
          {menuOpen && (
            <div
              ref={menuRef}
              className="absolute right-0 top-10 w-48 bg-white border rounded shadow-md"
            >
              <button
                className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                onClick={handleDeleteClick}
                disabled={deleteLoading}
              >
                <RiDeleteBin5Line className="mr-2 text-red-700" />
                <span>Delete</span>
              </button>
              <button
                className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
              >
                <GiArrest className="mr-2 text-blue-700" />
                <span>Task 2</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SyllabusHeader;
