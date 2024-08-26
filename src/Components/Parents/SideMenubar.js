import React, { useState } from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import StudentDiwanLogo from "../../Assets/HomeAssets/StudentDiwanLogo.png";
import { MdOutlineKeyboardArrowUp, MdOutlineKeyboardArrowDown } from "react-icons/md";
import sidebarData from "./DataFile/sidebarData.js";
import { FiLogOut } from "react-icons/fi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import smallLogo from "../../Assets/SideBarAsset/smallLogo.png";
import { toggleSidebar } from "../../Redux/Slices/Common/SidebarSlice.js";
  import  useParentLogout  from '../../Hooks/AuthHooks/Parent/useParentLogout.js';  
import LogoutConfirmationModal from "../Common/LogoutConfirmationModal.js";
import profileIcon from "../../Assets/DashboardAssets/profileIcon.png";
const isActivePath = (path, locationPath) => {
  return locationPath.startsWith(path);
};

const SideMenubar = () => {
  const location = useLocation();
  const [openItems, setOpenItems] = useState([]);
  const dispatch = useDispatch();
  const { parentLogout } = useParentLogout();
  const { isOpen, role, userDetails } = useSelector((state) => ({
    isOpen: state.sidebar.isOpen,
    role: state.Auth.role,
    userDetails: state?.Auth?.userDetail,
  }));
  const toggleDropdown = (title) => {
    if (openItems.includes(title)) {
      setOpenItems(openItems.filter((item) => item !== title));
    } else {
      setOpenItems([...openItems, title]);
    }
  };
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); 
  const [isLoggingOut, setIsLoggingOut] = useState(false); 
  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await parentLogout(); 
      setIsLogoutModalOpen(false); 
    } finally {
      setIsLoggingOut(false);
    }
  };
const navigate = useNavigate()
  return (
    <nav
      className={`sticky top-0 transition-all duration-300 h-screen p-1 z-50 bg-white border-r flex flex-col ${
        isOpen ? "w-[15%]" : "w-[7%]"
      }`}
    >
      <NavLink to="/parent_dash" className="relative flex items-center justify-center border-b pb-1" style={{ zIndex: 1001 }}>
        <img
          src={isOpen ? StudentDiwanLogo : smallLogo}
          alt="Logo"
          className={`transition-width duration-300 ${
            isOpen ? "w-36 pt-1" : "h-12"
          }`}
        />
        <button onClick={() => dispatch(toggleSidebar())}
          className="focus:outline-none absolute bottom-0 right-0" >
          <div className="p-1 rounded-full text-purple-500 -mr-4 -mb-4 z-40   bg-white border-2">
            {isOpen ? <IoIosArrowBack /> : <IoIosArrowForward />}
          </div>
        </button>
      </NavLink>
      <div className="mt-4 p-2">
        {isOpen && <h2 className="text-gray-500">MENU</h2>}
        <ul className="mt-1 space-y-2 flex-grow">
          {sidebarData.map((item, index) => (
            <React.Fragment key={index}>
              {item.items ? (
                <div
                  className={`flex items-center w-full p-2 rounded-lg cursor-pointer ${
                    isActivePath(item.path, location.pathname)
                      ? "bg-purple-100 text-purple-500"
                      : "text-gray-700 hover:bg-gray-100"
                  } ${isOpen ? "justify-between" : "justify-center"}`}
                  onClick={() => toggleDropdown(item.title)}
                >
                  <div className={`flex justify-center items-center`}>
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
                      {openItems.includes(item.title) ? (
                        <MdOutlineKeyboardArrowUp className="ml-2" />
                      ) : (
                        <MdOutlineKeyboardArrowDown className="ml-2" />
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
                >
                  <span className={`${!isOpen && "text-xl"}`}>{item.icon}</span>
                  {isOpen && (
                    <span role="presentation" className="ml-3">
                      {item.title}
                    </span>
                  )}
                </NavLink>
              )}
              {openItems.includes(item.title) && item.items && (
                <ul className="pl-2 space-y-2">
                  {item.items.map((subItem, subIndex) => (
                    <NavLink
                      key={subIndex}
                      to={subItem.path}
                      className={({ isActive }) =>
                        `flex items-center p-2 rounded-lg : "justify-center"}`
                      }
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
      <div className={`fixed bottom-1  h-[3rem]  flex flex- row items-center justify-center border-t w-auto ${isOpen? "w-[14%]" : "w-[7%]"}  `}>
        <img
          src={
            userDetails?.profile || profileIcon
          }
          alt="Profile"
          className={`${isOpen ? "w-10 h-10" : "w-8 h-8"} cursor-pointer rounded-full`}
          onClick={()=>navigate('/users/parent/profile')}
        />

        {isOpen && (
          <div className="flex-1 ml-3">
            <h2 className="font-semibold">
              {userDetails?.fatherName?.slice(0,8) || "User"}
            </h2>
            <p className="text-gray-500 capitalize text-sm">{role}</p>
          </div>
        )}
        <button
          title="logout"
          onClick={handleLogout} 
          className="ml-3"
          aria-label="Logout"
        >
          <FiLogOut
            className={`${isOpen ? "w-7 h-7" : "w-5 h-5"} text-gray-500`}
          />
        </button>
      </div>
      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
        loading={isLoggingOut}
      />
    </nav>
  );
};

export default SideMenubar;
