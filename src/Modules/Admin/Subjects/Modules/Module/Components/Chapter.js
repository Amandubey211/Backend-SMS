import React, { useState, useEffect, useRef } from "react";
import {
  FaEllipsisV,
  FaChevronDown,
  FaChevronUp,
  FaPen,
  FaTrashAlt,
  FaArrowRight,
} from "react-icons/fa";
import ChapterItem from "./ChapterItem";
import useDeleteChapter from "../../../../../../Hooks/AuthHooks/Staff/Admin/Assignment/useDeleteChapter";
import DeleteModal from "../../../../../../Components/Common/DeleteModal";
import toast from "react-hot-toast";

const Chapter = ({
  title,
  chapterNumber,
  imageUrl,
  assignments,
  chapterId,
  moduleId,
  quizzes,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { loading, error, success, deleteChapter } = useDeleteChapter();
  const menuRef = useRef(null);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuOpen((prevState) => !prevState);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleDelete = () => {
    setModalOpen(true);
    setMenuOpen(false);
  };

  const confirmDelete = async () => {
    try {
      await deleteChapter(moduleId, chapterId);
      setModalOpen(false);
      onDelete();
    } catch (error) {
      console.error("Error deleting chapter:", error);
    }
  };

  return (
    <div className="mb-4 p-1 bg-white rounded-lg border-b relative">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <img
            src={imageUrl}
            alt={`Chapter ${chapterNumber}`}
            className="w-12 h-12 mr-4 rounded-lg"
          />
          <div>
            <h2 className="font-semibold text-md">{title}</h2>
            <p className="text-gray-500">Chapter {chapterNumber}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="border p-2 rounded-full hover:bg-gray-50 relative"
            onClick={toggleMenu}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            aria-label="Options"
          >
            <FaEllipsisV />
          </button>
          {menuOpen && (
            <div
              ref={menuRef}
              className="absolute top-full mt-2 right-0 bg-white border rounded-lg shadow-lg w-48 z-10"
              role="menu"
              aria-label="Options Menu"
            >
              <ul className="py-2">
                <li
                  className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                    setMenuOpen(false);
                  }}
                  role="menuitem"
                >
                  <FaPen className="mr-2" /> Edit
                </li>
                <li
                  className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  role="menuitem"
                >
                  <FaTrashAlt className="mr-2" /> Delete
                </li>
                <li
                  className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.success("No Figma ");
                  }}
                  role="menuitem"
                >
                  <FaArrowRight className="mr-2" /> Move
                </li>
              </ul>
            </div>
          )}
          <button
            className="border p-2 rounded-full hover:bg-gray-50"
            onClick={onToggle}
            aria-label="Toggle Chapter"
          >
            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
      </div>
      {isExpanded && (
        <div className="ml-10 py-2">
          {assignments.length || quizzes.length ? (
            <>
              {assignments.map((assignment, index) => (
                <ChapterItem
                  key={index}
                  type="assignment"
                  title={assignment.name}
                  id={assignment._id}
                  isPublished={assignment.isPublished}
                />
              ))}
              {quizzes.map((quiz, index) => (
                <ChapterItem
                  key={index}
                  type="quiz"
                  title={quiz.name}
                  id={quiz._id}
                  isPublished={quiz.isPublished}
                />
              ))}
            </>
          ) : (
            <p className="py-2 bg-gray-50 italic text-gray-500 text-center">
              No Data found
            </p>
          )}
        </div>
      )}

      <DeleteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDelete}
        title={title}
      />
    </div>
  );
};

export default Chapter;
