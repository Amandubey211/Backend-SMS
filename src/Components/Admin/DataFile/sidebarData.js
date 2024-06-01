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

const sidebarData = [
  {
    title: "Dashboard",
    icon: <TbDashboard />,
    path: "/admin_dash",
  },
  {
    title: "Classes",
    icon: <RiGraduationCapLine />,
    path: `/class`,
  },

  {
    title: "Users",
    icon: <LuUser />,
    items: [
      {
        title: "Students",
        icon: <FaUserGraduate />,
        path: "/users/students",
      },
    ],
  },
  {
    title: "Accounting",
    icon: <HiOutlineCalculator />,
    items: [
      {
        title: "Reports",
        icon: <FaClipboardList />,
        path: "/accounting/reports",
      },
      {
        title: "Expenses",
        icon: <FaUniversity />,
        path: "/accounting/expenses",
      },
    ],
  },
  {
    title: "NoticeBoard",
    icon: <TbNotebook />,
    items: [
      {
        title: "Announcements",
        icon: <FaClipboardList />,
        path: "/noticeboard/announcements",
      },
      {
        title: "Events",
        icon: <FaBook />,
        path: "/noticeboard/events",
      },
    ],
  },
  {
    title: "Graduated",
    icon: <PiCertificateLight />,
    path: "/graduated",
  },
  {
    title: "Admissions",
    icon: <RiUserAddLine />,
    path: "/admissions",
  },
  {
    title: "Library",
    icon: <BsBook />,
    path: "/library",
  },
  {
    title: "Verification",
    icon: <FaUserGraduate />,
    path: "/verify_students",
  },
];

export default sidebarData;
