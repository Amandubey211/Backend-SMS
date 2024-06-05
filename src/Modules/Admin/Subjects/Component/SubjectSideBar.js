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
  
  // Convert sid to lowercase and replace spaces with underscores
  const formattedSid = sid.toLowerCase().replace(/ /g, "_");

  return (
    <div className="flex flex-col min-h-screen h-full w-[18%] space-y-4 p-4 border">
      {menuItems.map((item, index) => (
        <NavLink
          key={index}
          to={`/class/${cid}/${formattedSid}/${item.toLocaleLowerCase()}`}
          className={({ isActive }) =>
            
            isActive
              ? "text-purple-600  font-semibold   bg-purple-100 rounded-full py-1 px-4 "
              : "text-gray-800 px-4 py-1  "
          }
        >
          {item}
        </NavLink>
      ))}
    </div>
  );
};

export default SubjectSideBar;
