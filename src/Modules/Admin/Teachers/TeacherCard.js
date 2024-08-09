import React, { useState } from "react";
import PropTypes from "prop-types";
import { TbUserEdit } from "react-icons/tb";
import { RiDeleteBinLine } from "react-icons/ri";
import toast from "react-hot-toast";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { CiUser } from "react-icons/ci";
import useAssignTeacher from "../../../Hooks/AuthHooks/Staff/Admin/Teacher/useAssignTeacher";

const TeacherCard = ({ id, name, role, phone, image, onEditClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { unassignTeacher, loading } = useAssignTeacher();

  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await unassignTeacher(id);
      toast.success(`${name} deleted successfully!`);
    } catch (error) {
      toast.error(`Failed to delete ${name}: ${error.message}`);
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative w-64 h-70 rounded-md overflow-hidden hover:shadow-lg border border-gray-200 p-4 m-4 flex flex-col items-center transform transition-transform duration-300 hover:scale-105 group">
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col space-y-2">
        {/* <button
          className="bg-white rounded-full p-2 border"
          onClick={onEditClick}
        >
          <TbUserEdit className="text-green-500 w-4 h-4" />
        </button> */}
        <button
          className="bg-white rounded-full p-2 border"
          onClick={handleDeleteClick}
        >
          <RiDeleteBinLine className="text-red-500 w-4 h-4" />
        </button>
      </div>
      <div className="flex justify-center">
        {image ? (
          <img className="w-24 h-24 rounded-full" src={image} alt={name} />
        ) : (
          <CiUser className="text-gray-800 w-24 h-24" />
        )}
      </div>
      <div className="text-center mt-4">
        <div className="font-bold text-xl mb-1">{name}</div>
        <p className="text-gray-700 text-sm">{role}</p>
      </div>
      <div className="text-center mt-4 border-t pt-2 w-full">
        <p className="text-gray-500 text-xs uppercase">Phone</p>
        <p className="text-gray-700 text-base font-semibold">{phone}</p>
      </div>
      <DeleteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title={name}
      />
    </div>
  );
};

TeacherCard.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
};

export default TeacherCard;
