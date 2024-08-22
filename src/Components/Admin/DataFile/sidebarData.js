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
import { MdLocalLibrary, MdManageAccounts } from "react-icons/md";
import { RiParentFill, RiAdminFill } from "react-icons/ri";

const sidebarData = [
  {
    title: "Dashboard",
    icon: <TbDashboard />,
    path: `/dashboard`,
    roles: ["admin", "teacher", "librarian", "accountant", "peon"],
  },
  {
    title: "Classes",
    icon: <RiGraduationCapLine />,
    path: `/class`,
    roles: ["admin", "teacher"],
  },
  {
    title: "Users",
    icon: <LuUser />,
    roles: ["admin", "teacher"],
    items: [
      {
        title: "Student",
        icon: <FaUserGraduate />,
        path: "/users/students",
        roles: ["admin", "teacher"],
      },
      {
        title: "Parent",
        icon: <RiParentFill />,
        path: "/users/parents",
        roles: ["admin", "teacher"],
      },
      // Other user roles for admin only
      {
        title: "Teacher",
        icon: <FaChalkboardTeacher />,
        path: "/users/teachers",
        roles: ["admin"],
      },
      {
        title: "Accountant",
        icon: <MdManageAccounts />,
        path: "/users/accountants",
        roles: ["admin"],
      },
      {
        title: "Librarian",
        icon: <MdLocalLibrary />,
        path: "/users/librarian",
        roles: ["admin"],
      },
      {
        title: "Staff",
        icon: <GrUserWorker />,
        path: "/users/staffs",
        roles: ["admin"],
      },
    ],
  },
  {
    title: "Accounting",
    icon: <HiOutlineCalculator />,
    roles: ["admin", "accountant"],
    items: [
      {
        title: "Earning",
        icon: <FaClipboardList />,
        path: "/accounting/earning",
        roles: ["admin", "accountant"],
      },
      {
        title: "Student Fees",
        icon: <FaClipboardList />,
        path: "/accounting/studentfees",
        roles: ["admin", "accountant"],
      },
      {
        title: "Expenses",
        icon: <FaUniversity />,
        path: "/accounting/expenses",
        roles: ["admin", "accountant"],
      },
    ],
  },
  {
    title: "NoticeBoard",
    icon: <TbNotebook />,
    roles: ["admin", "teacher", "librarian"],
    items: [
      {
        title: "Announcements",
        icon: <FaClipboardList />,
        path: "/noticeboard/announcements",
        roles: ["admin", "teacher", "librarian"],
      },
      {
        title: "Events",
        icon: <FaBook />,
        path: "/noticeboard/events",
        roles: ["admin", "teacher", "librarian"],
      },
    ],
  },
  {
    title: "Admissions",
    icon: <RiUserAddLine />,
    path: "/admissions",
    roles: ["admin"],
  },
  {
    title: "Library",
    icon: <BsBook />,
    path: "/library",
    roles: ["admin", "librarian"],
  },
  {
    title: "Verification",
    icon: <FaUserGraduate />,
    path: "/verify_students",
    roles: ["admin"],
  },
];

export default sidebarData;
