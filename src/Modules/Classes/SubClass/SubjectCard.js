// src/components/SubjectCard.js
import React from "react";
import { LuUser } from "react-icons/lu";
import { BsBook } from "react-icons/bs";

const SubjectCard = ({ data, backgroundColor }) => {
  return (
    <div className={`relative rounded-xl p-4 shadow-lg ${backgroundColor}`}>
      <div className="flex justify-between items-center mb-4">
        <button className="border border-white text-white rounded-full px-4 py-1">
          Publish
        </button>
      </div>
      <h2 className="text-xl font-bold text-white w-[65%]">{data.title}</h2>
      <div className="flex items-center mt-2 text-white">
        <span className="flex items-center mr-2 gap-1">
          <LuUser />
          <span>{data.students}</span>
        </span>
        <span className="border-r-2 border-white h-5 mr-2"></span>
        <span className="flex items-center gap-1">
          <BsBook />
          <span>{data.modules} Modules</span>
        </span>
      </div>
      <div className="flex items-center mt-12">
        <img
          src={data.teacherImage}
          alt="teacher"
          className="w-12 h-12 rounded-full"
        />
        <div className="ml-3">
          <p className="text-white font-semibold">{data.teacherName}</p>
          <p className="text-white text-sm">{data.teacherRole}</p>
        </div>
      </div>
      <img
        src={data.icon}
        alt="icon"
        className="absolute bottom-6 right-6 h-28"
      />
    </div>
  );
};

export default SubjectCard;
