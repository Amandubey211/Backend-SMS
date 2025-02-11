import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import StudentDiwanLogo from "../../Assets/HomeAssets/StudentDiwanLogo.png";
import smallLogo from "../../Assets/SideBarAsset/smallLogo.png";
import sidebarData from "./DataFile/sidebarData.js";
import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { staffLogout } from "../../Store/Slices/Common/Auth/actions/staffActions";
import LogoutConfirmationModal from "../Common/LogoutConfirmationModal.js";
import profileIcon from "../../Assets/DashboardAssets/profileIcon.png";
import { toggleSidebar } from "../../Store/Slices/Common/User/reducers/userSlice.js";
import { useTranslation } from "react-i18next";
import { filterSidebarData } from "../../Utils/sidebarUtils.js";
import { Tooltip } from "antd";
import "antd/dist/reset.css";

import { motion, AnimatePresence } from "framer-motion";

/* Example: simple custom hook for window size */
function useWindowSize() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    width,
    isMobile: width < 768, // e.g. Tailwind "md" breakpoint ~768px
  };
}

/* Minimal sidebar width animation */
const sidebarVariants = {
  open: {
    width: "15%",
    transition: { duration: 0.3 },
  },
  closed: {
    width: "7%",
    transition: { duration: 0.3 },
  },
};

/* Submenu expand/collapse animation */
const submenuVariants = {
  open: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.2 },
  },
  closed: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.2 },
  },
};

const isActivePath = (path, locationPath) => locationPath.startsWith(path);

const SideMenubar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation("admSidebar");

  // Redux states
  const isOpen = useSelector((state) => state.common.user.sidebar.isOpen);
  const role = useSelector((state) => state.common.auth.role);
  const permissions = useSelector((state) => state.common.auth.permissions);
  const userDetails = useSelector((state) => state.common.user.userDetails);

  // Local states
  const [openItems, setOpenItems] = useState([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Window size hook -> auto collapse on mobile
  const { width, isMobile } = useWindowSize();

  /*
   * If we detect isMobile and the sidebar is currently open,
   * we auto-collapse it. You can also invert the logic if you prefer.
   */
  useEffect(() => {
    if (isMobile && isOpen) {
      dispatch(toggleSidebar()); // auto-close if on mobile
    }
  }, [isMobile, isOpen, dispatch]);

  /*
   * useCallback to avoid re-creating the same toggle function
   * on every render
   */
  const toggleDropdown = useCallback((title) => {
    setOpenItems((prevOpenItems) =>
      prevOpenItems.includes(title)
        ? prevOpenItems.filter((item) => item !== title)
        : [...prevOpenItems, title]
    );
  }, []);

  /*
   * Logout flow
   * (wrapped with useCallback for potential performance
   * if used in deep child components, etc.)
   */
  const handleLogout = useCallback(() => {
    setIsLogoutModalOpen(true);
  }, []);

  const confirmLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await dispatch(staffLogout()).unwrap();
      setIsLogoutModalOpen(false);
      navigate("/stafflogin");
    } finally {
      setIsLoggingOut(false);
    }
  }, [dispatch, navigate]);

  /*
   * Navigate to user profile
   */
  const HandleNavigate = useCallback(() => {
    if (role === "admin") {
      navigate("/users/admin");
    } else if (
      [
        "teacher",
        "finance",
        "librarian",
        "staff",
        "student",
        "parent",
      ].includes(role)
    ) {
      navigate("/users/my/profile");
    } else {
      console.warn(
        "Role not recognized. Navigation not defined for this role."
      );
    }
  }, [role, navigate]);

  /*
   * Filter sidebar data by role/permissions
   * useMemo to reduce repeated filtering on every render
   */
  const filteredSidebarData = useMemo(() => {
    if (!sidebarData || !Array.isArray(sidebarData)) {
      return [];
    }
    return filterSidebarData(sidebarData, role, permissions);
  }, [role, permissions]);

  /*
   * On mount, auto-expand any parent that has an active child
   */
  useEffect(() => {
    const initialOpenItems = [];
    filteredSidebarData.forEach((item) => {
      if (item.items) {
        const hasActiveChild = item.items.some((subItem) =>
          isActivePath(subItem.path, location.pathname)
        );
        if (hasActiveChild) {
          initialOpenItems.push(item.title);
        }
      }
    });
    setOpenItems(initialOpenItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Minimal "error handling" if data is missing or user details are not fetched
  if (!sidebarData || !Array.isArray(sidebarData)) {
    return (
      <div className="flex items-center justify-center bg-red-50 text-red-500 w-64 p-4">
        {t("ERROR_SIDEBAR_DATA_NOT_FOUND")}
      </div>
    );
  }

  return (
    <nav
      // This keeps the old UI transition style (no framer-motion).
      className={`fixed top-0 left-0 bottom-0 transition-all duration-500 p-1 px-2 z-30 border-r flex flex-col bg-white ${
        isOpen ? "w-[15%]" : "w-[7%]"
      }`}
      aria-label="Sidebar"
    >
      {/* Logo Section */}
      <div className="relative flex items-center justify-center border-b pb-1">
        <NavLink to="/dashboard" aria-label="Dashboard">
          <img
            src={isOpen ? StudentDiwanLogo : smallLogo}
            alt="Logo"
            className={`transition-all duration-300 h-12 ${
              isOpen ? "w-40 pt-1" : ""
            }`}
          />
        </NavLink>

        {/* 
          Arrow Toggle: 
          - tooltip for accessibility
          - high z-index if needed
        */}
        <Tooltip
          title={isOpen ? t("Collapse Sidebar") : t("Expand Sidebar")}
          placement="bottom"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              dispatch(toggleSidebar());
            }}
            className="absolute -right-5 -bottom-3"
            aria-label={isOpen ? t("Collapse Sidebar") : t("Expand Sidebar")}
            style={{ zIndex: 9999 }}
          >
            <div className="p-1 rounded-full text-purple-500 bg-white border-2 shadow-md">
              {isOpen ? <IoIosArrowBack /> : <IoIosArrowForward />}
            </div>
          </button>
        </Tooltip>
      </div>

      {/* Menu Items */}
      <div className="flex-grow overflow-y-auto no-scrollbar">
        {isOpen && (
          <h2 className="text-gray-500 my-2 text-sm uppercase">{t("MENU")}</h2>
        )}

        <ul className={`space-y-1 ${!isOpen && "mt-2"}`}>
          {filteredSidebarData.map((item, index) => (
            <React.Fragment key={item.title}>
              {item.items ? (
                // Parent item with a submenu
                <div>
                  <Tooltip
                    placement="right"
                    title={!isOpen ? t(item.title) : ""}
                    trigger={["hover"]}
                    overlayClassName="!bg-gray-700 !text-white"
                  >
                    <div
                      className={`
                        flex items-center w-full p-2 rounded-lg cursor-pointer
                        ${
                          isActivePath(item.path, location.pathname) ||
                          item.items.some((subItem) =>
                            isActivePath(subItem.path, location.pathname)
                          )
                            ? "bg-purple-100 text-purple-500"
                            : "text-gray-700 hover:bg-gray-100"
                        }
                        ${isOpen ? "justify-between" : "justify-center"}
                      `}
                      onClick={() => toggleDropdown(item.title)}
                      role="button"
                      aria-expanded={openItems.includes(item.title)}
                      aria-controls={`submenu-${index}`}
                      tabIndex={0}
                    >
                      <div className="flex items-center">
                        <span className={`text-lg ${!isOpen && "mx-auto"}`}>
                          {item.icon}
                        </span>
                        {isOpen && (
                          <span className="ml-3 text-sm font-medium">
                            {t(item.title)}
                          </span>
                        )}
                      </div>
                      {isOpen &&
                        (openItems.includes(item.title) ? (
                          <MdOutlineKeyboardArrowUp className="ml-2 text-sm" />
                        ) : (
                          <MdOutlineKeyboardArrowDown className="ml-2 text-sm" />
                        ))}
                    </div>
                  </Tooltip>

                  {/* Submenu */}
                  <AnimatePresence initial={false}>
                    {openItems.includes(item.title) && item.items && (
                      <motion.ul
                        key={item.title}
                        id={`submenu-${index}`}
                        className="pl-5 mt-1 space-y-1 overflow-hidden"
                        variants={submenuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                      >
                        {item.items
                          .filter(
                            (subItem) =>
                              subItem.roles.includes(role) &&
                              (!subItem.requiredPermission ||
                                permissions.includes(
                                  subItem.requiredPermission
                                ))
                          )
                          .map((subItem) => (
                            <li key={subItem.title}>
                              <Tooltip
                                placement="right"
                                title={!isOpen ? t(subItem.title) : ""}
                                trigger={["hover"]}
                                overlayClassName="!bg-gray-700 !text-white"
                              >
                                <NavLink
                                  to={subItem.path}
                                  className={({ isActive }) =>
                                    `flex items-center p-2 rounded-lg text-sm ${
                                      isActive ||
                                      isActivePath(
                                        subItem.path,
                                        location.pathname
                                      )
                                        ? "text-purple-500 bg-purple-100"
                                        : "text-gray-700 hover:bg-gray-100"
                                    } ${isOpen ? "pl-2" : "justify-center"}`
                                  }
                                  aria-label={t(subItem.title)}
                                >
                                  <span
                                    className={`text-base ${
                                      !isOpen && "mx-auto"
                                    }`}
                                  >
                                    {subItem.icon}
                                  </span>
                                  {isOpen && (
                                    <span className="ml-3">
                                      {t(subItem.title)}
                                    </span>
                                  )}
                                </NavLink>
                              </Tooltip>
                            </li>
                          ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                // Parent item without a submenu
                <Tooltip
                  placement="right"
                  title={!isOpen ? t(item.title) : ""}
                  trigger={["hover"]}
                  overlayClassName="!bg-gray-700 !text-white"
                >
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded-lg text-sm ${
                        isActive || isActivePath(item.path, location.pathname)
                          ? "text-purple-500 bg-purple-100"
                          : "text-gray-700 hover:bg-gray-100"
                      } ${isOpen ? "" : "justify-center"}`
                    }
                    aria-label={t(item.title)}
                  >
                    <span className={`text-lg ${!isOpen && "mx-auto"}`}>
                      {item.icon}
                    </span>
                    {isOpen && <span className="ml-3">{t(item.title)}</span>}
                  </NavLink>
                </Tooltip>
              )}
            </React.Fragment>
          ))}
        </ul>
      </div>

      {/* User Profile and Logout */}
      <div className="p-2 flex items-center justify-between border-t">
        <Tooltip
          placement="right"
          title={!isOpen ? "Profile" : ""}
          trigger={["hover"]}
          overlayClassName="!bg-gray-700 !text-white"
        >
          <img
            src={userDetails?.profile || profileIcon}
            alt="Profile"
            className={`${
              isOpen ? "w-10 h-10" : "w-8 h-8"
            } cursor-pointer rounded-full`}
            onClick={HandleNavigate}
          />
        </Tooltip>

        {isOpen && (
          <div className="flex-1 ml-3">
            <h2 className="font-semibold text-sm">
              {userDetails?.fullName
                ? userDetails.fullName
                    .split(" ")
                    .map((n) => n[0]?.toUpperCase())
                    .join("")
                : "User"}
            </h2>
            <p className="text-gray-500 capitalize text-xs">{role}</p>
          </div>
        )}

        <Tooltip
          placement="right"
          title={!isOpen ? t("Logout") : ""}
          trigger={["hover"]}
          overlayClassName="!bg-gray-700 !text-white"
        >
          <button
            title={t("Logout")}
            onClick={handleLogout}
            className={`${isOpen ? "ml-3" : ""}`}
            aria-label={t("Logout")}
          >
            <FiLogOut
              className={`${isOpen ? "w-5 h-5" : "w-4 h-4"} text-gray-500`}
            />
          </button>
        </Tooltip>
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

export default React.memo(SideMenubar);
