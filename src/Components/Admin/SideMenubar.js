// import React, { useState, useEffect } from "react";
// import { useLocation, NavLink, useNavigate } from "react-router-dom";
// import StudentDiwanLogo from "../../Assets/HomeAssets/StudentDiwanLogo.png";
// import smallLogo from "../../Assets/SideBarAsset/smallLogo.png";
// import sidebarData from "./DataFile/sidebarData.js";
// import {
//   MdOutlineKeyboardArrowUp,
//   MdOutlineKeyboardArrowDown,
// } from "react-icons/md";
// import { FiLogOut } from "react-icons/fi";
// import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
// import { useDispatch, useSelector } from "react-redux";
// import { staffLogout } from "../../Store/Slices/Common/Auth/actions/staffActions";
// import LogoutConfirmationModal from "../Common/LogoutConfirmationModal.js";
// import profileIcon from "../../Assets/DashboardAssets/profileIcon.png";
// import { toggleSidebar } from "../../Store/Slices/Common/User/reducers/userSlice.js";
// import { useTranslation } from "react-i18next";
// import { filterSidebarData } from "../../Utils/sidebarUtils.js";
// import { Tooltip } from "antd"; // Import Tooltip from antd
// import "antd/dist/reset.css"; // Import antd styles

// const isActivePath = (path, locationPath) => locationPath.startsWith(path);

// const SideMenubar = () => {
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { t } = useTranslation("admSidebar");

//   const isOpen = useSelector((state) => state.common.user.sidebar.isOpen);
//   const role = useSelector((state) => state.common.auth.role);
//   const permissions = useSelector((state) => state.common.auth.permissions);
//   const userDetails = useSelector((state) => state.common.user.userDetails);

//   const [openItems, setOpenItems] = useState([]);
//   const [isLoggingOut, setIsLoggingOut] = useState(false);
//   const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

//   const toggleDropdown = (title) => {
//     setOpenItems((prevOpenItems) =>
//       prevOpenItems.includes(title)
//         ? prevOpenItems.filter((item) => item !== title)
//         : [...prevOpenItems, title]
//     );
//   };

//   const handleLogout = () => {
//     setIsLogoutModalOpen(true);
//   };

//   const confirmLogout = async () => {
//     setIsLoggingOut(true);
//     try {
//       await dispatch(staffLogout()).unwrap();
//       setIsLogoutModalOpen(false);
//       navigate("/stafflogin");
//     } finally {
//       setIsLoggingOut(false);
//     }
//   };

//   const HandleNavigate = () => {
//     if (role === "admin") {
//       navigate("/users/admin");
//     } else if (
//       role === "teacher" ||
//       role === "accountant" ||
//       role === "librarian" ||
//       role === "staff" ||
//       role === "student" ||
//       role === "parent"
//     ) {
//       navigate("/users/my/profile");
//     } else {
//       console.warn(
//         "Role not recognized. Navigation not defined for this role."
//       );
//     }
//   };

//   // Filter sidebar data by role and permissions
//   const filteredSidebarData = filterSidebarData(sidebarData, role, permissions);

//   // Effect to auto-expand parent menus if a child route is active
//   useEffect(() => {
//     filteredSidebarData.forEach((item) => {
//       if (item.items) {
//         const hasActiveChild = item.items.some((subItem) =>
//           isActivePath(subItem.path, location.pathname)
//         );
//         if (hasActiveChild && !openItems.includes(item.title)) {
//           setOpenItems((prev) => [...prev, item.title]);
//         }
//       }
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [location.pathname]);

//   return (
//     <nav
//       className={`fixed top-0 left-0 bottom-0 transition-all duration-300 p-1 px-2 z-30 border-r flex flex-col bg-white ${
//         isOpen ? "w-[15%]" : "w-[7%]"
//       }`}
//       aria-label="Sidebar"
//     >
//       {/* Logo Section */}
//       <div className="relative flex items-center justify-center border-b pb-1">
//         <NavLink to="/dashboard" aria-label="Dashboard">
//           <img
//             src={isOpen ? StudentDiwanLogo : smallLogo}
//             alt="Logo"
//             className={`transition-all duration-300  h-12 ${
//               isOpen && "w-40 pt-1"
//             }`}
//           />
//         </NavLink>
//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             dispatch(toggleSidebar());
//           }}
//           className="absolute -right-5 -bottom-3"
//           aria-label="Toggle Sidebar"
//         >
//           <div className="p-1 rounded-full text-purple-500 bg-white border-2  shadow-md">
//             {isOpen ? <IoIosArrowBack /> : <IoIosArrowForward />}
//           </div>
//         </button>
//       </div>

//       {/* Menu Items */}
//       <div className="flex-grow overflow-y-auto no-scrollbar">
//         {isOpen && (
//           <h2 className="text-gray-500 my-2 text-sm uppercase">{t("MENU")}</h2>
//         )}
//         <ul className={`space-y-1 ${!isOpen && "mt-2"}`}>
//           {filteredSidebarData?.map((item, index) => (
//             <React.Fragment key={index}>
//               {item.items ? (
//                 <div>
//                   <Tooltip
//                     placement="right"
//                     title={!isOpen ? t(item.title) : ""}
//                     trigger={["hover"]}
//                     overlayClassName="!bg-gray-700 !text-white"
//                   >
//                     <div
//                       className={`flex items-center w-full p-2 rounded-lg cursor-pointer ${
//                         isActivePath(item.path, location.pathname) ||
//                         (item.items &&
//                           item.items.some((subItem) =>
//                             isActivePath(subItem.path, location.pathname)
//                           ))
//                           ? "bg-purple-100 text-purple-500"
//                           : "text-gray-700 hover:bg-gray-100"
//                       } ${isOpen ? "justify-between" : "justify-center "}`}
//                       onClick={() => toggleDropdown(item.title)}
//                       role="button"
//                       aria-expanded={openItems.includes(item.title)}
//                       aria-controls={`submenu-${index}`}
//                       tabIndex="0"
//                     >
//                       <div className="flex items-center">
//                         <span className={`text-lg ${!isOpen && "mx-auto"}`}>
//                           {item.icon}
//                         </span>
//                         {isOpen && (
//                           <span className="ml-3 text-sm font-medium">
//                             {t(item.title)}
//                           </span>
//                         )}
//                       </div>
//                       {isOpen && (
//                         <>
//                           {openItems.includes(item.title) ||
//                           (item.items &&
//                             item.items.some((subItem) =>
//                               isActivePath(subItem.path, location.pathname)
//                             )) ? (
//                             <MdOutlineKeyboardArrowUp className="ml-2 text-sm" />
//                           ) : (
//                             <MdOutlineKeyboardArrowDown className="ml-2 text-sm" />
//                           )}
//                         </>
//                       )}
//                     </div>
//                   </Tooltip>
//                   {/* Submenu */}
//                   {(openItems.includes(item.title) ||
//                     (item.items &&
//                       item.items.some((subItem) =>
//                         isActivePath(subItem.path, location.pathname)
//                       ))) &&
//                     item.items && (
//                       <ul
//                         id={`submenu-${index}`}
//                         className="pl-5 mt-1 space-y-1"
//                       >
//                         {item.items
//                           .filter(
//                             (subItem) =>
//                               subItem.roles.includes(role) &&
//                               (!subItem.requiredPermission ||
//                                 permissions.includes(
//                                   subItem.requiredPermission
//                                 ))
//                           )
//                           ?.map((subItem, subIndex) => (
//                             <Tooltip
//                               key={subIndex}
//                               placement="right"
//                               title={!isOpen ? t(subItem.title) : ""}
//                               trigger={["hover"]}
//                               overlayClassName="!bg-gray-700 !text-white"
//                             >
//                               <NavLink
//                                 to={subItem.path}
//                                 className={({ isActive }) =>
//                                   `flex items-center p-2 rounded-lg text-sm ${
//                                     isActive ||
//                                     isActivePath(
//                                       subItem.path,
//                                       location.pathname
//                                     )
//                                       ? "text-purple-500 bg-purple-100"
//                                       : "text-gray-700 hover:bg-gray-100"
//                                   } ${isOpen ? "pl-2" : "justify-center"}`
//                                 }
//                                 aria-label={t(subItem.title)}
//                               >
//                                 <span
//                                   className={`text-base ${
//                                     !isOpen && "mx-auto"
//                                   }`}
//                                 >
//                                   {subItem.icon}
//                                 </span>
//                                 {isOpen && (
//                                   <span className="ml-3">
//                                     {t(subItem.title)}
//                                   </span>
//                                 )}
//                               </NavLink>
//                             </Tooltip>
//                           ))}
//                       </ul>
//                     )}
//                 </div>
//               ) : (
//                 <Tooltip
//                   placement="right"
//                   title={!isOpen ? t(item.title) : ""}
//                   trigger={["hover"]}
//                   overlayClassName="!bg-gray-700 !text-white"
//                 >
//                   <NavLink
//                     to={item.path}
//                     className={({ isActive }) =>
//                       `flex items-center p-2 rounded-lg text-sm ${
//                         isActive || isActivePath(item.path, location.pathname)
//                           ? "text-purple-500 bg-purple-100"
//                           : "text-gray-700 hover:bg-gray-100"
//                       } ${isOpen ? "" : "justify-center"}`
//                     }
//                     aria-label={t(item.title)}
//                   >
//                     <span className={`text-lg ${!isOpen && "mx-auto"}`}>
//                       {item.icon}
//                     </span>
//                     {isOpen && <span className="ml-3">{t(item.title)}</span>}
//                   </NavLink>
//                 </Tooltip>
//               )}
//             </React.Fragment>
//           ))}
//         </ul>
//       </div>

//       {/* User Profile and Logout */}
//       <div className="p-2 flex items-center justify-between border-t">
//         <Tooltip
//           placement="right"
//           title={!isOpen ? "Profile" : ""}
//           trigger={["hover"]}
//           overlayClassName="!bg-gray-700 !text-white"
//         >
//           <img
//             src={userDetails?.profile || profileIcon}
//             alt="Profile"
//             className={`${
//               isOpen ? "w-10 h-10" : "w-8 h-8"
//             } cursor-pointer rounded-full`}
//             onClick={HandleNavigate}
//           />
//         </Tooltip>

//         {isOpen && (
//           <div className="flex-1 ml-3">
//             <h2 className="font-semibold text-sm">
//               {userDetails?.fullName
//                 ? userDetails.fullName
//                     .split(" ")
//                     .map((n) => n[0]?.toUpperCase())
//                     .join("")
//                 : "User"}
//             </h2>
//             <p className="text-gray-500 capitalize text-xs">{role}</p>
//           </div>
//         )}
//         <Tooltip
//           placement="right"
//           title={!isOpen ? t("Logout") : ""}
//           trigger={["hover"]}
//           overlayClassName="!bg-gray-700 !text-white"
//         >
//           <button
//             title={t("Logout")}
//             onClick={handleLogout}
//             className="ml-3"
//             aria-label={t("Logout")}
//           >
//             <FiLogOut
//               className={`${isOpen ? "w-5 h-5" : "w-4 h-4"} text-gray-500`}
//             />
//           </button>
//         </Tooltip>
//       </div>
//       <LogoutConfirmationModal
//         isOpen={isLogoutModalOpen}
//         onClose={() => setIsLogoutModalOpen(false)}
//         onConfirm={confirmLogout}
//         loading={isLoggingOut}
//       />
//     </nav>
//   );
// };

// export default React.memo(SideMenubar);

import React, { useState, useEffect } from "react";
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
import { Tooltip } from "antd"; // Import Tooltip from antd
import "antd/dist/reset.css"; // Import antd reset styles
import { motion, AnimatePresence } from "framer-motion";
import useWindowSize from "../../Hooks/CommonHooks/useWindowSize.js";

const isActivePath = (path, locationPath) => locationPath.startsWith(path);

// Animation Variants
const getSidebarVariants = (breakpoint) => {
  const widthMap = {
    sm: { open: "8rem", closed: "5rem" },
    md: { open: "12rem", closed: "5rem" },
    lg: { open: "13rem", closed: "5rem" },
    xl: { open: "14rem", closed: "6rem" },
  };

  return {
    open: {
      width: widthMap[breakpoint].open,
      transition: { type: "spring", stiffness: 200, damping: 20 },
    },
    closed: {
      width: widthMap[breakpoint].closed,
      transition: { type: "spring", stiffness: 200, damping: 20 },
    },
  };
};

const submenuVariants = {
  open: {
    height: "auto",
    opacity: 1,
    transition: {
      duration: 0.3,
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
  closed: {
    height: 0,
    opacity: 0,
    transition: {
      duration: 0.3,
      when: "afterChildren",
    },
  },
};

const menuItemVariants = {
  open: { opacity: 1, y: 0 },
  closed: { opacity: 0, y: -10 },
};

const SideMenubar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation("admSidebar");

  const isOpen = useSelector((state) => state.common.user.sidebar.isOpen);
  const role = useSelector((state) => state.common.auth.role);
  const permissions = useSelector((state) => state.common.auth.permissions);
  const userDetails = useSelector((state) => state.common.user.userDetails);

  const [openItems, setOpenItems] = useState([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const size = useWindowSize(); // Get current window size
  const breakpoint = size.breakpoint; // sm, md, lg, xl

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
      await dispatch(staffLogout()).unwrap();
      setIsLogoutModalOpen(false);
      navigate("/stafflogin");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const HandleNavigate = () => {
    if (role === "admin") {
      navigate("/users/admin");
    } else if (
      role === "teacher" ||
      role === "accountant" ||
      role === "librarian" ||
      role === "staff" ||
      role === "student" ||
      role === "parent"
    ) {
      navigate("/users/my/profile");
    } else {
      console.warn(
        "Role not recognized. Navigation not defined for this role."
      );
    }
  };

  // Filter sidebar data by role and permissions
  const filteredSidebarData = filterSidebarData(sidebarData, role, permissions);

  // Effect to auto-expand parent menus if a child route is active (runs only once on mount)
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
  }, []); // Empty dependency array ensures this runs only once

  return (
    <motion.nav
      variants={getSidebarVariants(breakpoint)}
      animate={isOpen ? "open" : "closed"}
      initial={false}
      className={`fixed top-0 left-0 bottom-0 p-1 px-2 z-30 border-r flex flex-col bg-white`}
      aria-label="Sidebar"
    >
      {/* Logo Section */}
      <div className="relative flex items-center justify-center border-b pb-1">
        <NavLink to="/dashboard" aria-label="Dashboard">
          <img
            src={isOpen ? StudentDiwanLogo : smallLogo}
            alt="Logo"
            className={`transition-all duration-300 h-12 ${
              isOpen ? "w-32 pt-1" : "w-10"
            }`}
          />
        </NavLink>
        <button
          onClick={(e) => {
            e.stopPropagation();
            dispatch(toggleSidebar());
          }}
          className="absolute -right-5 -bottom-3"
          aria-label="Toggle Sidebar"
        >
          <div className="p-1 rounded-full text-purple-500 bg-white border-2 shadow-md">
            {isOpen ? <IoIosArrowBack /> : <IoIosArrowForward />}
          </div>
        </button>
      </div>

      {/* Menu Items */}
      <div className="flex-grow overflow-y-auto no-scrollbar">
        {isOpen && (
          <h2 className="text-gray-500 my-2 text-xs sm:text-sm uppercase tracking-wider">
            {t("MENU")}
          </h2>
        )}
        <ul className={`space-y-1 ${!isOpen && "mt-1"}`}>
          {filteredSidebarData?.map((item) => (
            <React.Fragment key={item.title}>
              {item.items ? (
                <div>
                  <Tooltip
                    placement="right"
                    title={!isOpen ? t(item.title) : ""}
                    trigger={["hover"]}
                    overlayClassName="!bg-gray-700 !text-white"
                  >
                    <div
                      className={`flex items-center w-full p-1 rounded-lg cursor-pointer ${
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
                      aria-controls={`submenu-${item.title}`}
                      tabIndex="0"
                    >
                      <div className="flex items-center">
                        <span className={`text-md ${!isOpen && "mx-auto"}`}>
                          {item.icon}
                        </span>
                        {isOpen && (
                          <span className="ml-2 text-xs sm:text-sm lg:text-base font-medium">
                            {t(item.title)}
                          </span>
                        )}
                      </div>
                      {isOpen && (
                        <>
                          {openItems.includes(item.title) ? (
                            <MdOutlineKeyboardArrowUp className="ml-2 text-sm sm:text-base" />
                          ) : (
                            <MdOutlineKeyboardArrowDown className="ml-2 text-sm sm:text-base" />
                          )}
                        </>
                      )}
                    </div>
                  </Tooltip>
                  {/* Submenu */}
                  <AnimatePresence>
                    {openItems.includes(item.title) && item.items && (
                      <motion.ul
                        id={`submenu-${item.title}`}
                        className="pl-3 mt-1 space-y-1"
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
                          ?.map((subItem) => (
                            <motion.li
                              key={subItem.title}
                              variants={menuItemVariants}
                            >
                              <Tooltip
                                placement="right"
                                title={!isOpen ? t(subItem.title) : ""}
                                trigger={["hover"]}
                                overlayClassName="!bg-gray-700 !text-white"
                              >
                                <NavLink
                                  to={subItem.path}
                                  className={({ isActive }) =>
                                    `flex items-center p-1 rounded-lg text-xs sm:text-sm ${
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
                                    className={`text-sm sm:text-base ${
                                      !isOpen && "mx-auto"
                                    }`}
                                  >
                                    {subItem.icon}
                                  </span>
                                  {isOpen && (
                                    <span className="ml-2 sm:ml-3">
                                      {t(subItem.title)}
                                    </span>
                                  )}
                                </NavLink>
                              </Tooltip>
                            </motion.li>
                          ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Tooltip
                  placement="right"
                  title={!isOpen ? t(item.title) : ""}
                  trigger={["hover"]}
                  overlayClassName="!bg-gray-700 !text-white"
                >
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center p-1 rounded-lg text-xs sm:text-sm ${
                        isActive || isActivePath(item.path, location.pathname)
                          ? "text-purple-500 bg-purple-100"
                          : "text-gray-700 hover:bg-gray-100"
                      } ${isOpen ? "justify-start" : "justify-center"}`
                    }
                    aria-label={t(item.title)}
                  >
                    <span className={`text-md ${!isOpen && "mx-auto"}`}>
                      {item.icon}
                    </span>
                    {isOpen && (
                      <span className="ml-2 sm:ml-3">{t(item.title)}</span>
                    )}
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
              isOpen
                ? "w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
                : "w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10"
            } cursor-pointer rounded-full`}
            onClick={HandleNavigate}
          />
        </Tooltip>

        {isOpen && (
          <div className="flex-1 ml-2">
            <h2 className="font-semibold text-xs sm:text-sm lg:text-base">
              {userDetails?.fullName
                ? userDetails.fullName
                    .split(" ")
                    .map((n) => n[0]?.toUpperCase())
                    .join("")
                : "User"}
            </h2>
            <p className="text-gray-500 capitalize text-[10px] sm:text-xs lg:text-sm">
              {role}
            </p>
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
            className="ml-2"
            aria-label={t("Logout")}
          >
            <FiLogOut
              className={`${
                isOpen ? "w-4 h-4 sm:w-5 sm:h-5" : "w-3 h-3 sm:w-4 sm:h-4"
              } text-gray-500`}
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
    </motion.nav>
  );
};

export default React.memo(SideMenubar);
