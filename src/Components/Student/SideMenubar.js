import React, { useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import StudentDiwanLogo from "../../Assets/HomeAssets/StudentDiwanLogo.png";
import smallLogo from "../../Assets/SideBarAsset/smallLogo.png";
import sidebarData from "./DataFile/sidebarData";
import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../../Redux/Slices/Common/SidebarSlice";
import useStudentLogout from "../../Hooks/AuthHooks/Student/useStudentLogout";

const isActivePath = (path, locationPath) => locationPath.startsWith(path);

const SideMenubar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { studentLogout } = useStudentLogout();

  const { isOpen, userDetails, role } = useSelector((state) => ({
    isOpen: state.sidebar.isOpen,
    userDetails: state.Auth.userDetail,
    role: state.Auth.role,
  }));

  const [openItems, setOpenItems] = useState([]);

  const toggleDropdown = (title) => {
    setOpenItems((prevOpenItems) =>
      prevOpenItems.includes(title)
        ? prevOpenItems.filter((item) => item !== title)
        : [...prevOpenItems, title]
    );
  };

  return (
    <nav
      className={`transition-all duration-300 h-screen p-1 z-10 px-3 bg-white border-r flex flex-col justify-between ${
        isOpen ? "w-[15%]" : "w-[7%]"
      }`}
      aria-label="Sidebar"
    >
      <div>
        <div className="relative flex items-center justify-center border-b pb-1">
          <NavLink to="/dashboard" aria-label="Dashboard">
            <img
              src={isOpen ? StudentDiwanLogo : smallLogo}
              alt="Logo"
              className={`transition-width duration-300 ${
                isOpen ? "w-36 pt-1" : "h-12"
              }`}
            />
          </NavLink>
          <button
            onClick={(e) => {
              e.stopPropagation();
              dispatch(toggleSidebar());
            }}
            className="absolute bottom-0 right-0"
            aria-label="Toggle Sidebar"
          >
            <div className="p-1 rounded-full text-purple-500 -mr-6 -mb-4 z-40 bg-white border-2">
              {isOpen ? <IoIosArrowBack /> : <IoIosArrowForward />}
            </div>
          </button>
        </div>
        <div className="p-2 flex-grow">
          {isOpen && <h2 className="text-gray-500">MENU</h2>}
          <ul className="space-y-2">
            {sidebarData.map((item, index) => (
              <React.Fragment key={index}>
                {item.items ? (
                  <div
                    className={`flex items-center w-full p-2 rounded-lg cursor-pointer ${
                      isActivePath(item.path, location.pathname) ||
                      (item.items &&
                        item.items.some((subItem) =>
                          isActivePath(subItem.path, location.pathname)
                        ))
                        ? "bg-purple-100 text-purple-500"
                        : "text-gray-700 hover:bg-gray-100"
                    } ${isOpen ? "justify-between" : "justify-center"}`}
                    onClick={() => toggleDropdown(item.title)}
                    role="button"
                    aria-expanded={openItems.includes(item.title)}
                    aria-controls={`submenu-${index}`}
                    tabIndex="0"
                  >
                    <div className="flex justify-center items-center">
                      <span className={`${!isOpen && "text-xl"}`}>
                        {item.icon}
                      </span>
                      {isOpen && (
                        <span
                          role="presentation"
                          className="ml-3 flex items-center"
                        >
                          {item.title}
                        </span>
                      )}
                    </div>
                    {isOpen && (
                      <>
                        {openItems.includes(item.title) ||
                        (item.items &&
                          item.items.some((subItem) =>
                            isActivePath(subItem.path, location.pathname)
                          )) ? (
                          <MdOutlineKeyboardArrowUp className="ml-2 transition-transform transform hover:scale-110" />
                        ) : (
                          <MdOutlineKeyboardArrowDown className="ml-2 transition-transform transform hover:scale-110" />
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <NavLink
                    key={index}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded-lg ${
                        isActive || isActivePath(item.path, location.pathname)
                          ? "text-purple-500 bg-purple-100"
                          : "text-gray-700 hover:bg-gray-100"
                      } ${isOpen ? "" : "justify-center"}`
                    }
                    aria-label={item.title}
                  >
                    <span className={`${!isOpen && "text-xl"}`}>
                      {item.icon}
                    </span>
                    {isOpen && (
                      <span role="presentation" className="ml-3">
                        {item.title}
                      </span>
                    )}
                  </NavLink>
                )}
                {(openItems.includes(item.title) ||
                  (item.items &&
                    item.items.some((subItem) =>
                      isActivePath(subItem.path, location.pathname)
                    ))) &&
                  item.items && (
                    <ul id={`submenu-${index}`} className="pl-2 space-y-2">
                      {item.items.map((subItem, subIndex) => (
                        <NavLink
                          key={subIndex}
                          to={subItem.path}
                          className={({ isActive }) =>
                            `flex items-center p-2 rounded-lg ${
                              isActive ||
                              isActivePath(subItem.path, location.pathname)
                                ? "text-purple-500 bg-purple-100"
                                : "text-gray-700 hover:bg-gray-100"
                            } ${isOpen ? "" : "justify-center"}`
                          }
                          aria-label={subItem.title}
                        >
                          {subItem.icon}
                          {isOpen && (
                            <span role="presentation" className="ml-3">
                              {subItem.title}
                            </span>
                          )}
                        </NavLink>
                      ))}
                    </ul>
                  )}
              </React.Fragment>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-auto p-2">
        <div className="flex items-center justify-between">
          <img
            src={
              userDetails?.profile ||
              "https://avatars.githubusercontent.com/u/109097090?v=4"
            }
            alt="Profile"
            className={`${isOpen ? "w-10 h-10" : "w-8 h-8"} rounded-full`}
          />
          {isOpen && (
            <div className="ml-4">
              <h2 className="text-sm font-semibold">
                {userDetails?.fullName || "User Name"}
              </h2>
              <p className="text-gray-500 capitalize">{role}</p>
            </div>
          )}
          <button
            title="logout"
            onClick={studentLogout}
            className="ml-3"
            aria-label="Logout"
          >
            <FiLogOut
              className={`${isOpen ? "w-7 h-7" : "w-5 h-5"} text-gray-500  ${
                !isOpen && "ml-0"
              }`}
            />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default SideMenubar;
