import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { MdOutlineModeEdit, MdMenuBook } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CiUser } from "react-icons/ci";
import { BsBook } from "react-icons/bs";
import { Modal } from "antd";

import DeleteModal from "../../../../Components/Common/DeleteModal";
import {
  setSelectedSubjectId,
  setSelectedSubjectName,
} from "../../../../Store/Slices/Common/User/reducers/userSlice";
import { deleteSubject } from "../../../../Store/Slices/Admin/Class/Subject/subjectThunks";
import { useTranslation } from "react-i18next";

import SubjectIcon from "../../../../Assets/ClassesAssets/SubClassAssets/SubjectIcons/image1.png";
import ProtectedAction from "../../../../Routes/ProtectedRoutes/ProtectedAction";

function SubjectCard({
  data,
  backgroundColor,
  Class,
  role,
  subjectId,
  onEdit,
  onClick, // Parent function to handle navigation checks
}) {
  const dispatch = useDispatch();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [ignoreNextClick, setIgnoreNextClick] = useState(false);
  const [currentTeacherIndex, setCurrentTeacherIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { t } = useTranslation("admClass");

  const teachers = data.teacherIds ?? [];
  const teacherCount = teachers.length;

  // Prevent card navigation if the teacher modal was just closed.
  const handleCardClick = () => {
    if (ignoreNextClick) return;
    dispatch(setSelectedSubjectName(data.name));
    dispatch(setSelectedSubjectId(subjectId));
    onClick?.(data);
  };

  // Handle subject deletion.
  const handleDelete = () => {
    dispatch(deleteSubject({ subjectId, classId: Class }));
    setIsDeleteModalOpen(false);
  };

  // Auto-slide teacher info every 2 seconds if multiple teachers exist.
  useEffect(() => {
    let timer;
    if (teacherCount > 1) {
      timer = setInterval(() => {
        setCurrentTeacherIndex((prevIndex) => (prevIndex + 1) % teacherCount);
      }, 2000);
    }
    return () => timer && clearInterval(timer);
  }, [teacherCount]);

  // Trigger slide-in animation whenever the teacher index changes.
  useEffect(() => {
    if (teacherCount > 0) {
      setIsAnimating(true);
      const timeout = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [currentTeacherIndex, teacherCount]);

  // Calculate total chapter count across all modules.
  const chapterCount = data.modules
    ? data.modules.reduce((acc, mod) => acc + (mod.chapters?.length || 0), 0)
    : 0;

  return (
    <div
      className={`relative rounded-xl p-4 shadow-lg ${backgroundColor} transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl group cursor-pointer h-64`}
      onClick={handleCardClick}
    >
      {/* Admin Action Buttons */}
      {role === "admin" && (
        <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ProtectedAction>
            <button
              className="bg-white p-1 rounded-full shadow hover:bg-gray-200"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(data);
              }}
              aria-label={t("Edit")}
            >
              <MdOutlineModeEdit className="text-green-800 bg-green-50 p-1 text-3xl rounded-full cursor-pointer" />
            </button>
          </ProtectedAction>
          <ProtectedAction>
            <button
              className="bg-white p-1 rounded-full shadow hover:bg-gray-200"
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteModalOpen(true);
              }}
              aria-label={t("Delete")}
            >
              <RiDeleteBin6Line className="text-red-800 bg-red-50 p-1 text-3xl rounded-full cursor-pointer" />
            </button>
          </ProtectedAction>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title={data.name}
      />

      {/* Published/Unpublished Label */}
      <div className="flex justify-between items-center mb-4">
        <button
          className={`border border-white rounded-full px-4 py-1 ${
            data.isPublished
              ? "text-green-600 bg-green-100"
              : "bg-pink-50 text-gray-600"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {data.isPublished ? t("Published") : t("Unpublished")}
        </button>
      </div>

      {/* Subject Main Info */}
      <div className="block">
        <h2 className="text-xl font-bold capitalize text-white transition-colors duration-300">
          {data.name}
        </h2>
        <div className="flex items-center mt-2 text-white">
          <span className="flex items-center mr-2 gap-1">
            <MdMenuBook />
            <span>
              {chapterCount} {t("Chapters", { defaultValue: "Chapters" })}
            </span>
          </span>
          <span className="border-r-2 border-white h-5 mr-2"></span>
          <span className="flex items-center gap-1">
            <BsBook />
            <span>{t("Modules", { count: data.modules?.length || 0 })}</span>
          </span>
        </div>
      </div>

      {/* Teacher Section (bottom-left) */}
      {teacherCount > 0 ? (
        <div
          className="relative mt-12 h-16 overflow-hidden cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setIsTeacherModalOpen(true);
          }}
        >
          <div
            className={`flex items-center transition-transform duration-500 ease-out ${
              isAnimating ? "slide-in" : ""
            }`}
          >
            {teachers[currentTeacherIndex].profile ? (
              <img
                src={teachers[currentTeacherIndex].profile}
                alt={t("Teacher profile picture")}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <CiUser className="w-10 h-10 text-white" />
            )}
            <div className="ml-3 capitalize z-10">
              <p className="text-white font-semibold">
                {`${teachers[currentTeacherIndex].firstName} ${teachers[currentTeacherIndex].lastName}`}
                {teacherCount > 1 && (
                  <span className="ml-2 text-sm">({teacherCount})</span>
                )}
              </p>
              <p className="text-white text-sm">
                {teachers[currentTeacherIndex].role || t("Teacher")}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center mt-12">
          <CiUser className="w-10 h-10 bg-transparent text-white" />
          <div className="ml-3 capitalize z-10">
            <p className="text-white font-semibold">
              {t("No Instructor Assigned")}
            </p>
          </div>
        </div>
      )}

      {/* Teacher List Modal */}
      <Modal
        title={t("Teacher List")}
        open={isTeacherModalOpen}
        onCancel={() => {
          // Prevent the subsequent click from triggering subject navigation
          setIsTeacherModalOpen(false);
          setIgnoreNextClick(true);
          setTimeout(() => setIgnoreNextClick(false), 300);
        }}
        footer={null}
        maskClosable={false}
      >
        <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
          {teachers.map((teacher, index) => (
            <div key={index} className="flex items-center space-x-3">
              {teacher.profile ? (
                <img
                  src={teacher.profile}
                  alt={`${teacher.firstName} ${teacher.lastName}`}
                  className="w-8 h-8 rounded-full border-white border"
                />
              ) : (
                <CiUser className="w-8 h-8 text-gray-500" />
              )}
              <div>
                <p className="font-semibold">
                  {teacher.firstName} {teacher.lastName}
                </p>
                <p className="text-sm text-gray-500">
                  {teacher.role || t("Teacher")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Subject Icon (bottom-right) */}
      <img
        src={data.subjectIcon ? data.subjectIcon : SubjectIcon}
        alt={t("Subject icon")}
        className="absolute bottom-6 right-6 h-20 w-20 transition-transform z-40 duration-300 transform hover:scale-110 object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Inline styles for slide-in animation */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .slide-in {
          animation: slideIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default SubjectCard;
