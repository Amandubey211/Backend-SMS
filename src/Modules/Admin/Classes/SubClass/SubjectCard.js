import React, { useState } from "react";
import { LuUser } from "react-icons/lu";
import { BsBook } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { MdOutlineModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CiUser } from "react-icons/ci";
import DeleteModal from "../../../../Components/Common/DeleteModal";
import { deleteSubject } from "../../../../Store/Slices/Admin/Class/Subject/subjectThunks";
import SubjectIcon from "../../../../Assets/ClassesAssets/SubClassAssets/SubjectIcons/image1.png";
import {
  setSelectedSubjectId,
  setSelectedSubjectName,
} from "../../../../Store/Slices/Common/User/reducers/userSlice";
import { useTranslation } from "react-i18next";

const SubjectCard = ({
  data,
  backgroundColor,
  Class,
  onEdit,
  subjectId,
  role,
}) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation("admClass");

  const handleDelete = () => {
    dispatch(deleteSubject({ subjectId, classId: Class }));
    setIsModalOpen(false);
  };

  return (
    <div
      onClick={() => {
        dispatch(setSelectedSubjectName(data?.name));
        dispatch(setSelectedSubjectId(subjectId));
      }}
      className={`relative rounded-xl p-4 shadow-lg ${backgroundColor} transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl group`}
    >
      {role === "admin" && (
        <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => onEdit(data)}
            className="bg-white p-1 rounded-full shadow hover:bg-gray-200"
            aria-label={t("Edit")}
          >
            <MdOutlineModeEdit className="text-green-800 bg-green-50 p-1 text-3xl rounded-full cursor-pointer" />
          </button>
          <button
            className="bg-white p-1 rounded-full shadow hover:bg-gray-200"
            onClick={() => setIsModalOpen(true)}
            aria-label={t("Delete")}
          >
            <RiDeleteBin6Line className="text-red-800 bg-red-50 p-1 text-3xl rounded-full cursor-pointer" />
          </button>
        </div>
      )}

      {/* Modal for Delete Confirmation */}
      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title={data.name}
      />

      <div className="flex justify-between items-center mb-4">
        <button
          className={`border border-white rounded-full px-4 py-1 ${
            data.isPublished
              ? "text-green-600 bg-green-100"
              : "bg-pink-50 text-gray-600"
          }`}
        >
          {data.isPublished ? t("Published") : t("Unpublished")}
        </button>
      </div>

      <NavLink to={`/class/${Class}/${data._id}/module`} className="block">
        <h2 className="text-xl font-bold capitalize text-white transition-colors duration-300">
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
            <span>{t("Modules", { count: data.modules.length })}</span>
          </span>
        </div>
      </NavLink>
      <div className="flex items-center mt-12">
        {data.teacherId?.profile ? (
          <img
            src={data.teacherId?.profile}
            alt={t("Teacher profile picture")}
            className="w-12 h-12 rounded-full transition-transform duration-300 transform hover:scale-110"
          />
        ) : (
          <CiUser className="w-10 h-10 bg-transparent text-white " />
        )}
        <div className="ml-3 capitalize">
          <p className="text-white font-semibold">
            {data?.teacherId?.firstName && data?.teacherId?.lastName
              ? `${data.teacherId.firstName} ${data.teacherId.lastName}`
              : t("No Instructor Assigned")}
          </p>
          <p className="text-white text-sm">
            {data?.teacherId?.role || t("Teacher")}
          </p>
        </div>
      </div>

      <img
        src={data?.subjectIcon ? data?.subjectIcon : SubjectIcon}
        alt={t("Subject icon")}
        className="absolute bottom-6 right-6 h-20 w-auto transition-transform duration-300 transform hover:scale-110 object-contain"
      />
    </div>
  );
};

export default SubjectCard;
