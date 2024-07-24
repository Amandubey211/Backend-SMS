import React, { useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import StudentDiwanLogo from "../../Assets/HomeAssets/StudentDiwanLogo.png";
import { MdOutlineKeyboardArrowUp, MdOutlineKeyboardArrowDown } from "react-icons/md";
import sidebarData from "./DataFile/sidebarData.js";
import { FiLogOut } from "react-icons/fi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import smallLogo from "../../Assets/SideBarAsset/smallLogo.png";
import { toggleSidebar } from "../../Redux/Slices/Common/SidebarSlice.js";
  import  useParentLogout  from '../../Hooks/AuthHooks/Parent/useParentLogout.js';  

const isActivePath = (path, locationPath) => {
  return locationPath.startsWith(path);
};

const SideMenubar = () => {
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const location = useLocation();
  const [openItems, setOpenItems] = useState([]);
  const dispatch = useDispatch();
  const { parentLogout } = useParentLogout(); // Use the hook

  const toggleDropdown = (title) => {
    if (openItems.includes(title)) {
      setOpenItems(openItems.filter((item) => item !== title));
    } else {
      setOpenItems([...openItems, title]);
    }
  };

  return (
    <nav
      className={`transition-all duration-300 h-screen p-1 z-10 bg-white border-r flex flex-col ${
        isOpen ? "w-[15%]" : "w-[7%]"
      }`}
    >
      <NavLink to="/parent_dash" className="relative flex items-center justify-center border-b pb-1">
        <img
          src={isOpen ? StudentDiwanLogo : smallLogo}
          alt="Logo"
          className={`transition-width duration-300 ${
            isOpen ? "w-36 pt-1" : "h-12"
          }`}
        />
        <button onClick={() => dispatch(toggleSidebar())}
          className="focus:outline-none absolute bottom-0 right-0">
          <div className="p-1 rounded-full text-purple-500 -mr-4 -mb-4 z-40 bg-white border-2">
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

      {/* Logout button at the bottom */}
      <div className="mt-auto p-2">
        <button
          onClick={parentLogout}  // Logout function tied to button click
          className="flex items-center justify-center w-full text-gray-700 hover:text-white hover:bg-gray-900 p-2 rounded-lg"
        >
          <FiLogOut className={`${isOpen ? "w-6 h-6" : "w-4 h-4"}`} />
          {isOpen && <span className="ml-2">Logout</span>}
        </button>
      </div>
    </nav>
  );
};

export default SideMenubar;
