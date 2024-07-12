import React, { useState } from "react";
import { FaBan } from "react-icons/fa";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useNavigate, useParams } from "react-router-dom";
import useDeleteQuiz from "../../../../Hooks/AuthHooks/Staff/Admin/Quiz/useDeleteQuiz";
import useDeleteAssignment from "../../../../Hooks/AuthHooks/Staff/Admin/Assignment/useDeleteAssignment";

const ButtonsGroup = ({ data, type }) => {
  const navigate = useNavigate();
  const { sid, cid } = useParams();
  const [showMenu, setShowMenu] = useState(false);

  const {
    loading: quizLoading,
    error: quizError,
    deleteQuiz,
  } = useDeleteQuiz();
  const {
    loading: assignmentLoading,
    error: assignmentError,
    deleteAssignment,
  } = useDeleteAssignment();

  const handleEdit = () => {
    if (type === "Quiz") {
      navigate(`/class/${cid}/${sid}/create_quiz`, { state: { quiz: data } });
    }
    if (type === "Assignment") {
      navigate(`/class/${cid}/${sid}/createassignment`, {
        state: { assignment: data },
      });
    }
  };

  const handleDelete = async () => {
    if (type === "Quiz") {
      await deleteQuiz(data._id);
    }
    if (type === "Assignment") {
      await deleteAssignment(data._id);
    }
  };

  return (
    <div className="relative flex justify-center gap-2 items-center w-full p-2 text-gray-700">
      <button
        className="flex items-center space-x-1 px-4 py-1 border rounded-md border-gray-300 text-gray-600 hover:bg-gray-100 transition"
        aria-label="Publish Assignment"
      >
        <FaBan aria-hidden="true" />
        <span>Publish</span>
      </button>
      <button
        onClick={handleEdit}
        className="flex items-center space-x-1 px-4 py-1 border rounded-md border-gray-300 text-green-600 hover:bg-gray-100 transition"
        aria-label="Edit Assignment"
      >
        <AiOutlineEdit aria-hidden="true" />
        <span>Edit</span>
      </button>
      <button
        className="flex items-center space-x-1 border rounded-full w-8 h-8 justify-center border-gray-300 text-gray-600 hover:bg-gray-100 transition relative"
        aria-label="More Options"
        onClick={() => setShowMenu(!showMenu)}
      >
        <HiOutlineDotsVertical aria-hidden="true" />
        {showMenu && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
            <button
              onClick={handleDelete}
              className="flex items-center space-x-2 px-4 py-2 hover:bg-red-100 w-full text-left"
              aria-label={`Delete ${type}`}
            >
              <AiOutlineDelete aria-hidden="true" className="text-red-600" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </button>
    </div>
  );
};

export default ButtonsGroup;
