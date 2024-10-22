import React, { useState, useEffect, useRef } from "react";
import {
  FaEllipsisV,
  FaCheckCircle,
  FaTrashAlt,
  FaFileAlt,
} from "react-icons/fa";
import { RiListCheck3, RiFileUnknowLine } from "react-icons/ri";
import { FiFileText } from "react-icons/fi";
import { BsPatchCheckFill } from "react-icons/bs";
import { MdOutlineBlock } from "react-icons/md";
import { NavLink, useParams } from "react-router-dom";
import DeleteModal from "../../../../../../Components/Common/DeleteModal";
import useDeleteQuiz from "../../../../../../Hooks/AuthHooks/Staff/Admin/Quiz/useDeleteQuiz";
import useDeleteAssignment from "../../../../../../Hooks/AuthHooks/Staff/Admin/Assignment/useDeleteAssignment";

const getIcon = (type) => {
  switch (type) {
    case "assignment":
      return <RiListCheck3 className="text-green-500" aria-hidden="true" />;
    case "quiz":
      return <RiFileUnknowLine className="text-green-500" aria-hidden="true" />;
    case "page":
      return <FiFileText className="text-green-500" aria-hidden="true" />;
    case "discussions":
      return <FiFileText className="text-green-500" aria-hidden="true" />;
    case "completed":
      return <FaCheckCircle className="text-green-500" aria-hidden="true" />;
    default:
      return <FaFileAlt className="text-green-500" aria-hidden="true" />;
  }
};

const ChapterItem = ({ type, title, id, isPublished, fetchModules }) => {
  const { sid, cid } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const optionsRef = useRef(null);

  const { deleteAssignment, loading: deleteAssignmentLoading } =
    useDeleteAssignment();
  const { deleteQuiz, loading: deleteQuizLoading } = useDeleteQuiz();

  const toggleMenu = (event) => {
    event.preventDefault();
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = (event) => {
    if (optionsRef.current && !optionsRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    if (menuOpen) {
      document.addEventListener("mousedown", closeMenu);
    } else {
      document.removeEventListener("mousedown", closeMenu);
    }

    return () => {
      document.removeEventListener("mousedown", closeMenu);
    };
  }, [menuOpen]);

  const handleDelete = async () => {
    try {
      if (type === "assignment") {
        await deleteAssignment(id);
      } else if (type === "quiz") {
        await deleteQuiz(id);
      }
      fetchModules();
      setMenuOpen(false);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const openDeleteModal = () => {
    setModalOpen(true);
    setMenuOpen(false);
  };

  return (
    <div className="flex items-center mb-3 gap-3 rounded-lg relative">
      <NavLink
        to={`/class/${cid}/${sid}/${type}/${id}/view`}
        className="flex-grow flex gap-3"
        aria-label={`View ${type} titled ${title}`}
      >
        <div className="p-2 bg-white rounded-full">{getIcon(type)}</div>
        <div className="flex flex-col gap-1 justify-center">
          <p className="font-semibold">{title}</p>
          <p className="text-green-500 text-sm ">
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </p>
        </div>
      </NavLink>
      <div className="flex items-center gap-3">
        {isPublished ? (
          <BsPatchCheckFill
            className="text-green-600 p-1 border rounded-full h-7 w-7"
            aria-label="Published"
          />
        ) : (
          <MdOutlineBlock
            className="text-gray-600  p-1 border rounded-full h-7 w-7"
            aria-label="Not Published"
          />
        )}
        <button
          onClick={toggleMenu}
          className="p-2"
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          aria-label="Options"
        >
          <FaEllipsisV className="text-green-500" />
        </button>
        {menuOpen && (
          <div
            ref={optionsRef}
            className="absolute right-0 mt-8 w-32 bg-white shadow-lg border rounded-md z-10"
            role="menu"
            aria-label="Options Menu"
          >
            <button
              onClick={openDeleteModal}
              className="flex items-center gap-2 w-full p-2 hover:bg-gray-100"
              role="menuitem"
              aria-label="Delete"
              disabled={deleteAssignmentLoading || deleteQuizLoading}
            >
              <FaTrashAlt className="text-red-500" aria-hidden="true" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      <DeleteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDelete}
        title={title}
      />
    </div>
  );
};

export default ChapterItem;
