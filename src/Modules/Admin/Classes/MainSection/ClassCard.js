import React from "react";
import leftLogo from "../../../../Assets/ClassesAssets/ClassCardLeftLogo.png";
import RightLogo from "../../../../Assets/ClassesAssets/ClassCardRightLogo.png";
import centerLogo from "../../../../Assets/ClassesAssets/ClassCardCenterLogo.png";
import { NavLink } from "react-router-dom";

const ClassCard = ({
  className,
  classurl,
  teachers,
  students,
  sections,
  groups,
}) => (
  <NavLink
    to={`/class/${classurl}`}
    className="group p-1 pb-4 border rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-110 hover:shadow-xl"
  >
    <div className="flex justify-between items-center px-1">
      <img
        src={leftLogo}
        className="w-10 opacity-50 transition-opacity duration-300 group-hover:opacity-90"
        alt="class_logo"
      />
      <img
        src={RightLogo}
        className="w-10 opacity-50 transition-opacity duration-300 group-hover:opacity-90"
        alt="class_logo"
      />
    </div>
    <div className="flex flex-col gap-1 justify-center items-center -mt-4">
      <h2 className="text-xl font-bold text-purple-600">{className}</h2>
      <p>{teachers} Teachers</p>
      <img src={centerLogo} className="w-20" alt="center_logo" />
    </div>
    <div className="flex justify-between items-center px-3">
      <div className="flex flex-col items-center gap-1">
        <p className="opacity-50">Students</p>
        <span className="font-bold">{students}</span>
      </div>
      <div className="flex border-x px-4 border-opacity-45 border-black flex-col items-center gap-1">
        <p className="opacity-50">Section</p>
        <span className="font-bold">{sections}</span>
      </div>
      <div className="flex items-center flex-col gap-1">
        <p className="opacity-50">Group</p>
        <span className="font-bold">{groups}</span>
      </div>
    </div>
  </NavLink>
);

export default ClassCard;
