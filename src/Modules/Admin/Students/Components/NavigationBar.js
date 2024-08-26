import React, { useCallback } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const NavigationBar = ({ setActiveSection, activeSection, totalStudents }) => {
  const Sections = useSelector((store) => store.Class.sectionsList);
  const role = useSelector((store) => store.Auth.role);

  const getButtonClass = useCallback(
    (section) => {
      return activeSection === section
        ? "relative px-4 py-2 rounded-full bg-gradient-to-r from-red-400 to-purple-500 text-white"
        : "relative px-4 py-2 rounded-full border border-gray-300";
    },
    [activeSection]
  );

  const handleSectionChange = useCallback(
    (section) => {
      setActiveSection(section);
    },
    [setActiveSection]
  );

  return (
    <>
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">All Students</h1>
          <span className="bg-purple-200 text-purple-700 rounded-full px-2 py-1 text-sm">
            {totalStudents}
          </span>
        </div>
        {role === "admin" && (
          <NavLink
            to="/admissions"
            className="flex items-center border border-gray-300 ps-5 py-0 rounded-full"
          >
            <span className="mr-2">Add New Students</span>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-12 h-12 flex items-center justify-center">
              <span className="text-3xl -mt-2">+</span>
            </div>
          </NavLink>
        )}
      </div>
      <div className="flex space-x-2 px-5">
        <button
          className={getButtonClass("Everyone")}
          onClick={() => handleSectionChange("Everyone")}
          aria-pressed={activeSection === "Everyone"}
        >
          Everyone
        </button>
        {Sections?.map((item) => (
          <button
            key={item.sectionName}
            className={getButtonClass(item.sectionName)}
            onClick={() => handleSectionChange(item.sectionName)}
            aria-pressed={activeSection === item.sectionName}
          >
            {item.sectionName}
          </button>
        ))}
      </div>
    </>
  );
};

export default NavigationBar;
