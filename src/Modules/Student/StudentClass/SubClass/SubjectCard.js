import React from "react";
import { LuUser } from "react-icons/lu";
import { BsBook } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import ClassCardBookImg from "../../../../Assets/ClassesAssets/ClassCardBook.png";
import { TbProgress } from "react-icons/tb";
import profileImage from '../../../../Assets/DashboardAssets/profileIcon.png'

const SubjectCard = ({data,backgroundColor, classId, onSubjectClick }) => {
  console.log("Subjects is : ", data);

  return (
    <div
      className={`relative rounded-xl cursor-pointer p-4 shadow-lg ${backgroundColor} border border-gray-100`}
      onClick={() =>
        onSubjectClick({
          subjectId: data?.subjectId,
          subjectName: data?.subjectName,
        })
      }
    >
      <div className="flex justify-between items-center mb-4">
        <button className="border border-white text-white rounded-full px-4 py-1">
          {data?.isPublished ? "Publish" : "Unpublish"}
        </button>
        <TbProgress size={50} color={"white"} />
      </div>
      {/* <NavLink to={`/student_class/${classId}/${data.subjectId}/module`}> */}
        <h2 className="text-xl font-bold text-white w-[65%]">
          {data?.subjectName}
        </h2>
        <div className="flex items-center mt-2 text-white">
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
      {/* </NavLink> */}
      <div className="flex items-center mt-12">
        <div className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center">
          <img
            src={data?.teacherProfile || profileImage}
            className="w-full h-full rounded-full object-contain" // Adjust size if needed
          />
        </div>
        <div className="ml-3">
          <p className="text-white font-semibold">{data?.teacher || "No teacher assigned"}</p>
          <p className="text-white text-sm">Teacher</p>
        </div>
      </div>
      <img
        src={ClassCardBookImg}
        alt="icon"
        className="absolute bottom-6 right-6 h-28"
      />
    </div>
  );
};

export default SubjectCard;
