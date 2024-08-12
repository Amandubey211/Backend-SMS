// sidebarData.js
import React from "react";
import {
  FaChalkboardTeacher,
  FaUsers,
  FaBook,
  FaUserGraduate,
  FaClipboardList,
  FaUniversity,
} from "react-icons/fa";
import { FcAlarmClock, FcMoneyTransfer } from "react-icons/fc";
import { FcHome } from "react-icons/fc";
import { FcReading } from "react-icons/fc";
import { FcAdvertising } from "react-icons/fc";
import { FcCalendar } from "react-icons/fc";  // Import calendar icon for events

import { TbDashboard } from "react-icons/tb";
import { RiGraduationCapLine } from "react-icons/ri";
import { LuUser } from "react-icons/lu";
import { HiOutlineCalculator } from "react-icons/hi2";
import { PiCertificateLight } from "react-icons/pi";
import { RiUserAddLine } from "react-icons/ri";
import { BsBook } from "react-icons/bs";
import { TbNotebook } from "react-icons/tb";
import { GrUserWorker } from "react-icons/gr";
import { MdLocalLibrary, MdManageAccounts } from "react-icons/md";
import { RiParentFill, RiAdminFill } from "react-icons/ri";
import { FcManager } from "react-icons/fc";

const sidebarData = [
  {
    title: "Dashboard",
    icon: <FcHome />,
    path: "/parent_dash",
  },
  {
    title: "Childrens",
    icon: <FcManager  />,
    path: `/children`,
  },
  {
    title: "Finance",
    icon: <FcMoneyTransfer />,
    path:'/parentfinance'
  },
  {
    title: "Library",
    icon: <FcReading />,
    path:'/parentlibrary'
  },
  {
    title: "Notice Board",
    icon: <FcAlarmClock />,
    path: "/parentchildnotice",
  },
  {
    title: "Announcements",
    icon: <FcAdvertising />,
    path: "/parentannounce",
  },
  {
    title: "Events", // Added Events option
    icon: <FcCalendar />, // Added icon for Events
    path: "/parentevents",
  },
];

export default sidebarData;
