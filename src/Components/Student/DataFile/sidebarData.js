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
import { RiGraduationCapLine } from "react-icons/ri";
import { FcAlarmClock, FcMoneyTransfer } from "react-icons/fc";
import { FcHome } from "react-icons/fc";
import { FcReading } from "react-icons/fc";
import { FcAdvertising } from "react-icons/fc";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { LiaClipboardListSolid } from "react-icons/lia";

const sidebarData = [
  {
    title: "Dashboard",
    icon: <FcHome />,
    path: "/student_dash",
  },
  {
    title: "My Class",
    icon: <RiGraduationCapLine color="blue"/>,
    path: "/student_class",
  },
  {
    title: "Finance",
    icon: <FcMoneyTransfer />,
    path: "/student_finance",
  },
  {
    title: "Library",
    icon: <FcReading />,
    path: "/student_library",
  },
  {
    title: "Notice Board",
    icon: <MdOutlineNotificationsActive color="red" />,
    items: [
      {
        title: "Notice",
        icon: <LiaClipboardListSolid color="violet" />,
        path: "/student/noticeboard/announcements",
      },
      {
        title: "Events",
        icon: <FcAdvertising />,
        path: "/student/noticeboard/events",
      },
    ],
  },
];

export default sidebarData;
