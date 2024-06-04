// src/components/Sidebar.js
import React from "react";
import { NavLink, useParams } from "react-router-dom";

const SubjectSideBar = () => {
  const menuItems = [
    "Module",
    "Chapter",
    "Assignments",
    "Quizzes",
    "Discussions",
    "Page",
    "Grades",
    "Announcements",
    "Syllabus",
    "Rubric",
  ];
  const { cid, sid } = useParams();

  return (
    <div className="flex flex-col min-h-screen h-full w-[15%] space-y-4 p-4 border">
      {menuItems.map((item, index) => (
        <NavLink
          key={index}
          to={`/class/${cid}/${sid}/${item}`}
          className={({ isActive }) =>
            isActive
              ? "text-purple-600 font-semibold bg-purple-50 rounded-lg px-4 py-2"
              : "text-gray-800"
          }
        >
          {item}
        </NavLink>
      ))}
    </div>
  );
};

export default SubjectSideBar;
