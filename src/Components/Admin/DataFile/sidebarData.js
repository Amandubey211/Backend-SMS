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
import { ImTable2 } from "react-icons/im";
import { RiUserAddLine } from "react-icons/ri";
import { BsBook } from "react-icons/bs";
import { TbNotebook } from "react-icons/tb";
import { BsCheckCircle } from "react-icons/bs";
import { GrUserWorker } from "react-icons/gr";
import { MdLocalLibrary, MdManageAccounts } from "react-icons/md";
import { RiParentFill, RiAdminFill } from "react-icons/ri";
import { MdOutlineManageAccounts } from "react-icons/md";
import { ROLES, PERMISSIONS } from "../../../config/permission";
import { BsCashCoin } from "react-icons/bs";
const sidebarData = [
  {
    title: "Dashboard",
    icon: <TbDashboard />,
    path: `/dashboard`,
    roles: [
      ROLES.ADMIN,
      ROLES.TEACHER,
      ROLES.LIBRARIAN,
      ROLES.ACCOUNTANT,
      ROLES.STAFF,
    ],
    //requiredPermission: PERMISSIONS.VIEW_DASHBOARD, // Reference permission from config
  },
  {
    title: "Classes",
    icon: <RiGraduationCapLine />,
    path: `/class`,
    roles: [ROLES.ADMIN, ROLES.TEACHER],
    //requiredPermission: PERMISSIONS.VIEW_CLASSES, // Added permission reference
  },
  {
    title: "Library",
    icon: <BsBook />,
    path: "/library",
    roles: [ROLES.TEACHER, ROLES.LIBRARIAN],
    //requiredPermission: PERMISSIONS.MANAGE_LIBRARY, // Added permission reference
  },
  {
    title: "Users",
    icon: <LuUser />,
    roles: [
      ROLES.ADMIN,
      ROLES.TEACHER,
      ROLES.ACCOUNTANT,
      ROLES.LIBRARIAN,
      ROLES.STAFF,
    ],
    items: [
      {
        title: "Manage Role",
        icon: <MdOutlineManageAccounts />,
        path: "/users/manage-roles",
        roles: [ROLES.ADMIN],
        //requiredPermission: PERMISSIONS.MANAGE_ROLES, // Added permission reference
      },

      {
        title: "Teacher",
        icon: <FaChalkboardTeacher />,
        path: "/users/teachers",
        roles: [ROLES.ADMIN, ROLES.ACCOUNTANT, ROLES.LIBRARIAN, ROLES.STAFF],
        //requiredPermission: PERMISSIONS.VIEW_TEACHERS, // Added permission reference
      },
      {
        title: "Accountant",
        icon: <MdManageAccounts />,
        path: "/users/accountants",
        roles: [ROLES.ADMIN],
        //requiredPermission: PERMISSIONS.VIEW_ACCOUNTANTS, // Added permission reference
      },
      {
        title: "Librarian",
        icon: <MdLocalLibrary />,
        path: "/users/librarian",
        roles: [ROLES.ADMIN, ROLES.LIBRARIAN],
        //requiredPermission: PERMISSIONS.VIEW_LIBRARIANS, // Added permission reference
      },
      {
        title: "Staff",
        icon: <GrUserWorker />,
        path: "/users/staffs",
        roles: [
          ROLES.ADMIN,
          ROLES.TEACHER,
          ROLES.ACCOUNTANT,
          ROLES.LIBRARIAN,
          ROLES.STAFF,
        ],
        //requiredPermission: PERMISSIONS.VIEW_STAFF, // Added permission reference
      },
      {
        title: "Student",
        icon: <FaUserGraduate />,
        path: "/users/students",
        roles: [
          ROLES.ADMIN,
          ROLES.TEACHER,
          ROLES.ACCOUNTANT,
          ROLES.LIBRARIAN,
          ROLES.STAFF,
        ],
        //requiredPermission: PERMISSIONS.VIEW_STUDENTS, // Added permission reference
      },
      {
        title: "Parent",
        icon: <RiParentFill />,
        path: "/users/parents",
        roles: [
          ROLES.ADMIN,
          ROLES.TEACHER,
          ROLES.ACCOUNTANT,
          ROLES.LIBRARIAN,
          ROLES.STAFF,
        ],
        //requiredPermission: PERMISSIONS.VIEW_PARENTS, // Added permission reference
      },
    ],
  },
  {
    title: "Finance",
    icon: <HiOutlineCalculator />,
    roles: [ROLES.ADMIN, ROLES.ACCOUNTANT],
    items: [
      {
        title: "Earning",
        icon: <BsCashCoin />,
        path: "/finance/earning",
        roles: [ROLES.ADMIN, ROLES.ACCOUNTANT],
        //requiredPermission: PERMISSIONS.VIEW_EARNINGS, // Added permission reference
      },
      {
        title: "Student Fees",
        path: "/finance/studentfees",
        roles: [ROLES.ADMIN, ROLES.ACCOUNTANT],
        //requiredPermission: PERMISSIONS.VIEW_FEES, // Added permission reference
      },
      {
        title: "Expense",
        path: "/finance/expenses",
        roles: [ROLES.ADMIN, ROLES.ACCOUNTANT],
        //requiredPermission: PERMISSIONS.VIEW_EXPENSES, // Added permission reference
      },
      {
        title: "Invoices",
        path: "/finance/invoices",
        roles: [ROLES.ADMIN, ROLES.ACCOUNTANT],
        //requiredPermission: PERMISSIONS.VIEW_INVOICES, // Added permission reference
      },
      {
        title: "Receipts",
        path: "/finance/receipts",
        roles: [ROLES.ADMIN, ROLES.ACCOUNTANT],
        //requiredPermission: PERMISSIONS.VIEW_RECEIPTS, // Added permission reference
      },
      {
        title: "Quotations",
        path: "/finance/quotations",
        roles: [ROLES.ADMIN, ROLES.ACCOUNTANT],
        //requiredPermission: PERMISSIONS.VIEW_QUOTATIONS, // Added permission reference
      },
      {
        title: "Payments",
        path: "/finance/payments",
        roles: [ROLES.ADMIN, ROLES.ACCOUNTANT],
        //requiredPermission: PERMISSIONS.VIEW_PAYMENTS, // Added permission reference
      },
      {
        title: "Reports",
        path: "/finance/reports",
        roles: [ROLES.ADMIN, ROLES.ACCOUNTANT],
        //requiredPermission: PERMISSIONS.VIEW_REPORTS, // Added permission reference
      },
      {
        title: "Penalties & Adjustments",
        path: "/finance/penalties_adjustments",
        roles: [ROLES.ADMIN, ROLES.ACCOUNTANT],
        //requiredPermission: PERMISSIONS.VIEW_PENALTIES, // Added permission reference
      },
    ],
  },
  {
    title: "NoticeBoard",
    icon: <TbNotebook />,
    roles: [
      ROLES.ADMIN,
      ROLES.TEACHER,
      ROLES.LIBRARIAN,
      ROLES.ACCOUNTANT,
      ROLES.STAFF,
    ],
    items: [
      {
        title: "Announcements",
        icon: <FaClipboardList />,
        path: "/noticeboard/notice",
        roles: [
          ROLES.ADMIN,
          ROLES.TEACHER,
          ROLES.LIBRARIAN,
          ROLES.ACCOUNTANT,
          ROLES.STAFF,
        ],
        //requiredPermission: PERMISSIONS.VIEW_NOTICES, // Added permission reference
      },
      {
        title: "Events",
        icon: <FaBook />,
        path: "/noticeboard/events",
        roles: [
          ROLES.ADMIN,
          ROLES.TEACHER,
          ROLES.LIBRARIAN,
          ROLES.ACCOUNTANT,
          ROLES.STAFF,
        ],
        //requiredPermission: PERMISSIONS.VIEW_EVENTS, // Added permission reference
      },
    ],
  },
  {
    title: "Time Table",
    icon: <ImTable2 />,
    path: "/timetable",
    roles: [ROLES.ADMIN],
    //requiredPermission: PERMISSIONS.MANAGE_TIMETABLE, // Added permission reference
  },
  {
    title: "Time Table",
    icon: <ImTable2 />,
    path: "/teacher_timetable",
    roles: [ROLES.TEACHER],
    //requiredPermission: PERMISSIONS.MANAGE_TIMETABLE, // Added permission reference
  },
  {
    title: "Library",
    icon: <BsBook />,
    path: "/library",
    roles: [ROLES.ADMIN],
    //requiredPermission: PERMISSIONS.MANAGE_LIBRARY, // Added permission reference
  },
  {
    title: "Admissions",
    icon: <RiUserAddLine />,
    path: "/admissions",
    roles: [ROLES.ADMIN],
    //requiredPermission: PERMISSIONS.MANAGE_ADMISSIONS, // Added permission reference
  },
  {
    title: "Verification",
    icon: <BsCheckCircle />,
    path: "/verify_students",
    roles: [ROLES.ADMIN],
    //requiredPermission: PERMISSIONS.VERIFY_STUDENTS, // Added permission reference
  },
  {
    title: "Graduate",
    icon: <FaUserGraduate />,
    roles: [ROLES.ADMIN],
    path: `/graduates`,
    //requiredPermission: PERMISSIONS.VIEW_GRADUATES, // Added permission reference
  },
];

export default sidebarData;
