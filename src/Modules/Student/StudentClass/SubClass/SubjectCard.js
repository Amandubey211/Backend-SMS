import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Modal, Tooltip } from "antd";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

/* Icons */
import { CiUser } from "react-icons/ci";
import { MdMenuBook } from "react-icons/md";
import { BsBook } from "react-icons/bs";

/* Redux Action */
import { setSubject } from "../../../../Store/Slices/Student/MyClass/Class/Subjects/subjectSlice";

/* Assets */
import ClassCardBookImg from "../../../../Assets/ClassesAssets/ClassCardBook.png";

const SubjectCard = ({
  data = {},
  backgroundColor = "#FCD34D", // Fallback if no color is provided
  classId = "",
  currentProgress = null,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Pull out fields with fallback
  const {
    subjectId = "",
    subjectName = "Untitled Subject",
    moduleCount = 0,
    chapterCount = 0,
    teachers = [], // Array of { name: string, profile: string }
    isOptional = true, // Show "Optional" badge if true
    subjectIcon = "", // Fallback if no custom icon
  } = data;

  // Circular Progress fallback
  const percentage = currentProgress?.percentageValue || 0;

  // Navigate on card click
  const handleCardClick = () => {
    dispatch(
      setSubject({
        subjectId,
        subjectName,
      })
    );
    navigate(`/student_class/${classId}/${subjectId}/module`);
  };

  // Teacher list modal
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const openTeacherModal = (e) => {
    e.stopPropagation(); // Prevent card click
    setIsTeacherModalOpen(true);
  };
  const closeTeacherModal = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsTeacherModalOpen(false);
  };

  // Limit teacher avatars if more than 4
  const teacherCount = Array.isArray(teachers) ? teachers.length : 0;
  const maxAvatarsToShow = 4;

  return (
    <div
      className={`
        relative rounded-xl p-4 shadow-lg 
        hover:shadow-2xl hover:scale-105 transition-transform duration-300 
        cursor-pointer min-h-[220px] flex flex-col justify-between
      `}
      style={{ backgroundColor }}
      onClick={handleCardClick}
    >
      {/* OPTIONAL BADGE AT TOP-LEFT (ABSOLUTE) */}
      {isOptional && (
        <span className="absolute top-2 left-2 border border-white rounded-full px-3 py-1 bg-blue-100 text-blue-600 text-sm z-10">
          Optional
        </span>
      )}

      {/* TOP ROW: Subject details on the left, progress bar on the right */}
      <div className="flex justify-between items-center">
        {/* Left Side: Subject name, modules & chapters */}
        <div className="flex flex-col space-y-1 mt-8">
          {/* Subject name */}
          <h2 className="text-xl font-bold capitalize text-white">
            {subjectName}
          </h2>

          {/* Modules & Chapters with a divider */}
          <div className="flex items-center text-white text-sm space-x-2">
            {/* Modules */}
            <div className="flex items-center gap-1">
              <BsBook />
              <span>{moduleCount} Modules</span>
            </div>

            {/* Divider */}
            <span className="text-white">|</span>

            {/* Chapters */}
            <div className="flex items-center gap-1">
              <MdMenuBook />
              <span>{chapterCount} Chapters</span>
            </div>
          </div>
        </div>

        {/* Right Side: Circular Progress */}
        <div style={{ width: 60, height: 60 }}>
          <CircularProgressbar
            value={percentage}
            text={`${percentage}%`}
            strokeWidth={11} // Make the progress bar thicker
            styles={buildStyles({
              rotation: 0,
              strokeLinecap: "round",
              textSize: "18px",
              pathTransitionDuration: 0.5,
              pathColor:
                percentage < 33
                  ? "#FF6347" // Red for < 33%
                  : percentage < 50
                  ? "#FFA500" // Orange for < 50%
                  : percentage < 75
                  ? "#FFD700" // Yellow for < 75%
                  : "#32CD32", // Green for 75%+
              textColor: "#000",
              trailColor: "#f4e7ff",
              backgroundColor: "#DA70D6",
            })}
          />
        </div>
      </div>

      {/* TEACHER AVATARS */}
      <div className="mt-6">
        {teacherCount > 0 ? (
          <div className="flex items-center" onClick={openTeacherModal}>
            <div className="flex -space-x-3">
              {teacherCount > maxAvatarsToShow ? (
                <>
                  {/* Show up to 4 avatars */}
                  {teachers.slice(0, maxAvatarsToShow).map((teacher, index) => (
                    <Tooltip
                      key={`teacher-${index}`}
                      title={teacher.name || "No Name"}
                      placement="top"
                    >
                      <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                        {teacher.profile ? (
                          <img
                            src={teacher.profile}
                            alt={teacher.name || "Teacher"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full bg-gray-300">
                            <CiUser className="text-white w-5 h-5" />
                          </div>
                        )}
                      </div>
                    </Tooltip>
                  ))}

                  {/* +X bubble for extra teachers */}
                  <Tooltip title="Click to see more" placement="top">
                    <div className="relative w-10 h-10 p-[2px] bg-gradient-to-tr from-pink-500 to-purple-500 rounded-full">
                      <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-sm font-medium">
                        <span className="bg-gradient-to-tr from-pink-500 to-purple-500 bg-clip-text text-transparent text-md font-semibold">
                          +{teacherCount - maxAvatarsToShow}
                        </span>
                      </div>
                    </div>
                  </Tooltip>
                </>
              ) : (
                teachers.map((teacher, index) => (
                  <Tooltip
                    key={`teacher-${index}`}
                    title={teacher.name || "No Name"}
                    placement="top"
                  >
                    <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                      {teacher.profile ? (
                        <img
                          src={teacher.profile}
                          alt={teacher.name || "Teacher"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-gray-300">
                          <CiUser className="text-white w-5 h-5" />
                        </div>
                      )}
                    </div>
                  </Tooltip>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center">
            <CiUser className="w-8 h-8 text-white" />
            <div className="ml-3 text-white font-semibold">
              No Instructor Assigned
            </div>
          </div>
        )}
      </div>

      {/* SUBJECT ICON at bottom-right */}
      <img
        src={subjectIcon || ClassCardBookImg}
        alt="Subject Icon"
        className="absolute bottom-4 right-4 h-20 w-20 object-contain
                   transition-transform duration-300 transform hover:scale-110"
        onClick={(e) => e.stopPropagation()} // prevent triggering handleCardClick
      />

      {/* FULL TEACHER LIST MODAL */}
      <Modal
        title="Teacher List"
        open={isTeacherModalOpen}
        onCancel={closeTeacherModal}
        footer={null}
        maskClosable={true}
      >
        <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
          {teachers.map((teacher, index) => (
            <div key={index} className="flex items-center space-x-3">
              {teacher.profile ? (
                <img
                  src={teacher.profile}
                  alt={teacher.name || "Teacher"}
                  className="w-10 h-10 rounded-full border-white border"
                />
              ) : (
                <CiUser className="w-8 h-8 text-gray-500" />
              )}
              <div>
                <p className="font-semibold">{teacher.name || "Unknown"}</p>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default SubjectCard;
