import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { MdOutlineModeEdit, MdMenuBook } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CiUser } from "react-icons/ci";
import { BsBook } from "react-icons/bs";
import { Modal, Tooltip } from "antd";

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
  backgroundColor, // fallback or tailwind class if no hex code found
  Class,
  role,
  subjectId,
  onEdit,
  onClick,
}) {
  const dispatch = useDispatch();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [ignoreNextClick, setIgnoreNextClick] = useState(false);
  const { t } = useTranslation("admClass");

  const teachers = data.teacherIds ?? [];
  const teacherCount = teachers.length;
  const windowSize = 5;
  const slidingCount =
    teacherCount > windowSize ? windowSize - 1 : teacherCount;
  const [currentStartIndex, setCurrentStartIndex] = useState(0);
  const [isPulsing, setIsPulsing] = useState(false);

  // Use effective color: if data.subjectColor is not provided, fallback to backgroundColor or default "#FCD34D"
  const effectiveColor = data.subjectColor
    ? data.subjectColor
    : backgroundColor || "#FCD34D";

  useEffect(() => {
    if (true) {
      const interval = setInterval(() => {
        setIsPulsing(true);
        setTimeout(() => {
          setCurrentStartIndex((prevIndex) => (prevIndex + 1) % teacherCount);
          setIsPulsing(false);
        }, 500);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [teacherCount]);

  // Update the handleCardClick method to prevent propagation
  const handleCardClick = (e) => {
    if (ignoreNextClick || isDeleteModalOpen) return; // Ignore click if modal is open
    e.stopPropagation(); // Stop propagation to prevent triggering navigate()
    dispatch(setSelectedSubjectName(data.name));
    dispatch(setSelectedSubjectId(subjectId));
    onClick?.(data);
  };

  const handleDelete = () => {
    dispatch(deleteSubject({ subjectId, classId: Class }));
    setIsDeleteModalOpen(false);
  };

  const chapterCount = data.modules
    ? data.modules.reduce((acc, mod) => acc + (mod.chapters?.length || 0), 0)
    : 0;

  return (
    <div
      className={`relative rounded-xl p-4 shadow-lg transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl group cursor-pointer h-64`}
      style={{ backgroundColor: effectiveColor }}
      onClick={handleCardClick}
    >
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

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title={data.name}
      />

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
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
          {data.isOptional && (
            <button
              className="border border-white rounded-full px-4 py-1 bg-blue-100 text-blue-600"
              onClick={(e) => e.stopPropagation()}
            >
              {t("Optional")}
            </button>
          )}
        </div>
      </div>

      <div className="block">
        <h2 className="text-xl font-bold capitalize text-white transition-colors duration-300">
          {data.name}
        </h2>
        <div className="flex items-center mt-2 text-white">
          <span className="flex items-center mr-2 gap-1">
            <MdMenuBook />
            <span>
              {chapterCount} {t("Chapters")}
            </span>
          </span>
          <span className="border-r-2 border-white h-5 mr-2"></span>
          <span className="flex items-center gap-1">
            <BsBook />
            <span>{t("Modules", { count: data.modules?.length || 0 })}</span>
          </span>
        </div>
      </div>

      {teacherCount > 0 ? (
        <div
          className="flex items-center mt-12 cursor-pointer overflow-hidden"
          onClick={(e) => {
            e.stopPropagation();
            setIsTeacherModalOpen(true);
          }}
        >
          <div className="flex -space-x-3">
            {teacherCount > windowSize ? (
              <>
                {Array.from({ length: slidingCount }).map((_, i) => {
                  const teacherIndex = (currentStartIndex + i) % teacherCount;
                  const pulseClass =
                    i === slidingCount - 1 && isPulsing ? "animate-pulse" : "";
                  const teacher = teachers[teacherIndex];
                  return (
                    <Tooltip
                      key={teacherIndex}
                      title={`${teacher.firstName} ${teacher.lastName}`}
                      placement="top"
                    >
                      <div
                        className={`w-12 h-12 rounded-full border-2 border-white overflow-hidden ${pulseClass}`}
                      >
                        {teacher.profile ? (
                          <img
                            src={teacher.profile}
                            alt={t("Teacher profile picture")}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full bg-gray-300">
                            <CiUser className="text-white w-6 h-6" />
                          </div>
                        )}
                      </div>
                    </Tooltip>
                  );
                })}

                <Tooltip title={t("Click to see more")} placement="top">
                  <div className="relative w-12 h-12 p-[2px] bg-gradient-to-tr from-pink-500 to-purple-500 rounded-full">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-sm font-medium">
                      <span className="bg-gradient-to-tr from-pink-500 to-purple-500 bg-clip-text text-transparent text-xl">
                        +{teacherCount - slidingCount}
                      </span>
                    </div>
                  </div>
                </Tooltip>
              </>
            ) : (
              teachers.map((teacher, index) => (
                <Tooltip
                  key={index}
                  title={`${teacher.firstName} ${teacher.lastName}`}
                  placement="top"
                >
                  <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden">
                    {teacher.profile ? (
                      <img
                        src={teacher.profile}
                        alt={t("Teacher profile picture")}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-gray-300">
                        <CiUser className="text-white w-6 h-6" />
                      </div>
                    )}
                  </div>
                </Tooltip>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center mt-12">
          <CiUser className="w-12 h-12 bg-transparent text-white" />
          <div className="ml-3 capitalize z-10">
            <p className="text-white text-sm font-semibold">
              {t("No Instructor Assigned")}
            </p>
          </div>
        </div>
      )}

      <Modal
        title={t("Teacher List")}
        open={isTeacherModalOpen}
        onCancel={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setIsTeacherModalOpen(false);
          setIgnoreNextClick(true);
          setTimeout(() => setIgnoreNextClick(false), 500);
        }}
        footer={null}
        maskClosable={true}
        onClick={(e) => e.stopPropagation()}
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

      <img
        src={data.subjectIcon ? data.subjectIcon : SubjectIcon}
        alt={t("Subject icon")}
        className="absolute bottom-6 right-6 h-20 w-20 transition-transform z-40 duration-300 transform hover:scale-110 object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

export default SubjectCard;
