import React from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Tooltip } from "antd";

const SubjectSideBar = () => {
  const { t } = useTranslation("admModule");
  const location = useLocation();
  const { cid, sid } = useParams();

  // Convert sid to lowercase and replace spaces with underscores
  const formattedSid = sid.toLowerCase().replace(/ /g, "_");

  const menuItems = [ 
    { name: "Module", path: "module" },
    { name: "Assignments", path: "assignment" },
    { name: "Quizzes", path: "quiz" },
    { name: "Offline Exam", path: "offline_exam" },
    { name: "Discussions", path: "discussions" },
    { name: "Page", path: "page" },
    { name: "Grades", path: "grades" },
    { name: "Announcements", path: "announcements" },
    { name: "Syllabus", path: "syllabus" },
    { name: "Rubric", path: "rubric" },
  ];

  const getBasePath = (item) => `/class/${cid}/${formattedSid}/${item.path}`;

  return (
    <div className="flex flex-col min-h-screen h-full w-[16%] space-y-3 p-3 border-r">
      {menuItems?.map((item, index) => {
        const basePath = getBasePath(item);
        const isActive = location.pathname.includes(
          `/class/${cid}/${formattedSid}/${item.path}`
        );

        return (
          <Tooltip key={index} title={t(item.name)} placement="right">
            <NavLink
              to={basePath}
              className={`${
                isActive
                  ? "text-purple-600 font-semibold bg-purple-100 rounded-full py-1 px-4"
                  : "text-gray-800 px-4 py-1"
              } hover:bg-purple-200 hover:text-purple-500 hover:rounded-full`}
              style={{
                transition: "background-color 0.2s ease, color 0.2s ease",
              }}
            >
              {t(item.name)}
            </NavLink>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default SubjectSideBar;
