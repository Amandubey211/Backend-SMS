import React, { useState } from "react";
import "tailwindcss/tailwind.css";
import AddNewStudents from "./AddNewStudents";
import Sidebar from "../../../../Components/Common/Sidebar";
import { NavLink } from "react-router-dom";

const NavigationBar = ({ setActiveSection, activeSection }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);

  const sections = ["Everyone", "Section 1", "Section 2", "Section 3", "Section 4"];

  return (
    <>
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">All Students</h1>
          <span className="bg-purple-200 text-purple-700 rounded-full px-2 py-1 text-sm">
            150
          </span>
        </div>

        <NavLink
          to="/admissions"
          className="flex items-center border border-gray-300 ps-5 py-0 rounded-full"
        >
          <span className="mr-2">Add New Students</span>
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-12 h-12 flex items-center justify-center">
            <span className="text-3xl -mt-2">+</span>
          </div>
        </NavLink>
      </div>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        title="Assign new Students"
      >
        <AddNewStudents />
      </Sidebar>

      <div className="flex space-x-2 px-5">
        {sections.map((section) => (
          <button
            key={section}
            className={`px-4 py-2 rounded-full ${
              activeSection === section
                ? "bg-gradient-to-r from-red-400 to-purple-500 text-white"
                : "border border-gray-300"
            }`}
            onClick={() => setActiveSection(section)}
          >
            {section}
          </button>
        ))}
      </div>
    </>
  );
};

export default NavigationBar;
