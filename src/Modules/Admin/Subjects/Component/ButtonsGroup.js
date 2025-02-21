import React, { useState } from "react";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
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

const ButtonsGroup = ({ type, data, loading, requiredPermission }) => {
  const navigate = useNavigate();
  const { sid, cid } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  const handleEdit = () => {
    if (!data) return;
    if (type === "Quiz") {
      navigate(`/class/${cid}/${sid}/create_quiz`, {
        state: { quizId: data._id },
      });
    } else if (type === "Assignment") {
      navigate(`/class/${cid}/${sid}/createassignment`, {
        state: { assignment: data },
      });
    }
  };

  const handleDelete = async () => {
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!data) return;
    if (type === "Quiz") {
      await dispatch(deleteQuizThunk(data._id));
    } else if (type === "Assignment") {
      await dispatch(deleteAssignmentThunk(data._id));
    }
    setIsModalOpen(false);
    navigate(-1);
  };

  const handlePublishToggle = async () => {
    if (!data) return;
    const updatedData = {
      ...data,
      publish: !data?.publish,
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

  const isPublished = data?.publish ?? true;

  return (
    <div className="flex justify-center items-center gap-3 w-full p-1 text-gray-700">
      {/* Publish/Unpublish Button */}
      <ProtectedAction requiredPermission={requiredPermission[0]}>
        {/* <button
          className="flex items-center space-x-2 px-6 py-2 border rounded-md border-gray-300 text-gray-600 hover:bg-gray-100 transition"
          onClick={handlePublishToggle}
          disabled={loading || !data}
        >
          {loading ? (
            <>
              <ImSpinner3 className="animate-spin text-gray-500" />
              <span>Loading</span>
            </>
          ) : isPublished ? (
            <>
              <BsPatchCheckFill className="text-green-600" />
              <span>Publish</span>
            </>
          ) : (
            <>
              <MdOutlineBlock />
              <span>Unpublish</span>
            </>
          )}
        </button> */}
      </ProtectedAction>

      {/* Edit Button - Wider */}
      <ProtectedAction requiredPermission={requiredPermission[1]}>
        <button
          onClick={handleEdit}
          className="flex items-center justify-center space-x-2 w-32 py-2 border rounded-md border-gray-300 text-green-600 hover:bg-gray-100 transition"
          aria-label="Edit"
          disabled={!data}
        >
          <AiOutlineEdit />
          <span>Edit</span>
        </button>
      </ProtectedAction>

      {/* Delete Button - Wider */}
      <ProtectedAction requiredPermission={requiredPermission[2]}>
        <button
          onClick={handleDelete}
          className="flex items-center justify-center space-x-2 w-32 py-2 border rounded-md border-gray-300 text-red-600 hover:bg-red-100 transition"
          aria-label="Delete"
          disabled={!data}
        >
          <AiOutlineDelete />
          <span>Delete</span>
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
