import React, { useState } from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
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
import { toggleSidebar } from "../../Store/Slices/Common/User/reducers/userSlice"; // Importing the toggleSidebar action
import { studentLogout } from "../../Store/Slices/Common/Auth/actions/studentActions"; // Import studentLogout action
import ProfileIcon from "../../Assets/DashboardAssets/profileIcon.png";
import LogoutConfirmationModal from "../Common/LogoutConfirmationModal";

const isActivePath = (path, locationPath) => locationPath.startsWith(path);

const SideMenubar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { isOpen, userDetails, role } = useSelector((state) => ({
    isOpen: state.common.user.sidebar.isOpen, // Redux state for sidebar toggle
    userDetails: state.common.user.userDetails, // Redux state for user details
    role: state.common.auth.role,
  }));

  const [openItems, setOpenItems] = useState([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const toggleDropdown = (title) => {
    setOpenItems((prevOpenItems) =>
      prevOpenItems.includes(title)
        ? prevOpenItems.filter((item) => item !== title)
        : [...prevOpenItems, title]
    );
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await dispatch(studentLogout()).unwrap(); // Dispatch the logout action
      setIsLogoutModalOpen(false);
      navigate("/studentlogin"); // Redirect to login after logout
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 bottom-0 transition-all duration-300 p-1 px-3 z-30 border-r flex flex-col bg-white ${
        isOpen ? "w-[15%]" : "w-[7%]"
      }`}
      aria-label="Sidebar"
    >
      <div className="relative flex items-center justify-center border-b pb-1">
        <NavLink to="/student_dash" aria-label="Dashboard">
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
            dispatch(toggleSidebar()); // Dispatch toggleSidebar action
          }}
          className="absolute bottom-0 right-0"
          aria-label="Toggle Sidebar"
        >
          <div className="p-1 rounded-full text-purple-500 -mr-7 -mb-4 z-40 bg-white border-2">
            {isOpen ? <IoIosArrowBack /> : <IoIosArrowForward />}
          </div>
        </button>
      </div>

      <div className="flex-grow overflow-y-auto no-scrollbar">
        {isOpen && <h2 className="text-gray-500 my-1">MENU</h2>}
        <ul className={`space-y-1 ${!isOpen && "mt-3"}`}>
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
                  } ${isOpen ? "justify-between" : "justify-center "}`}
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
                  <span className={`${!isOpen && "text-xl"}`}>{item.icon}</span>
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

      <div
        className={`fixed bottom-1  h-[3rem]  flex flex- row items-center justify-center border-t w-auto ${
          isOpen ? "w-[14%]" : "w-[7%]"
        }  `}
      >
        <div className="flex items-center justify-between">
          <img
            src={userDetails?.profile || ProfileIcon}
            alt="Profile"
            className={`${
              isOpen ? "w-10 h-10" : "w-8 h-8"
            } rounded-full cursor-pointer`}
            onClick={() => navigate("/users/student/profile")}
          />
          {isOpen && (
            <div className="ml-4">
              <h2 className="text-sm font-semibold">
                {userDetails?.fullName?.slice(0, 5) || "User Name"}
              </h2>
              <p className="text-gray-500 capitalize">{role}</p>
            </div>
          )}
          <button
            title="logout"
            onClick={handleLogout}
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
        <LogoutConfirmationModal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirm={confirmLogout}
          loading={isLoggingOut}
        />
      </div>
    </nav>
  );
};

export default SideMenubar;
