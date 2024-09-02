import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { RiDeleteBinLine } from "react-icons/ri";
import toast from "react-hot-toast";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { CiUser } from "react-icons/ci";
import useAssignTeacher from "../../../Hooks/AuthHooks/Staff/Admin/Teacher/useAssignTeacher";

const TeacherCard = ({ teacher, role, onEditClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { unassignTeacher, loading } = useAssignTeacher();

  const handleDeleteClick = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    try {
      await unassignTeacher(teacher._id);
      toast.success(`${teacher.fullName} deleted successfully!`);
    } catch (error) {
      toast.error(`Failed to delete ${teacher.fullName}: ${error.message}`);
    } finally {
      setIsModalOpen(false);
    }
  }, [teacher._id, teacher.fullName, unassignTeacher]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <div className="relative w-64 h-70 rounded-md overflow-hidden hover:shadow-lg border border-gray-200 p-4 m-4 flex flex-col items-center transform transition-transform duration-300 hover:scale-105 group">
      {role === "admin" && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col space-y-2">
          <button
            className="bg-white rounded-full p-2 border"
            onClick={handleDeleteClick}
          >
            <RiDeleteBinLine className="text-red-500 w-4 h-4" />
          </button>
        </div>
      )}
      <div className="flex justify-center">
        {teacher.image ? (
          <img
            className="w-24 h-24 rounded-full"
            src={teacher.image}
            alt={teacher.fullName}
          />
        ) : (
          <CiUser className="text-gray-800 w-24 h-24" />
        )}
      </div>
      <div className="text-center mt-4">
        <div className="font-bold text-xl mb-1">{teacher.fullName}</div>
        <p className="text-gray-700 text-sm">{role}</p>
      </div>
      <div className="text-center mt-4 border-t pt-2 w-full">
        <p className="text-gray-500 text-xs uppercase">Phone</p>
        <p className="text-gray-700 text-base font-semibold">
          {teacher.mobileNumber}
        </p>
      </div>
      <DeleteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title={teacher.fullName}
      />
    </div>
  );
};

TeacherCard.propTypes = {
  teacher: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    mobileNumber: PropTypes.string.isRequired,
    image: PropTypes.string,
  }).isRequired,
  role: PropTypes.string.isRequired,
  onEditClick: PropTypes.func.isRequired,
};

export default TeacherCard;
