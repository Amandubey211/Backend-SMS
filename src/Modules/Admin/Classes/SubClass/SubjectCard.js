import React, { useState } from "react";
import { LuUser } from "react-icons/lu";
import { BsBook } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedSubject } from "../../../../Redux/Slices/Common/CommonSlice";
import Icon1 from "../../../../Assets/ClassesAssets/SubClassAssets/SubjectIcons/image1.png";
import { MdOutlineModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import useCreateSubject from "../../../../Hooks/AuthHooks/Staff/Admin/useCreateSubject";
import DeleteModal from "../../../../Components/Common/DeleteModal";

const SubjectCard = ({ data, backgroundColor, Class, onEdit, subjectId }) => {
  const dispatch = useDispatch();
  const { deleteSubject, loading } = useCreateSubject();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteSubject(subjectId, Class);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error deleting subject:", error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      className={`relative rounded-xl p-4 shadow-lg ${backgroundColor} transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl group`}
    >
      <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={() => onEdit(data)}
          className="bg-white p-1 rounded-full shadow hover:bg-gray-200"
        >
          <MdOutlineModeEdit className="text-green-800 bg-green-50 p-1 text-3xl rounded-full cursor-pointer" />
        </button>
        <button
          className="bg-white p-1 rounded-full shadow hover:bg-gray-200"
          disabled={loading}
          aria-busy={loading ? "true" : "false"}
          onClick={openModal}
        >
          <RiDeleteBin6Line className="text-red-800 bg-red-50 p-1 text-3xl rounded-full cursor-pointer" />
        </button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <button
          className={`border border-white rounded-full px-4 py-1 ${
            data.isPublished
              ? "text-green-600 bg-green-100"
              : "bg-pink-50 text-gray-600"
          }`}
        >
          {data.isPublished ? "Publish" : "Unpublished"}
        </button>
      </div>
      <NavLink
        to={`/class/${Class}/${data._id}/module`}
        onClick={() => dispatch(setSelectedSubject(data.name))}
        className="block"
      >
        <h2 className="text-xl font-bold capitalize text-white w-[65%] transition-colors duration-300 ">
          {data.name}
        </h2>
        <div className="flex items-center mt-2 text-white">
          <span className="flex items-center mr-2 gap-1">
            <LuUser />
            <span>{data.studentsIds ? data.studentsIds.length : 0}</span>
          </span>
          <span className="border-r-2 border-white h-5 mr-2"></span>
          <span className="flex items-center gap-1">
            <BsBook />
            <span>{data.modules.length} Modules</span>
          </span>
        </div>
      </NavLink>
      <div className="flex items-center mt-12">
        <img
          src={
            data.teacherImage ||
            "https://avatars.githubusercontent.com/u/109097090?v=4"
          }
          alt="teacher"
          className="w-12 h-12 rounded-full transition-transform duration-300 transform hover:scale-110"
        />
        <div className="ml-3 capitalize">
          <p className="text-white font-semibold">
            {data.teacherName || "Aman Dubey"}
          </p>
          <p className="text-white text-sm">{data.teacherRole || "Teacher"}</p>
        </div>
      </div>
      <img
        src={data.icon || Icon1}
        alt="icon"
        className="absolute bottom-6 right-6 h-28 transition-transform duration-300 transform hover:scale-110"
      />
      <DeleteModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleDelete}
        title={data.name}
      />
    </div>
  );
};

export default SubjectCard;
