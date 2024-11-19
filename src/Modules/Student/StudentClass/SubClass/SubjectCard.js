import React from "react";
import { LuUser } from "react-icons/lu";
import { BsBook } from "react-icons/bs";
import { NavLink, useNavigate } from "react-router-dom";
import ClassCardBookImg from "../../../../Assets/ClassesAssets/ClassCardBook.png";
import { TbProgress } from "react-icons/tb";
import profileImage from "../../../../Assets/DashboardAssets/profileIcon.png";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { setSubject } from "../../../../Store/Slices/Student/MyClass/Class/Subjects/subjectSlice";
import { useDispatch, useSelector } from "react-redux";
import { CiUser } from "react-icons/ci";

const SubjectCard = ({
  data,
  backgroundColor,
  classId,
  onSubjectClick,
  currentProgress,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log("Subjects is : ", data);
  const percentage = currentProgress?.percentageValue;
  console.log("subject progress", currentProgress);

  console.log("subject detail ::==>", data.subjectId);

  const handleSubjectClicked = () => {
    dispatch(
      setSubject({ subjectId: data?.subjectId, subjectName: data?.subjectName })
    );
    navigate(`/student_class/${classId}/${data?.subjectId}/module`);
  };

  return (
    // <div
    //   onClick={handleSubjectClicked}
    //   className={`relative rounded-xl cursor-pointer p-4 shadow-lg ${backgroundColor} border border-gray-100`}
    // >
    //   <div className="flex justify-end items-center mb-4">
    //     {currentProgress && (
    //       <div style={{ width: 60, height: 60 }}>
    //         <CircularProgressbar
    //           value={percentage}
    //           text={`${percentage}%`}
    //           styles={buildStyles({
    //             rotation: 0,
    //             strokeLinecap: "round",
    //             textSize: "20px",
    //             pathTransitionDuration: 0.5,
    //             pathColor:
    //               percentage < 33
    //                 ? "#FF6347" // Red for < 33%
    //                 : percentage < 50
    //                 ? "#FFA500" // Orange for < 50%
    //                 : percentage < 75
    //                 ? "#FFD700" // Yellow for < 75%
    //                 : "#32CD32", // Green for 75% and above
    //             textColor: "#000", // Black text color for clarity
    //             trailColor: "#f4e7ff", // Light purple for the empty part
    //             backgroundColor: "#DA70D6", // Light purple/pinkish background color
    //           })}
    //         />
    //       </div>
    //     )}
    //   </div>
    //   {/* <NavLink to={`/student_class/${classId}/${data.subjectId}/module`}> */}
    //   <h2 className="text-xl font-bold text-white w-[65%]">
    //     {data?.subjectName}
    //   </h2>
    //   <div className="flex items-center mt-2 text-white">
    //     <span className="flex items-center mr-2 gap-1">
    //       <LuUser />
    //       <span>{data?.studentCount || 0}</span>
    //     </span>
    //     <span className="border-r-2 border-white h-5 mr-2"></span>
    //     <span className="flex items-center gap-1">
    //       <BsBook />
    //       <span>{data?.moduleCount || 0} Modules</span>
    //     </span>
    //   </div>
    //   {/* </NavLink> */}
    //   <div className="flex items-center mt-12">
    //     {data.teacherProfile ? (
    //       <img
    //         src={data.teacherProfile}
    //         alt="Teacher Profile"
    //         className="w-12 h-12 rounded-full transition-transform duration-300 transform hover:scale-110"
    //       />
    //     ) : (
    //       <CiUser className="w-10 h-10 bg-transparent text-white " />
    //     )}

    //     <div className="ml-3">
    //       <p className="text-white font-semibold">
    //         {data?.teacher || "No teacher assigned"}
    //       </p>
    //       <p className="text-white text-sm">Teacher</p>
    //     </div>
    //   </div>
    //   <img
    //     src={ClassCardBookImg}
    //     alt="icon"
    //     className="absolute bottom-6 right-6 h-28"
    //   />
    // </div>

    <div
      onClick={handleSubjectClicked}
      className={`relative rounded-xl cursor-pointer p-4 shadow-lg ${backgroundColor} border border-gray-100`}
    >
      {/* Subject Name and Progress Bar */}
      <div className="flex justify-between items-start mt-4">
        <div className="flex flex-col items-start justify-start">
          <h2 className="text-xl capitalize font-bold text-white">
            {data?.subjectName}
          </h2>

          <div className="flex items-center mt-2  text-white">
            <span className="flex items-center mr-2 gap-1">
              <LuUser />
              <span>{data?.studentCount || 0}</span>
            </span>
            <span className="border-r-2 border-white h-5 mr-2"></span>
            <span className="flex items-center gap-1">
              <BsBook />
              <span>{data?.moduleCount || 0} Modules</span>
            </span>
          </div>
        </div>

        {currentProgress && (
          <div style={{ width: 70, height: 70 }} className="ml-2">
            <CircularProgressbar
              value={percentage}
              text={`${percentage}%`}
              styles={buildStyles({
                rotation: 0,
                strokeLinecap: "round",
                textSize: "20px",
                pathTransitionDuration: 0.5,
                pathColor:
                  percentage < 33
                    ? "#FF6347" // Red for < 33%
                    : percentage < 50
                    ? "#FFA500" // Orange for < 50%
                    : percentage < 75
                    ? "#FFD700" // Yellow for < 75%
                    : "#32CD32", // Green for 75% and above
                textColor: "#000", // Black text color for clarity
                trailColor: "#f4e7ff", // Light purple for the empty part
                backgroundColor: "#DA70D6", // Light purple/pinkish background color
              })}
            />
          </div>
        )}
      </div>

      {/* Student Count and Modules Section */}

      {/* Teacher Info */}
      <div className="flex items-end justify-between mt-8">
        <div className="flex items-center">
          {data.teacherProfile ? (
            <img
              src={data.teacherProfile}
              alt="Teacher Profile"
              className="w-12 h-12 rounded-full transition-transform duration-300 transform hover:scale-110 object-cover"
            />
          ) : (
            <CiUser className="w-10 h-10 bg-transparent text-white" />
          )}

          <div className="ml-3">
            <p className="text-white font-semibold">
              {data?.teacher || "No teacher assigned"}
            </p>
            <p className="text-white text-sm">Teacher</p>
          </div>
        </div>
        <img src={ClassCardBookImg} alt="icon" className="h-28" />
      </div>
    </div>
  );
};

export default SubjectCard;
