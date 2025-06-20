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
  backgroundColor = "#FCD34D",
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
    teachers = [],
    isOptional = true,
    subjectIcon = "",
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
    e.stopPropagation();
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

  // Determine progress bar color
  const getProgressColor = () => {
    if (percentage < 33) return "#FF6347"; // Red
    if (percentage < 50) return "#FFA500"; // Orange
    if (percentage < 75) return "#FFD700"; // Gold
    return "#32CD32"; // Green
  };

  return (
    <div
      className={`
        relative rounded-xl p-4 shadow-lg overflow-hidden
        hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 
        cursor-pointer min-h-[220px] flex flex-col justify-between
        group
      `}
      style={{ backgroundColor }}
      onClick={handleCardClick}
    >
      {/* Optional badge */}
      {isOptional && (
        <span className="absolute top-2 left-2 rounded-full px-3 py-1 bg-white bg-opacity-90 text-blue-600 text-xs font-medium z-10 shadow-sm">
          Optional
        </span>
      )}

      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-white bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />

      {/* Top row */}
      <div className="flex justify-between items-start">
        {/* Subject info */}
        <div className="flex flex-col space-y-1 mt-6 z-10">
          <h2 className="text-xl font-bold capitalize text-white drop-shadow-md">
            {subjectName}
          </h2>
          <div className="flex items-center text-white text-sm space-x-2">
            <div className="flex items-center gap-1">
              <BsBook className="opacity-80" />
              <span>{moduleCount} Modules</span>
            </div>
            <span className="opacity-50">|</span>
            <div className="flex items-center gap-1">
              <MdMenuBook className="opacity-80" />
              <span>{chapterCount} Chapters</span>
            </div>
          </div>
        </div>

        {/* Enhanced circular progress */}
        <div className="relative z-10" style={{ width: 68, height: 68 }}>
          {/* Outer glow */}
          <div
            className="absolute rounded-full"
            style={{
              width: "100%",
              height: "100%",
              top: 0,
              left: 0,
              boxShadow: `0 0 12px ${getProgressColor()}40`,
              opacity: 0.7,
            }}
          />

          {/* Metallic ring */}
          <div
            className="absolute rounded-full border-2 border-white border-opacity-30"
            style={{
              width: "calc(100% - 4px)",
              height: "calc(100% - 4px)",
              top: "2px",
              left: "2px",
              boxShadow: `
                inset 0 0 8px rgba(255,255,255,0.6),
                0 0 4px rgba(255,255,255,0.4)
              `,
            }}
          >
            <CircularProgressbar
              value={percentage}
              text={`${percentage}%`}
              strokeWidth={10}
              styles={buildStyles({
                rotation: 0,
                strokeLinecap: "round",
                textSize: "20px",
                pathTransitionDuration: 0.8,
                pathColor: getProgressColor(),
                textColor: "#fff",
                trailColor: "rgba(255,255,255,0.2)",
                backgroundColor: "transparent",
                text: {
                  fontWeight: "bold",
                  filter: "drop-shadow(0 0 2px rgba(0,0,0,0.3))",
                },
              })}
            />
          </div>
        </div>
      </div>

      {/* Teacher avatars */}
      <div className="mt-6 z-10">
        {teacherCount > 0 ? (
          <div className="flex items-center" onClick={openTeacherModal}>
            <div className="flex -space-x-3">
              {teacherCount > maxAvatarsToShow ? (
                <>
                  {teachers.slice(0, maxAvatarsToShow).map((teacher, index) => (
                    <Tooltip
                      key={`teacher-${index}`}
                      title={teacher.name || "No Name"}
                    >
                      <div className="w-9 h-9 rounded-full border-2 border-white overflow-hidden transition-transform hover:scale-110 hover:z-10">
                        {teacher.profile ? (
                          <img
                            src={teacher.profile}
                            alt={teacher.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full bg-gray-300">
                            <CiUser className="text-white w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </Tooltip>
                  ))}
                  <Tooltip title={`${teacherCount - maxAvatarsToShow} more`}>
                    <div className="relative w-9 h-9 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      +{teacherCount - maxAvatarsToShow}
                    </div>
                  </Tooltip>
                </>
              ) : (
                teachers.map((teacher, index) => (
                  <Tooltip
                    key={`teacher-${index}`}
                    title={teacher.name || "No Name"}
                  >
                    <div className="w-9 h-9 rounded-full border-2 border-white overflow-hidden transition-transform hover:scale-110">
                      {teacher.profile ? (
                        <img
                          src={teacher.profile}
                          alt={teacher.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-gray-300">
                          <CiUser className="text-white w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </Tooltip>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center text-white text-opacity-80">
            <CiUser className="w-5 h-5 mr-2" />
            <span className="text-sm">No instructor</span>
          </div>
        )}
      </div>

      {/* Subject icon */}
      <img
        src={subjectIcon || ClassCardBookImg}
        alt="Subject"
        className="absolute bottom-3 right-3 h-16 w-16 object-contain opacity-90 transition-all duration-300 group-hover:opacity-100 group-hover:scale-110"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Teacher modal */}
      <Modal
        title="Instructors"
        open={isTeacherModalOpen}
        onCancel={closeTeacherModal}
        footer={null}
        maskClosable={true}
        centered
      >
        <div className="space-y-3">
          {teachers.map((teacher, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg"
            >
              {teacher.profile ? (
                <img
                  src={teacher.profile}
                  alt={teacher.name}
                  className="w-10 h-10 rounded-full object-cover border"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <CiUser className="text-gray-500 w-5 h-5" />
                </div>
              )}
              <span className="font-medium">{teacher.name || "Unknown"}</span>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default SubjectCard;
