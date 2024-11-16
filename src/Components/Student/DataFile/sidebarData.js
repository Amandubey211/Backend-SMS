import React from "react";
import { TbDashboard } from "react-icons/tb";
import { RiGraduationCapLine } from "react-icons/ri";
import { HiOutlineCalculator } from "react-icons/hi2";
import { MdLocalLibrary, MdOutlineNotificationsActive } from "react-icons/md";
import { FaClipboardList, FaBook } from "react-icons/fa";
import { LiaClipboardListSolid } from "react-icons/lia";
import { FcAdvertising } from "react-icons/fc";
import { ImTable2 } from "react-icons/im";


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
    title: "Finance",
    icon: <HiOutlineCalculator />,
    path: "/student_finance",
  },
  {
    title: "Library",
    icon: <MdLocalLibrary />,
    path: "/student_library",
  },
  {
    title: "Time Table",
    icon: <ImTable2 />,
    path: "/timetable",
  },
  {
    title: "Notice Board",
    icon: <MdOutlineNotificationsActive />,
    items: [
      {
        title: "Notice",
        // icon: <FaClipboardList />,
        path: "/student/noticeboard/announcements",
      },
      {
        title: "Events",
        // icon: <FcAdvertising />,
        path: "/student/noticeboard/events",
      },
    ],
  },
];

export default sidebarData;
