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
import { TbDashboard } from "react-icons/tb";
import { RiGraduationCapLine } from "react-icons/ri";
import { LuUser } from "react-icons/lu";
import { HiOutlineCalculator } from "react-icons/hi2";
import { PiCertificateLight } from "react-icons/pi";
import { RiUserAddLine } from "react-icons/ri";
import { BsBook } from "react-icons/bs";
import { TbNotebook } from "react-icons/tb";
import { GrUserWorker } from "react-icons/gr";
import { MdLocalLibrary,MdManageAccounts } from "react-icons/md";
import { RiParentFill,RiAdminFill } from "react-icons/ri";

const sidebarData = [
  {
    title: "Dashboard",
    icon: <TbDashboard />,
    path: "/admin_dash",
  },
  {
    title: "My Childs",
    icon: <RiGraduationCapLine />,
    path: `/class`,
  },

  {
    title: "Finance",
    icon: <LuUser />,
  },
  {
    title: "Library",
    icon: <HiOutlineCalculator />,
  },
  {
    title: "Notice Board",
    icon: <FaUserGraduate />,
    path: "/verify_students",
  },
];

export default sidebarData;
