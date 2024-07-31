import React, { useState } from "react";
import {
  FaEllipsisV,
  FaChevronDown,
  FaChevronUp,
  FaPen,
  FaTrashAlt,
} from "react-icons/fa";
import ChapterItem from "./ChapterItem";

const Chapter = ({
  title,
  chapterNumber,
  imageUrl,
  assignments,
  quizzes,
  isExpanded,
  onToggle,
  onDelete,
  onEdit,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="mb-4 p-1 bg-white rounded-lg border-b">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <img
            src={imageUrl}
            alt="Chapter"
            className="w-12 h-12 mr-4 rounded-lg"
          />
          <div>
            <h2 className="font-semibold text-lg">{title}</h2>
            <p className="text-gray-500">Chapter {chapterNumber}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="border p-2 rounded-full hover:bg-gray-50" onClick={toggleMenu}>
            <FaEllipsisV />
          </button>
          <button className="border p-2 rounded-full hover:bg-gray-50" onClick={onToggle}>
            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="absolute right-4 bg-white border rounded-lg shadow-lg w-48 z-10">
          <ul className="py-2">
            <li
              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
                setMenuOpen(false);
              }}
            >
              <FaPen className="mr-2" /> Edit
            </li>
            <li
              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
                setMenuOpen(false);
              }}
            >
              <FaTrashAlt className="mr-2" /> Delete
            </li>
          </ul>
        </div>
      )}
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
    </div>
  );
};

export default Chapter;
