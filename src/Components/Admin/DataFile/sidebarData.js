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
import { BsCheckCircle } from "react-icons/bs";
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
    roles: ["admin", "teacher","accountant"],
    items: [
      {
        title: "Student",
        icon: <FaUserGraduate />,
        path: "/users/students",
        roles: ["admin", "teacher","accountant"],
      },
      {
        title: "Parent",
        icon: <RiParentFill />,
        path: "/users/parents",
        roles: ["admin", "teacher","accountant"],
      },
      // Other user roles for admin only
      {
        title: "Teacher",
        icon: <FaChalkboardTeacher />,
        path: "/users/teachers",
        roles: ["admin", "accountant"],
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
        roles: ["admin","librarian"],
      },
      {
        title: "Staff",
        icon: <GrUserWorker />,
        path: "/users/staffs",
        roles: ["admin","accountant"],
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
    roles: ["admin", "teacher", "librarian","accountant"],
    items: [
      {
        title: "Announcements",
        icon: <FaClipboardList />,
        path: "/noticeboard/notice",
        roles: ["admin", "teacher", "librarian","accountant"],
      },
      {
        title: "Events",
        icon: <FaBook />,
        path: "/noticeboard/events",
        roles: ["admin", "teacher", "librarian","accountant"],
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
    icon: <BsCheckCircle />,
    path: "/verify_students",
    roles: ["admin"],
  },
  {
    title: "Graduate",
    icon: <FaUserGraduate />,
    roles: ["admin"],
    path: `/graduates`

  },
];

export default sidebarData;
