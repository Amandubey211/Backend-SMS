// SideMenubar.jsx
import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import StudentDiwanLogo from "../../Assets/HomeAssets/StudentDiwanLogo.png";
import smallLogo from "../../Assets/SideBarAsset/smallLogo.png";
import sidebarData from "./DataFile/sidebarData";
import { toggleSidebar } from "../../Store/Slices/Common/User/reducers/userSlice";
import { studentLogout } from "../../Store/Slices/Common/Auth/actions/studentActions";
import LogoutConfirmationModal from "../Common/LogoutConfirmationModal";
import ProfileCluster from "./ProfileCluster"; // ← adjust the path if needed

const isActivePath = (path, locationPath) => locationPath.startsWith(path);

const SideMenubar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { isOpen, userDetails, role } = useSelector((state) => ({
    isOpen: state.common.user.sidebar.isOpen,
    userDetails: state.common.user.userDetails,
    role: state.common.auth.role,
  }));

  /* --------------------------------- local state --------------------------------- */
  const [openItems, setOpenItems] = useState([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  /* --------------------------------- handlers ------------------------------------ */
  const toggleDropdown = (title) =>
    setOpenItems((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );

  const openLogoutModal = () => setIsLogoutModalOpen(true);

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await dispatch(studentLogout()).unwrap();
      navigate("/studentlogin");
    } finally {
      setIsLoggingOut(false);
      setIsLogoutModalOpen(false);
    }
  };

  /* --------------------------------- render -------------------------------------- */
  return (
    <nav
      aria-label="Sidebar"
      className={`fixed inset-y-0 left-0 z-30 flex flex-col bg-white border-r border-b transition-all duration-300 p-2 ${
        isOpen ? "w-[15%]" : "w-[7%]"
      }`}
    >
      {/* -------- Logo + sidebar toggle -------- */}
      <div className="relative flex items-center justify-center border-b pb-1">
        <NavLink to="/student_dash" aria-label="Dashboard">
          <img
            src={isOpen ? StudentDiwanLogo : smallLogo}
            alt="Logo"
            className={`transition-width h-11 duration-300 ${
              isOpen && "w-36 "
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
          <div className="p-1 rounded-full text-purple-500 -mr-5 -mb-4 z-40 bg-white border-2">
            {isOpen ? <IoIosArrowBack /> : <IoIosArrowForward />}
          </div>
        </button>
      </div>

      {/* ---------------------- menu list ---------------------- */}
      <div className="flex-grow overflow-y-auto no-scrollbar py-1">
        <ul className={`space-y-1 ${!isOpen && "mt-3"}`}>
          {sidebarData.map((item, idx) => (
            <React.Fragment key={idx}>
              {/* -------- parent item with children -------- */}
              {item.items ? (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleDropdown(item.title)}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") &&
                    toggleDropdown(item.title)
                  }
                  aria-expanded={openItems.includes(item.title)}
                  aria-controls={`submenu-${idx}`}
                  className={`flex items-center cursor-pointer rounded-lg p-2 transition-colors ${
                    isActivePath(item.path, location.pathname) ||
                    item.items.some((sub) =>
                      isActivePath(sub.path, location.pathname)
                    )
                      ? "bg-purple-100 text-purple-500"
                      : "text-gray-700 hover:bg-gray-100"
                  } ${isOpen ? "justify-between" : "justify-center"}`}
                >
                  <span className={isOpen ? "flex items-center" : "text-xl"}>
                    {item.icon}
                    {isOpen && <span className="ml-3">{item.title}</span>}
                  </span>
                  {isOpen &&
                    (openItems.includes(item.title) ? (
                      <MdOutlineKeyboardArrowUp />
                    ) : (
                      <MdOutlineKeyboardArrowDown />
                    ))}
                </div>
              ) : (
                /* -------- single nav link -------- */
                <NavLink
                  to={item.path}
                  aria-label={item.title}
                  className={({ isActive }) =>
                    `flex items-center rounded-lg p-2 transition-colors ${
                      isActive
                        ? "bg-purple-100 text-purple-500"
                        : "text-gray-700 hover:bg-gray-100"
                    } ${isOpen ? "" : "justify-center"}`
                  }
                >
                  <span className={isOpen ? "" : "text-xl"}>{item.icon}</span>
                  {isOpen && <span className="ml-3">{item.title}</span>}
                </NavLink>
              )}

              {/* -------- sub-menu -------- */}
              {openItems.includes(item.title) && item.items && (
                <ul id={`submenu-${idx}`} className="ml-4 space-y-1">
                  {item.items.map((sub, subIdx) => (
                    <NavLink
                      key={subIdx}
                      to={sub.path}
                      aria-label={sub.title}
                      className={({ isActive }) =>
                        `flex items-center rounded-lg p-2 transition-colors ${
                          isActive
                            ? "bg-purple-100 text-purple-500"
                            : "text-gray-700 hover:bg-gray-100"
                        } ${isOpen ? "" : "justify-center"}`
                      }
                    >
                      {sub.icon}
                      {isOpen && <span className="ml-3">{sub.title}</span>}
                    </NavLink>
                  ))}
                </ul>
              )}
            </React.Fragment>
          ))}
        </ul>
      </div>

      {/* ---------------------- profile cluster ---------------------- */}
      <div className="mt-auto pb-2">
        <ProfileCluster
          isOpen={isOpen}
          userDetails={userDetails}
          role={role}
          onAvatarClick={() => navigate("/users/student/profile")}
          onLogoutClick={openLogoutModal}
        />
      </div>

      {/* ---------------------- logout modal ---------------------- */}
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
