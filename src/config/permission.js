// config/permissions.js

// Define roles
export const ROLES = {
  ADMIN: "admin",
  TEACHER: "teacher",
  ACCOUNTANT: "accountant",
  LIBRARIAN: "librarian",
  STAFF: "staff",
  STUDENT: "student",
  PARENT: "parent",
};

// Define permissions
export const PERMISSIONS = {
  // Dashboard permissions
  VIEW_DASHBOARD: "viewDashboard",

  // Users permissions
  MANAGE_USERS: "manageUsers",
  VIEW_USERS: "viewUsers",

  // Library permissions
  MANAGE_LIBRARY: "manageLibrary",
  VIEW_LIBRARY: "Get All Books",
  ISSUE_BOOK: "Get All Issued Books",
  // Finance permissions
  MANAGE_FINANCE: "manageFinance",
  VIEW_FINANCE: "viewFinance",

  // Other permissions
  CREATE_CLASSES: "createClasses",
  MANAGE_TIMETABLE: "manageTimetable",
  VIEW_NOTICES: "viewNotices",
  ADD_BOOK: "addbook",
  GET_NOTICE: "get all notice",

  // Graduation permissions
  VIEW_GRADUATES: "viewGraduates",
  DEMOTE_GRADUATES: "demoteGraduates",

  // Timetable Permissions
  VIEW_TIMETABLE: "viewTimetable",
  CREATE_TIMETABLE: "createTimetable",


  // Admin Dashboard Permissions
  VIEW_ATTENDANCE: "viewAttendance",
  VIEW_EARNINGS: "viewEarnings",
  VIEW_TOP_RANKING: "viewTopRanking",
  VIEW_STUDENTS: "viewStudents",
  VIEW_NOTICES: "viewNotices",
  VIEW_EVENTS: "viewEvents",
  VIEW_LIBRARY: "viewLibrary",

};
