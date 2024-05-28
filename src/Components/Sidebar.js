import React, { useState } from "react";
import StudentDiwanLogo from "../Assets/HomeAssets/StudentDiwanLogo.png";
import {
  FaChalkboardTeacher,
  FaUsers,
  FaBook,
  FaUserGraduate,
  FaClipboardList,
  FaUniversity,
  FaCaretDown,
  FaCaretUp,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen }) => {
  const [isUsersDropdownOpen, setIsUsersDropdownOpen] = useState(false);

  const toggleUsersDropdown = () => {
    setIsUsersDropdownOpen((prev) => !prev);
  };

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
            isOpen ? "w-36" : "w-28"
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
          <div>
            <div
              className={`flex items-center p-2 rounded-lg cursor-pointer ${
                isUsersDropdownOpen
                  ? "bg-purple-100 text-purple-500"
                  : "text-gray-700 hover:bg-gray-100"
              } ${isOpen ? "" : "justify-center"}`}
              onClick={toggleUsersDropdown}
            >
              <FaUsers className="w-5 h-5" />
              {isOpen && (
                <span role="presentation" className="ml-3 flex items-center">
                  Users{" "}
                  {isUsersDropdownOpen ? (
                    <FaCaretUp className="ml-2" />
                  ) : (
                    <FaCaretDown className="ml-2" />
                  )}
                </span>
              )}
            </div>
            {isUsersDropdownOpen && (
              <ul className="pl-8 space-y-2">
                <NavLink
                  to="/users/students"
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
                      Students
                    </span>
                  )}
                </NavLink>
                <NavLink
                  to="/users/teachers"
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
                      Teachers
                    </span>
                  )}
                </NavLink>
              </ul>
            )}
          </div>
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
          <NavLink
            to="/verify_students"
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
                Verification
              </span>
            )}
          </NavLink>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
