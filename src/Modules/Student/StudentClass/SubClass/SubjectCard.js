import React from "react";
import { LuUser } from "react-icons/lu";
import { BsBook } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import ClassCardBookImg from "../../../../Assets/ClassesAssets/ClassCardBook.png";
import { useSelector } from "react-redux";
import { TbProgress } from "react-icons/tb";

const SubjectCard = ({ data, IDs, backgroundColor, Class, onSubjectClick }) => {
  console.log("subject idSSSS", data.subjectId);
  console.log("subject Nameisss", data.subjectName);

  console.log(" id", IDs);
  console.log(" classId", IDs.classId);
  console.log(" sectionID", IDs.section?.sectionId);

  const formattedSid = data.subjectId;
  const selectedSubjectId = useSelector(state => state.Common.selectedSubject);
  console.log("Selected Subject ID from Redux:", selectedSubjectId);

  return (
    <div className={`relative rounded-xl p-4 shadow-lg ${backgroundColor}`} 
    // ()}

    // onClick={() => onSubjectClick(data.subjectId)}>
        onClick={() => onSubjectClick({subjectId: data.subjectId, subjectName: data.subjectName})}>

      <div className="flex justify-between items-center mb-4">
        <button className="border border-white text-white rounded-full px-4 py-1">
          {data.isPublished ? "Published" : "Unpublished"}

        </button>
        <TbProgress size={50} color={"white"}/>
      </div>
      <NavLink to={`/student_class/${IDs.classId}/section/${IDs.section?.sectionId}/module`}>
        <h2 className="text-xl font-bold text-white w-[65%]">{data.subjectName}</h2>
        <div className="flex items-center mt-2 text-white">
          <span className="flex items-center mr-2 gap-1">
            <LuUser />
            <span>{data.studentCount}</span>
          </span>
          <span className="border-r-2 border-white h-5 mr-2"></span>
          <span className="flex items-center gap-1">
            <BsBook />
            <span>{data.moduleCount} Modules</span>
          </span>
        </div>
      </NavLink>
      <div className="flex items-center mt-12">
        <img
          src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR55M_UlhGRrK6U32QA4ETW3lQYkfOZrbgvdAibLhPmE7ffAwdvUOq6HvDvo0O9EPDjhY4&usqp=CAU'
          alt="teacher"
          className="w-12 h-12 rounded-full"
        />
        <div className="ml-3">
          <p className="text-white font-semibold">{data.teacher}</p>
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
