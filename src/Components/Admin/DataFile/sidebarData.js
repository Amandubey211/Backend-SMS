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
import { IoReceiptOutline } from "react-icons/io5";
import { TbFileInvoice } from "react-icons/tb";
import { MdPayment } from "react-icons/md";
import { HiOutlineReceiptTax } from "react-icons/hi";
import { TbReport } from "react-icons/tb";
import { RiHandCoinLine } from "react-icons/ri";
import { TfiReceipt } from "react-icons/tfi";
import { FaWpforms } from "react-icons/fa6";

const sidebarData = [
  {
    title: "Dashboard",
    icon: <TbDashboard style={{ fontSize: "1.1rem" }} />,
    path: `/dashboard`,
    roles: [
      ROLES.ADMIN,
      ROLES.TEACHER,
      ROLES.LIBRARIAN,
      ROLES.FINANCE,
      ROLES.STAFF,
    ],
    //requiredPermission: PERMISSIONS.VIEW_DASHBOARD, // Reference permission from config
  },
  {
    title: "Classes",
    icon: <RiGraduationCapLine style={{ fontSize: "1.1rem" }} />,
    path: `/class`,
    roles: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STAFF],
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
    icon: <LuUser style={{ fontSize: "1.2rem" }} />,
    roles: [
      ROLES.ADMIN,
      ROLES.TEACHER,
      ROLES.FINANCE,
      ROLES.LIBRARIAN,
      ROLES.STAFF,
    ],
    items: [
      {
        title: "Manage Role",
        icon: <MdOutlineManageAccounts />,
        path: "/users/manage-roles",
        roles: [
          ROLES.ADMIN,
          ROLES.TEACHER,
          ROLES.FINANCE,
          ROLES.LIBRARIAN,
          ROLES.STAFF,
        ],
        //requiredPermission: PERMISSIONS.MANAGE_ROLES, // Added permission reference
      },

      {
        title: "Teacher",
        icon: <FaChalkboardTeacher />,
        path: "/users/teachers",
        roles: [ROLES.ADMIN, ROLES.FINANCE, ROLES.LIBRARIAN, ROLES.TEACHER],
        //requiredPermission: PERMISSIONS.VIEW_TEACHERS, // Added permission reference
      },
      {
        title: "Finance",
        icon: <MdManageAccounts />,
        path: "/users/accountants",
        roles: [ROLES.ADMIN, ROLES.FINANCE],
        //requiredPermission: PERMISSIONS.VIEW_ACCOUNTANTS, // Added permission reference
      },
      {
        title: "Librarian",
        icon: <MdLocalLibrary />,
        path: "/users/librarian",
        roles: [ROLES.ADMIN, ROLES.LIBRARIAN, ROLES.FINANCE],
        //requiredPermission: PERMISSIONS.VIEW_LIBRARIANS, // Added permission reference
      },
      {
        title: "Staff",
        icon: <GrUserWorker />,
        path: "/users/staffs",
        roles: [ROLES.ADMIN, ROLES.FINANCE, ROLES.LIBRARIAN, ROLES.STAFF],
        //requiredPermission: PERMISSIONS.VIEW_STAFF, // Added permission reference
      },
      {
        title: "Student",
        icon: <FaUserGraduate />,
        path: "/users/students",
        roles: [
          ROLES.ADMIN,
          ROLES.TEACHER,
          ROLES.FINANCE,
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
          ROLES.FINANCE,
          ROLES.LIBRARIAN,
          ROLES.STAFF,
        ],
        //requiredPermission: PERMISSIONS.VIEW_PARENTS, // Added permission reference
      },
    ],
  },
  {
    title: "Finance",
    icon: <HiOutlineCalculator style={{ fontSize: "1.1rem" }} />,
    roles: [ROLES.ADMIN, ROLES.FINANCE],
    items: [
      {
        title: "Earning",
        icon: <BsCashCoin />,
        path: "/finance/earning",
        roles: [ROLES.ADMIN, ROLES.FINANCE],
        //requiredPermission: PERMISSIONS.VIEW_EARNINGS, // Added permission reference
      },
      {
        title: "Student Fees",
        path: "/finance/studentfees",
        icon: <IoReceiptOutline style={{ fontSize: "1.1rem" }} />,
        roles: [ROLES.ADMIN, ROLES.FINANCE],
        //requiredPermission: PERMISSIONS.VIEW_FEES,
      },
      {
        title: "Expense",
        path: "/finance/expenses",
        icon: <RiHandCoinLine style={{ fontSize: "1.1rem" }} />,
        roles: [ROLES.ADMIN, ROLES.FINANCE],
        //requiredPermission: PERMISSIONS.VIEW_EXPENSES,
      },
      {
        title: "Invoices",
        path: "/finance/invoices/dashboard",
        icon: <TbFileInvoice style={{ fontSize: "1.1rem" }} />,
        roles: [ROLES.ADMIN, ROLES.FINANCE],
        //requiredPermission: PERMISSIONS.VIEW_INVOICES,
      },
      {
        title: "Receipts",
        path: "/finance/receipts",
        icon: <TfiReceipt style={{ fontSize: "1.1rem" }} />,
        roles: [ROLES.ADMIN, ROLES.FINANCE],
        //requiredPermission: PERMISSIONS.VIEW_RECEIPTS,
      },
      {
        title: "Quotations",
        path: "/finance/quotations",
        icon: <FaWpforms style={{ fontSize: "1.1rem" }} />,
        roles: [ROLES.ADMIN, ROLES.FINANCE],
        //requiredPermission: PERMISSIONS.VIEW_QUOTATIONS,
      },
      // {
      //   title: "Payments",
      //   path: "/finance/payments",
      //   icon: <MdPayment style={{ fontSize: '1.1rem' }} />,
      //   roles: [ROLES.ADMIN, ROLES.FINANCE],
      //   //requiredPermission: PERMISSIONS.VIEW_PAYMENTS,
      // },
      // {
      //   title: "Reports",
      //   path: "/finance/reports",
      //   icon: <TbReport style={{ fontSize: '1.1rem' }} />,
      //   roles: [ROLES.ADMIN, ROLES.FINANCE],
      //   //requiredPermission: PERMISSIONS.VIEW_REPORTS,
      // },
      {
        title: "Penalties & Adjustment",
        path: "/finance/penaltyAdjustment",
        icon: <HiOutlineReceiptTax style={{ fontSize: "1.1rem" }} />,
        roles: [ROLES.ADMIN, ROLES.FINANCE],
        //requiredPermission: PERMISSIONS.VIEW_PENALTIES,
      },
    ],
  },
  {
    title: "NoticeBoard",
    icon: <TbNotebook style={{ fontSize: "1.1rem" }} />,
    roles: [
      ROLES.ADMIN,
      ROLES.TEACHER,
      ROLES.LIBRARIAN,
      ROLES.FINANCE,
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
          ROLES.FINANCE,
          ROLES.STAFF,
        ],
        //requiredPermission: PERMISSIONS.VIEW_NOTICE, // Added permission reference
      },
      {
        title: "Events",
        icon: <FaBook />,
        path: "/noticeboard/events",
        roles: [
          ROLES.ADMIN,
          ROLES.TEACHER,
          ROLES.LIBRARIAN,
          ROLES.FINANCE,
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
    roles: [ROLES.ADMIN, ROLES.STAFF],
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
    roles: [ROLES.ADMIN, ROLES.STAFF],
    //requiredPermission: PERMISSIONS.MANAGE_LIBRARY, // Added permission reference
  },
  {
    title: "Admissions",
    icon: <RiUserAddLine />,
    path: "/admissions",
    roles: [ROLES.ADMIN, ROLES.STAFF],
    //requiredPermission: PERMISSIONS.MANAGE_ADMISSIONS, // Added permission reference
  },
  {
    title: "Verification",
    icon: <BsCheckCircle />,
    path: "/verify_students",
    roles: [ROLES.ADMIN, ROLES.STAFF],
    //requiredPermission: PERMISSIONS.VERIFY_STUDENTS, // Added permission reference
  },
  {
    title: "Graduate",
    icon: <FaUserGraduate />,
    roles: [ROLES.ADMIN, ROLES.STAFF],
    path: `/graduates`,
    //requiredPermission: PERMISSIONS.VIEW_GRADUATES, // Added permission reference
  },
];

export default sidebarData;
