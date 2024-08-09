import React, { useState, useRef, useEffect } from "react";
import { MdOutlineBlock } from "react-icons/md";
import { BsPatchCheckFill } from "react-icons/bs";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useNavigate, useParams } from "react-router-dom";
import useDeleteQuiz from "../../../../Hooks/AuthHooks/Staff/Admin/Quiz/useDeleteQuiz";
import useDeleteAssignment from "../../../../Hooks/AuthHooks/Staff/Admin/Assignment/useDeleteAssignment";
import useUpdateAssignment from "../../../../Hooks/AuthHooks/Staff/Admin/Assignment/useUpdateAssignment";
import useUpdateQuiz from "../../../../Hooks/AuthHooks/Staff/Admin/Quiz/useUpdateQuiz";
import DeleteModal from "../../../../Components/Common/DeleteModal";

const ButtonsGroup = ({ data, type, onRefresh }) => {
  const navigate = useNavigate();
  const { sid, cid } = useParams();
  const [showMenu, setShowMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const menuRef = useRef();

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
  const { updateAssignment, loading: updateAssignmentLoading } =
    useUpdateAssignment();
  const { updateQuiz, loading: updateQuizLoading } = useUpdateQuiz();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEdit = () => {
    if (!data) return; // Prevent action if data is null
    if (type === "Quiz") {
      navigate(`/class/${cid}/${sid}/create_quiz`, {
        state: { quizId: data._id },
      });
    }
    if (type === "Assignment") {
      navigate(`/class/${cid}/${sid}/createassignment`, {
        state: { assignment: data },
      });
    }
  };

  const handleDelete = async () => {
    setShowMenu(false);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!data) return; // Prevent action if data is null
    let success = false;
    if (type === "Quiz") {
      success = await deleteQuiz(data._id);
    }
    if (type === "Assignment") {
      success = await deleteAssignment(data._id);
    }
    if (success && !quizError && !assignmentError) {
      onRefresh(); // Trigger data refetch
    }
  };

  const handlePublishToggle = async () => {
    if (!data) return; // Prevent action if data is null
    const updatedData = {
      ...data,
      publish: !data?.publish, // Toggle publish status safely with optional chaining
      allowNumberOfAttempts: data.allowNumberOfAttempts ?? 1,
      points: data.points ?? 0,
    };

    let success = false;
    if (type === "Quiz") {
      success = await updateQuiz(data._id, updatedData);
    } else if (type === "Assignment") {
      success = await updateAssignment(data._id, updatedData);
    }

    if (success) {
      onRefresh(); // Trigger data refetch
    }
  };

  // Use a default value if publish is not present or data is null
  const isPublished = data?.publish ?? false;

  return (
    <div className="relative flex justify-center gap-2 items-center w-full p-2 text-gray-700">
      <button
        className="flex items-center space-x-1 px-4 py-1 border rounded-md border-gray-300 text-gray-600 hover:bg-gray-100 transition"
        aria-label={isPublished ? "Unpublish" : "Publish"}
        onClick={handlePublishToggle}
        disabled={updateQuizLoading || updateAssignmentLoading || !data}
      >
        {isPublished ? (
          <>
            <BsPatchCheckFill aria-hidden="true" className="text-green-600" />
            <span>Publish</span>
          </>
        ) : (
          <>
            <MdOutlineBlock aria-hidden="true" />
            <span>Unpublish</span>
          </>
        )}
      </button>
      <button
        onClick={handleEdit}
        className="flex items-center space-x-1 px-4 py-1 border rounded-md border-gray-300 text-green-600 hover:bg-gray-100 transition"
        aria-label="Edit Assignment"
        disabled={!data}
      >
        <AiOutlineEdit aria-hidden="true" />
        <span>Edit</span>
      </button>
      <button
        className="flex items-center space-x-1 border rounded-full w-8 h-8 justify-center border-gray-300 text-gray-600 hover:bg-gray-100 transition relative"
        aria-label="More Options"
        onClick={() => setShowMenu(!showMenu)}
        disabled={!data}
      >
        <HiOutlineDotsVertical aria-hidden="true" />
        {showMenu && (
          <div
            ref={menuRef}
            className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg"
          >
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

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title={data?.name || type}
      />
    </div>
  );
};

export default ButtonsGroup;
