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
    path: `/dashboard`,
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
        title: "Admin",
        icon: <RiAdminFill />,
        path: "/users/admin",
      },
      {
        title: "Students",
        icon: <FaUserGraduate />,
        path: "/users/students",
      },
      {
        title: "Teachers",
        icon: <FaChalkboardTeacher />,
        path: "/users/teachers",
      },
      {
        title: "Accountant",
        icon: <MdManageAccounts />,
        path: "/users/accountants",
      },
     
      {
        title: "Parents",
        icon: <RiParentFill />,
        path: "/users/parents",
      },
      {
        title: "Libraian",
        icon: <MdLocalLibrary />,
        path: "/users/libraians",
      },
      {
        title: "Staff",
        icon: <GrUserWorker />,
        path: "/users/staffs",
      },
    ],
  },
  {
    title: "Accounting",
    icon: <HiOutlineCalculator />,
    items: [
      {
        title: "Earning",
        icon: <FaClipboardList />,
        path: "/accounting/earning",
      },
      {
        title: "Student Fees",
        icon: <FaClipboardList />,
        path: "/accounting/studentfees",
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
