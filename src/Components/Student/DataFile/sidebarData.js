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

// const sidebarData = [
//   {
//     title: "Dashboard",
//     icon: <TbDashboard />,
//     path: "/student_dash",
//   },
//   {
//     title: "My Class",
//     icon: <RiGraduationCapLine />,
//     path: `/class`,
//   },

//   {
//     title: "Users",
//     icon: <LuUser />,
//     items: [
//       {
//         title: "Admin",
//         icon: <RiAdminFill />,
//         path: "/users/admin",
//       },
//       {
//         title: "Students",
//         icon: <FaUserGraduate />,
//         path: "/users/students",
//       },
//       {
//         title: "Teachers",
//         icon: <FaChalkboardTeacher />,
//         path: "/users/teachers",
//       },
//       {
//         title: "Accountant",
//         icon: <MdManageAccounts />,
//         path: "/users/accountants",
//       },
     
//       {
//         title: "Parents",
//         icon: <RiParentFill />,
//         path: "/users/parents",
//       },
//       {
//         title: "Libraian",
//         icon: <MdLocalLibrary />,
//         path: "/users/libraians",
//       },
//       {
//         title: "Staff",
//         icon: <GrUserWorker />,
//         path: "/users/staffs",
//       },
//     ],
//   },

//   {
//     title: "Finance",
//     icon: <RiGraduationCapLine />,
//     path: `/student_finance`,
//   },
//   {
//     title: "Library",
//     icon: <RiGraduationCapLine />,
//     path: `/student_Library`,
//   },

 
//   {
//     title: "NoticeBoard",
//     icon: <TbNotebook />,
//     items: [
//       {
//         title: "Announcements",
//         icon: <FaClipboardList />,
//         path: "student/noticeboard/announcements",
//       },
//       {
//         title: "Events",
//         icon: <FaBook />,
//         path: "student/noticeboard/events",
//       },
//     ],
//   },
 
// ];

// export default sidebarData;


const sidebarData = [
  {
    title: "Dashboard",
    icon: <TbDashboard />,
    path: "/student_dash",
  },
  {
    title: "My Class",
    icon: <RiGraduationCapLine />,
    path: "/student_class",
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
    title: "Finance",
    icon: <RiGraduationCapLine />,
    path: "/student_finance",
  },
  {
    title: "Library",
    icon: <RiGraduationCapLine />,
    path: "/student_library",
  },
  {
    title: "NoticeBoard",
    icon: <TbNotebook />,
    items: [
      {
        title: "Announcements",
        icon: <FaClipboardList />,
        path: "/student/noticeboard/announcements",
      },
      {
        title: "Events",
        icon: <FaBook />,
        path: "/student/noticeboard/events",
      },
    ],
  },
];

export default sidebarData;
