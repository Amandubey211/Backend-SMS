<<<<<<< HEAD
import React from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";

const SubjectSideBar = () => {
  const location = useLocation();
  const { cid, sid } = useParams();

  // Convert sid to lowercase and replace spaces with underscores
  const formattedSid = sid.toLowerCase().replace(/ /g, "_");

  const menuItems = [
    { name: "Module", path: "module" },
    { name: "Assignments", path: "assignments" },
    { name: "Quizzes", path: "quizzes" },
    { name: "Discussions", path: "discussions" },
    { name: "Page", path: "page" },
    { name: "Grades", path: "grades" },
    { name: "Announcements", path: "announcements" },
    { name: "Syllabus", path: "syllabus" },
    { name: "Rubric", path: "rubric" },
  ];

  const getBasePath = (item) => `/class/${cid}/${formattedSid}/${item.path}`;

  return (
    <div className="flex flex-col min-h-screen h-full w-[18%] space-y-4 p-4">
      {menuItems.map((item, index) => {
        const basePath = getBasePath(item);
        const isActive = location.pathname.includes(`/class/${cid}/${formattedSid}/${item.path}`);


        return (
          <NavLink
            key={index}
            to={basePath}
            className={
              isActive
                ? "text-purple-600 font-semibold bg-purple-100 rounded-full py-1 px-4"
                : "text-gray-800 px-4 py-1"
            }
          >
            {item.name}
          </NavLink>
        );
      })}
    </div>
  );
};

export default SubjectSideBar;
=======
import React from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";

const SubjectSideBar = () => {
  const location = useLocation();
  const { cid, sid } = useParams();

  // Convert sid to lowercase and replace spaces with underscores
  const formattedSid = sid.toLowerCase().replace(/ /g, "_");

  const menuItems = [
    { name: "Module", path: "module" },
    { name: "Assignments", path: "assignment" },
    { name: "Quizzes", path: "quizzes" },
    { name: "Discussions", path: "discussions" },
    { name: "Page", path: "page" },
    { name: "Grades", path: "grades" },
    { name: "Announcements", path: "announcements" },
    { name: "Syllabus", path: "syllabus" },
    { name: "Rubric", path: "rubric" },
  ];

  const getBasePath = (item) => `/class/${cid}/${formattedSid}/${item.path}`;

  return (
    <div className="flex flex-col min-h-screen h-full w-[18%] space-y-4 p-4">
      {menuItems.map((item, index) => {
        const basePath = getBasePath(item);
        const isActive = location.pathname.includes(`/class/${cid}/${formattedSid}/${item.path}`);


        return (
          <NavLink
            key={index}
            to={basePath}
            className={
              isActive
                ? "text-purple-600 font-semibold bg-purple-100 rounded-full py-1 px-4"
                : "text-gray-800 px-4 py-1"
            }
          >
            {item.name}
          </NavLink>
        );
      })}
    </div>
  );
};

export default SubjectSideBar;
>>>>>>> main
