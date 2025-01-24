import React, { useState, useRef, useEffect } from "react";
import { MdOutlineBlock } from "react-icons/md";
import { BsPatchCheckFill } from "react-icons/bs";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useNavigate, useParams } from "react-router-dom";
import { ImSpinner3 } from "react-icons/im";
import DeleteModal from "../../../../Components/Common/DeleteModal";
import { useDispatch } from "react-redux";
import {
  deleteAssignmentThunk,
  updateAssignmentThunk,
} from "../../../../Store/Slices/Admin/Class/Assignment/assignmentThunks";
import {
  updateQuizThunk,
  deleteQuizThunk,
} from "../../../../Store/Slices/Admin/Class/Quiz/quizThunks";
import ProtectedAction from "../../../../Routes/ProtectedRoutes/ProtectedAction";

const ButtonsGroup = ({ type, data, loading }) => {
  const navigate = useNavigate();
  const { sid, cid } = useParams();
  const [showMenu, setShowMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const menuRef = useRef();
  const dispatch = useDispatch();

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
    if (type === "Quiz") {
      dispatch(deleteQuizThunk(data._id));
    }
    if (type === "Assignment") {
      dispatch(deleteAssignmentThunk(data._id));
    }

    // navigate(-1);
  };

  const handlePublishToggle = async () => {
    if (!data) return; // Prevent action if data is null
    const updatedData = {
      ...data,
      publish: !data?.publish, // Toggle publish status safely with optional chaining
      allowNumberOfAttempts: data.allowNumberOfAttempts || null,
      points: data.points ?? 0,
    };

    if (type === "Quiz") {
      const quizId = data._id;
      dispatch(updateQuizThunk({ quizId, quizData: updatedData }));
    } else if (type === "Assignment") {
      const assignmentId = data._id;
      dispatch(
        updateAssignmentThunk({ assignmentId, assignmentData: updatedData })
      );
    }
  };

  // Use a default value if publish is not present or data is null
  const isPublished = data?.publish ?? true;
  const isUpdating = loading;

  return (
    <div className="relative flex justify-center gap-2 items-center w-full p-2 text-gray-700">
      <ProtectedAction requiredPermission="">
        <button
          className="flex items-center space-x-1 px-4 py-1 border rounded-md border-gray-300 text-gray-600 hover:bg-gray-100 transition"
          aria-label={data?.publish ? "Unpublish" : "Publish"}
          onClick={handlePublishToggle}
          disabled={loading || !data}
        >
          {loading ? (
            <>
              <span className="flex items-center justify-center w-5 h-5">
                <ImSpinner3 className="animate-spin text-gray-500" />
              </span>
              <span>Loading</span>
            </>
          ) : data?.publish ? (
            <>
              <span className="flex items-center justify-center w-5 h-5">
                <BsPatchCheckFill
                  aria-hidden="true"
                  className="text-green-600"
                />
              </span>
              <span>Publish</span>
            </>
          ) : (
            <>
              <span className="flex items-center justify-center w-5 h-5">
                <MdOutlineBlock aria-hidden="true" />
              </span>
              <span>Unpublish</span>
            </>
          )}
        </button>
      </ProtectedAction>

      <ProtectedAction>
        <button
          onClick={handleEdit}
          className="flex items-center space-x-1 px-4 py-1 border rounded-md border-gray-300 text-green-600 hover:bg-gray-100 transition"
          aria-label="Edit Assignment"
          disabled={!data}
        >
          <AiOutlineEdit aria-hidden="true" />
          <span>Edit</span>
        </button>
      </ProtectedAction>

      <ProtectedAction>
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
      </ProtectedAction>

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
