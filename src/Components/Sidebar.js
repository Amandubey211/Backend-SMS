import React from "react";
import StudentDiwanLogo from "../Assets/HomeAssets/StudentDiwanLogo.png";
import {
  FaChalkboardTeacher,
  FaUsers,
  FaBook,
  FaUserGraduate,
  FaClipboardList,
  FaUniversity,
} from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen }) => {
  return (
    <nav
      className={`transition-all duration-300 h-screen p-4 bg-white shadow ${
        isOpen ? "w-[15%]" : "w-[8%]"
      }`}
    >
      <div className="flex items-center justify-center p-2">
        <img
          src={StudentDiwanLogo}
          alt="Logo"
          className={`transition-width duration-300 ${
            isOpen ? "w-36 " : "w-28 "
          }`}
        />
      </div>
      <div className="mt-4">
        {isOpen && <h2 className="text-gray-500">MENU</h2>}
        <ul className="mt-2 space-y-2">
          <NavLink
            className={`flex items-center p-2 text-purple-500 bg-purple-100 rounded-lg ${
              isOpen ? "" : "justify-center"
            }`}
          >
            <FaChalkboardTeacher className="w-5 h-5" />
            {isOpen && (
              <span role="presentation" className="ml-3">
                Dashboard
              </span>
            )}
          </NavLink>
          <NavLink
            className={`flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg ${
              isOpen ? "" : "justify-center"
            }`}
          >
            <FaUniversity className="w-5 h-5" />
            {isOpen && (
              <span role="presentation" className="ml-3">
                Classes
              </span>
            )}
          </NavLink>
          <NavLink
            className={`flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg ${
              isOpen ? "" : "justify-center"
            }`}
          >
            <FaUsers className="w-5 h-5" />
            {isOpen && (
              <span role="presentation" className="ml-3">
                Users
              </span>
            )}
          </NavLink>

          <NavLink
            className={`flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg ${
              isOpen ? "" : "justify-center"
            }`}
          >
            <FaBook className="w-5 h-5" />
            {isOpen && (
              <span role="presentation" className="ml-3">
                Accounting
              </span>
            )}
          </NavLink>
          <NavLink
            className={`flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg ${
              isOpen ? "" : "justify-center"
            }`}
          >
            <FaUserGraduate className="w-5 h-5" />
            {isOpen && (
              <span role="presentation" className="ml-3">
                Graduated
              </span>
            )}
          </NavLink>

          <NavLink
            className={`flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg ${
              isOpen ? "" : "justify-center"
            }`}
          >
            <FaClipboardList className="w-5 h-5" />
            {isOpen && (
              <span role="presentation" className="ml-3">
                Admissions
              </span>
            )}
          </NavLink>
          <NavLink
            className={`flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg ${
              isOpen ? "" : "justify-center"
            }`}
          >
            <FaClipboardList className="w-5 h-5" />
            {isOpen && (
              <span role="presentation" className="ml-3">
                Noticeboard
              </span>
            )}
          </NavLink>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
