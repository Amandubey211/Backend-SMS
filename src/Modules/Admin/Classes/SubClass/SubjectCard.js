import React from "react";
import { LuUser } from "react-icons/lu";
import { BsBook } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import { setSelectedSubject } from "../../../../Redux/Slices/Common/CommonSlice";
import { useDispatch } from "react-redux";
import Icon1 from "../../../../Assets/ClassesAssets/SubClassAssets/SubjectIcons/image1.png";

const SubjectCard = ({ data, backgroundColor, Class }) => {
  const formattedSid = data.name.toLowerCase().replace(/ /g, "_");
  const dispatch = useDispatch();

  return (
    <div
      className={`relative rounded-xl p-4 shadow-lg ${backgroundColor} transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl`}
    >
      <div className="flex justify-between items-center mb-4">
        <button className="border border-white text-white rounded-full px-4 py-1">
          {data.isPublished ? "Published" : "Publish"}
        </button>
      </div>
      <NavLink
        to={`/class/${Class}/${formattedSid}/module`}
        onClick={() => dispatch(setSelectedSubject(data.name))}
        className="block"
      >
        <h2 className="text-xl font-bold capitalize text-white w-[65%] transition-colors duration-300 hover:underline">
          {data.name}
        </h2>
        <div className="flex items-center mt-2 text-white">
          <span className="flex items-center mr-2 gap-1">
            <LuUser />
            <span>{data.students ? data.students.length : 0}</span>
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
          <p className="text-white  text-sm">{data.teacherRole || "Teacher"}</p>
        </div>
      </div>
      <img
        src={data.icon || Icon1}
        alt="icon"
        className="absolute bottom-6 right-6 h-28 transition-transform duration-300 transform hover:scale-110"
      />
    </div>
  );
};

export default SubjectCard;
