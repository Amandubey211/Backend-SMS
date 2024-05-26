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
            to="/dash"
            className={({ isActive }) =>
              `flex items-center p-2 rounded-lg ${
                isActive
                  ? "text-purple-500 bg-purple-100"
                  : "text-gray-700 hover:bg-gray-100"
              } ${isOpen ? "" : "justify-center"}`
            }
          >
            <FaChalkboardTeacher className="w-5 h-5" />
            {isOpen && (
              <span role="presentation" className="ml-3">
                Dashboard
              </span>
            )}
          </NavLink>
          <NavLink
            to="/classes"
            className={({ isActive }) =>
              `flex items-center p-2 rounded-lg ${
                isActive
                  ? "text-purple-500 bg-purple-100"
                  : "text-gray-700 hover:bg-gray-100"
              } ${isOpen ? "" : "justify-center"}`
            }
          >
            <FaUniversity className="w-5 h-5" />
            {isOpen && (
              <span role="presentation" className="ml-3">
                Classes
              </span>
            )}
          </NavLink>
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `flex items-center p-2 rounded-lg ${
                isActive
                  ? "text-purple-500 bg-purple-100"
                  : "text-gray-700 hover:bg-gray-100"
              } ${isOpen ? "" : "justify-center"}`
            }
          >
            <FaUsers className="w-5 h-5" />
            {isOpen && (
              <span role="presentation" className="ml-3">
                Users
              </span>
            )}
          </NavLink>

          <NavLink
            to="/accounting"
            className={({ isActive }) =>
              `flex items-center p-2 rounded-lg ${
                isActive
                  ? "text-purple-500 bg-purple-100"
                  : "text-gray-700 hover:bg-gray-100"
              } ${isOpen ? "" : "justify-center"}`
            }
          >
            <FaBook className="w-5 h-5" />
            {isOpen && (
              <span role="presentation" className="ml-3">
                Accounting
              </span>
            )}
          </NavLink>
          <NavLink
            to="/graduated"
            className={({ isActive }) =>
              `flex items-center p-2 rounded-lg ${
                isActive
                  ? "text-purple-500 bg-purple-100"
                  : "text-gray-700 hover:bg-gray-100"
              } ${isOpen ? "" : "justify-center"}`
            }
          >
            <FaUserGraduate className="w-5 h-5" />
            {isOpen && (
              <span role="presentation" className="ml-3">
                Graduated
              </span>
            )}
          </NavLink>

          <NavLink
            to="/admissions"
            className={({ isActive }) =>
              `flex items-center p-2 rounded-lg ${
                isActive
                  ? "text-purple-500 bg-purple-100"
                  : "text-gray-700 hover:bg-gray-100"
              } ${isOpen ? "" : "justify-center"}`
            }
          >
            <FaClipboardList className="w-5 h-5" />
            {isOpen && (
              <span role="presentation" className="ml-3">
                Admissions
              </span>
            )}
          </NavLink>
          <NavLink
            to="/noticeboard"
            className={({ isActive }) =>
              `flex items-center p-2 rounded-lg ${
                isActive
                  ? "text-purple-500 bg-purple-100"
                  : "text-gray-700 hover:bg-gray-100"
              } ${isOpen ? "" : "justify-center"}`
            }
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
