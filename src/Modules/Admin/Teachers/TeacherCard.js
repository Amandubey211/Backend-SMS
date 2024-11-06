import React, { useState, useCallback } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { CiUser } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { unassignTeacher } from "../../../Store/Slices/Admin/Class/Teachers/teacherThunks";
import { useParams } from "react-router-dom";

const TeacherCard = ({ teacher }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const role = useSelector((state) => state.common.auth.role);
  const { cid } = useParams();

  const handleDeleteClick = () => setIsModalOpen(true);

  const handleConfirmDelete = useCallback(() => {
    dispatch(unassignTeacher({ teacherId: teacher._id, classId: cid }));
    setIsModalOpen(false);
  }, [dispatch, teacher._id, cid]);

  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="relative w-64 h-70 rounded-md overflow-hidden hover:shadow-lg border border-gray-200 p-4 m-4 flex flex-col items-center transform transition-transform duration-300 hover:scale-105 group">
      {role === "admin" && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            className="bg-white rounded-full p-2 border"
            onClick={handleDeleteClick}
          >
            <RiDeleteBinLine className="text-red-500 w-4 h-4" />
          </button>
        </div>
      )}
      <div className="flex justify-center">
        {teacher.profile ? (
          <img
            className="w-24 h-24 rounded-full"
            src={teacher.profile}
            alt={teacher.firstName}
          />
        ) : (
          <CiUser className="text-gray-800 w-24 h-24" />
        )}
      </div>
      <div className="text-center mt-4">
        <div className="font-bold capitalize text-xl mb-1">
          {teacher.firstName} {teacher.lastName}
        </div>
        <p className="text-gray-700 text-sm ">Instructor</p>
      </div>
      <div className="text-center mt-4 border-t pt-2 w-full">
        <p className="text-gray-500 text-xs uppercase">Phone</p>
        <p className="text-gray-700 text-base font-semibold">
          {teacher.mobileNumber || "N/A"}
        </p>
      </div>
      <DeleteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title={`${teacher.firstName} ${teacher.lastName}`}
      />
    </div>
  );
};

export default TeacherCard;
