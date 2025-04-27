import {
  configureStore,
  createListenerMiddleware,
  isAnyOf,
} from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage for web
import { combineReducers } from "redux";

// common
import authReducer from "./Slices/Common/Auth/reducers/authSlice"; // Importing the auth slice reducer
import userReducer, {
  setSelectedSemester,
} from "./Slices/Common/User/reducers/userSlice"; // Importing the user slice reducer
import alertReducer from "./Slices/Common/Alerts/alertsSlice";
import academicYearReducer from "./Slices/Common/AcademicYear/academicYear.slice";
import financialYearReducer from "./Slices/Common/FinancialYear/financialYear.slice";
import branchReducer from "./Slices/Admin/branchs/branch.slice";
import sendEmailReducer from "./Slices/Common/SendPDFEmail/sendEmailSlice";
import studentSignUpReducer, {
  studentSignupMiddleware,
} from "./Slices/Common/User/actions/studentSignupSlice";

// admin
import adminDashboardReducer from "./Slices/Admin/Dashboard/adminDashboardSlice";
import financialCategoryReducer from "./Slices/Finance/Category/financeCategory.Slice";
import financeConfigurationReducer from "./Slices/Finance/Configuration/configuration.slice";
import inventoryReducer from "./Slices/Finance/inventory/inventory.slice";
import budgetReducer from "./Slices/Finance/budget/budget.slice";
import entityReducer from "./Slices/Finance/entitie/entity.slice";
import entityRevenueReducer from "./Slices/Finance/EntityRevenue/EntityRevenue.slice";
import teacherReducer from "./Slices/Admin/Class/Teachers/teacherSlice";
import classReducer from "./Slices/Admin/Class/reducer/classSlice";
import semesterReducer from "./Slices/Admin/Class/Semester/semesterSlice";

import subjectReducer from "./Slices/Admin/Class/Subject/subjectSlice";
import subjectGradesReducer from "./Slices/Admin/Class/grades/gradesSlice";
import subjectQuizReducer from "./Slices/Admin/Class/Quiz/quizSlice";
import sectionReducer from "./Slices/Admin/Class/Section_Groups/groupSectionSlice";
import graduateReducer from "./Slices/Admin/Graduate/graduateSlice";
import classStudentReducer from "./Slices/Admin/Class/Students/studentSlice";
import attendanceReducer from "./Slices/Admin/Class/Attendence/attendanceSlice";
import verificationReducer from "./Slices/Admin/Verification/VerificationSlice";
import adminLibraryReducer from "./Slices/Admin/Library/LibrarySlice";
import adminEventReducer from "./Slices/Admin/NoticeBoard/Events/eventSlice";
import adminNoticeReducer from "./Slices/Admin/NoticeBoard/Notice/noticeSlice";
import adminModuleReducer from "./Slices/Admin/Class/Module/moduleSlice";
import adminSyllabusReducer from "./Slices/Admin/Class/Syllabus/syllabusSlice";
import adminPageReducer from "./Slices/Admin/Class/Page/pageSlice";
import adminDiscussionReducer from "./Slices/Admin/Class/Discussion/discussionSlice";
import adminAnnouncementReducer from "./Slices/Admin/Class/Announcement/announcementSlice";
import allStudentReducer from "./Slices/Admin/Users/Students/studentSlice";
import allParentReducer from "./Slices/Admin/Users/Parents/parentSilce";
import allstaffReducer from "./Slices/Admin/Users/Staff/staffSlice";

import receiptsReducer from "./Slices/Finance/Receipts/receiptsSlice";

import quotationReducer from "./Slices/Finance/Quotations/quotationSlice";
import studentFeesReducer from "./Slices/Finance/StudentFees/studentFeesSlice";
import adminRubricReducer from "./Slices/Admin/Class/Rubric/rubricSlice";
import adminDiscussionCommentsReducer from "./Slices/Admin/Class/Discussion/Comments/discussionCommentsSlice";
import adminAnnouncementCommentsReducer from "./Slices/Admin/Class/Announcement/Comment/announcementCommentsSlice";
import adminAssignmentReducer from "./Slices/Admin/Class/Assignment/assignmentSlice";
import adminQuizReducer from "./Slices/Admin/Class/Quiz/quizSlice";
import adminSpeedGradeReducer from "./Slices/Admin/Class/SpeedGrade/speedGradeSlice";
import timetableReducer from "./Slices/Admin/TimeTable/timtableSlice";
import adminClassIconsReducer from "./Slices/Admin/Class/reducer/iconSlice";
import rbacReducer from "./Slices/Common/RBAC/rbacSlice";
import admissonAttachmentReducer from "./Slices/Admin/Admission/admissionSlice";
import earnignsReducer from "./Slices/Finance/Earnings/earningsSlice";
import adminOfflineExamReducer from "./Slices/Admin/Class/OfflineExam/offlineExamSlice";
import operationalExpensesReducer from "./Slices/Finance/operationalExpenses/operationalExpenses.slice";
import payrollReducer from "./Slices/Finance/payroll/payroll.slice";
// student
import studentDashboardReducer from "./Slices/Student/Dashboard/studentDashboardSlices";
import studentFinanceReducer from "./Slices/Student/Finance/financeSlice";
import studentLibraryBooksReducer from "./Slices/Student/Library/libararySlice";
import studentIssueBooksReducer from "./Slices/Student/Library/bookIssuesSlice";
import studentAnnouncementReducer from "../Store/Slices/Student/Noticeboard/noticeSlice";
import studentEventReducer from "../Store/Slices/Student/Noticeboard/eventsSlice";
import studentClassReducer from "../Store/Slices/Student/MyClass/Class/classSlice";
import studentClassTeacherReducer from "../Store/Slices/Student/MyClass/Class/classTeacher/classTeacherSlice";
import studentClassmateReducer from "../Store/Slices/Student/MyClass/Class/classMates/classmateSlice";
import studentAttendanceReducer from "../Store/Slices/Student/MyClass/Class/Attendance/stdAttendanceSlice";
import studentSubjectReducer from "../Store/Slices/Student/MyClass/Class/Subjects/subjectSlice";
import studentModuleReducer from "../Store/Slices/Student/MyClass/Class/Subjects/Modules/moduleSlice";
import studentAssignmentReducer from "../Store/Slices/Student/MyClass/Class/Subjects/Assignment/assignmentSlice";
import studentQuizReducer from "../Store/Slices/Student/MyClass/Class/Subjects/Quizes/quizesSlice";
import studentSyllabusReducer from "../Store/Slices/Student/MyClass/Class/Subjects/Syllabus/syllabusSlice";
import studentPagesReducer from "../Store/Slices/Student/MyClass/Class/Subjects/Pages/pagesSlice";
import studentDiscussionReducer from "../Store/Slices/Student/MyClass/Class/Subjects/Discussion/discussionSlice";
import studentAnnounceReducer from "../Store/Slices/Student/MyClass/Class/Subjects/Announcement/announcementSlice";
import studentTimeTableReducer from "../Store/Slices/Student/TimeTable/studentTimeTableSlice";
import studentSemesterReducer from "../Store/Slices/Student/MyClass/Class/semester/semesterSlice";
import studentRubricReducer from "../Store/Slices/Student/MyClass/Class/Subjects/Rubric/rubricSlice";
// parent
import dashboardReducer from "../Store/Slices/Parent/Dashboard/dashboardSlice";
import financeReducer from "../Store/Slices/Parent/Finance/financeSlice";
import noticeReducer from "../Store/Slices/Parent/NoticeBoard/noticeSlice";
import childrenReducer from "../Store/Slices/Parent/Children/childrenSlice";
import libraryReducer from "../Store/Slices/Parent/Library/librarySlices";
import eventReducer from "../Store/Slices/Parent/Events/eventSlice";
import parentTimeTableReducer from "../Store/Slices/Parent/TimeTable/parentTimeTableSlice";
import parentSemesterReducer from "./Slices/Parent/Semesters/parentSemesterSlice";
import parentChildGradesReducer from "./Slices/Parent/Grades/parentGradeSlice";
// teacher
import teacherTimeTableReducer from "../Store/Slices/Teacher/teacherTimeTableSlice";
import { saveDraft } from "../Utils/signupDraft";

// transportation
import transportRouteReducer from "../Store/Slices/Transportation/RoutesManagment/routeSlice";
import transportVehicleReducer from "../Store/Slices/Transportation/Vehicles/vehiclesSlice";
import transportShiftReducer from "../Store/Slices/Transportation/Shift/shiftSlice";

import transportSubRouteReducer from "../Store/Slices/Transportation/SubRoute/subRouteSlice";
import transportVDAssignmentReducer from "../Store/Slices/Transportation/vehicleDriverAssignment/vehicleDriverAssignmentSice";
import transportDriverReducer from "../Store/Slices/Transportation/Driver/driver.slice";

// Persist configuration for the Auth slice

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: [
    "isLoggedIn",
    "role",
    "AcademicYear",
    "token",
    "selectedLanguage",
    "userRoles",
    "permissions",
  ], // Fields to persist
};
const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: isAnyOf(setSelectedSemester),
  effect: async (action, listenerApi) => {
    // Wait 500ms to allow state persistence to complete
    await new Promise((resolve) => setTimeout(resolve, 500));
    window.location.reload();
  },
});
// Persist configuration for the User slice
const userPersistConfig = {
  key: "user",
  storage,
  // whitelist: [
  //   "userDetails",
  //   "navbar", // Persist NavbarData
  //   "classInfo", // Persist the entire classInfo object
  //   "subjectInfo", // Persist the entire subjectInfo object
  // ], // Whitelt fields based on the refined state structure in userSlicesed on the refined state structure in userSlice
};

const semesterPersistConfig = {
  key: "semesters",
  storage,
  whitelist: ["semesters", "selectedSemester"], // Persist both the semesters array and the selectedSemester object
};

const stdSubjectPersistConfig = {
  key: "stdSubject",
  storage,
  whitelist: ["subject"],
};

const stdClassPersistConfig = {
  key: "studentClass",
  storage,
};
// const rbacPersistConfig = {
//   key: "rbac",
//   storage,
// };

// Combine the Auth and User reducers under a Common entity
const commonReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  user: persistReducer(userPersistConfig, userReducer),
  alertMsg: alertReducer,
  academicYear: academicYearReducer,
  financialYear: financialYearReducer,
  branchs: branchReducer,
  sendEmail: sendEmailReducer,
  studentSignup: studentSignUpReducer,
});

const AdminReducer = combineReducers({
  adminDashboard: adminDashboardReducer,
  class: classReducer,
  semesters: persistReducer(semesterPersistConfig, semesterReducer),
  subject: subjectReducer,
  group_section: sectionReducer,
  teacher: teacherReducer,
  teacherTimetable: teacherTimeTableReducer,
  students: classStudentReducer,
  attendance: attendanceReducer,
  verification: verificationReducer,
  library: adminLibraryReducer,
  events: adminEventReducer,
  notice: adminNoticeReducer,
  module: adminModuleReducer,
  syllabus: adminSyllabusReducer,
  pages: adminPageReducer,
  discussions: adminDiscussionReducer,
  announcements: adminAnnouncementReducer,
  rubrics: adminRubricReducer,
  discussionComments: adminDiscussionCommentsReducer,
  announcementComments: adminAnnouncementCommentsReducer,
  assignments: adminAssignmentReducer,
  quizzes: adminQuizReducer,
  timetable: timetableReducer,
  speedgrades: adminSpeedGradeReducer,
  classIcons: adminClassIconsReducer,
  quotations: quotationReducer,
  receipts: receiptsReducer,
  graduates: graduateReducer,
  all_students: allStudentReducer,
  all_parents: allParentReducer,
  all_staff: allstaffReducer,
  financialCategory: financialCategoryReducer,
  configuration: financeConfigurationReducer,
  inventory: inventoryReducer,
  inventory: inventoryReducer,
  entity: entityReducer,
  entityRevenue: entityRevenueReducer,
  budget: budgetReducer,
  payroll: payrollReducer,
  operationalExpenses: operationalExpensesReducer,
  admissionAttachment: admissonAttachmentReducer,
  // student_fees: studentFeesReducer,

  subject_grades: subjectGradesReducer,
  // subject_assignment: subjectAssignmentReducer,
  subject_quiz: subjectQuizReducer,

  //RBAC
  rbac: rbacReducer,
  // rbac: persistReducer(rbacPersistConfig, rbacReducer),

  // Finance
  earnings: earnignsReducer,
  studentFees: studentFeesReducer,
  offlineExam: adminOfflineExamReducer,
});

const studentReducer = combineReducers({
  studentDashboard: studentDashboardReducer,
  studentFinance: studentFinanceReducer,
  studentLibraryBooks: studentLibraryBooksReducer,
  studentIssueBooks: studentIssueBooksReducer,
  studentAnnouncement: studentAnnouncementReducer,
  studentEvent: studentEventReducer,
  studentClass: persistReducer(stdClassPersistConfig, studentClassReducer),
  studentClassTeacher: studentClassTeacherReducer,
  studentClassmate: studentClassmateReducer,
  studentAttendance: studentAttendanceReducer,
  studentSubject: persistReducer(
    stdSubjectPersistConfig,
    studentSubjectReducer
  ),
  studentModule: studentModuleReducer,
  studentAssignment: studentAssignmentReducer,
  studentQuiz: studentQuizReducer,
  studentSyllabus: studentSyllabusReducer,
  studentPages: studentPagesReducer,
  studentDiscussion: studentDiscussionReducer,
  studentAnnounce: studentAnnounceReducer,
  studentTimetable: studentTimeTableReducer,
  semesters: persistReducer(semesterPersistConfig, studentSemesterReducer),
  studentRubric: studentRubricReducer,
});

const ParentReducer = combineReducers({
  dashboard: dashboardReducer,
  finance: financeReducer,
  children: childrenReducer,
  notice: noticeReducer,
  library: libraryReducer,
  events: eventReducer,
  parentTimetable: parentTimeTableReducer,
  semesters: parentSemesterReducer,
  grades: parentChildGradesReducer,
});

const transportReducer = combineReducers({
  transportRoute: transportRouteReducer,
  transportVehicle: transportVehicleReducer,
  transportShift: transportShiftReducer,

  transportSubRoute: transportSubRouteReducer,
  transportVDAssignment:transportVDAssignmentReducer,

  transportDriver: transportDriverReducer,

});

// Create the store
const store = configureStore({
  reducer: {
    common: commonReducer, // Grouping Auth and User under Common
    // Other slices remain unchanged
    admin: AdminReducer, // Grouping all admin-related reducers

    // Using persisted user reducer
    // studentFinance: studentFinanceReducer,
    // studentLibraryBooks: studentLibraryBooksReducer,
    // studentIssueBooks: studentIssueBooksReducer,

    student: studentReducer,
    Parent: ParentReducer,
    transportation: transportReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(listenerMiddleware.middleware, studentSignupMiddleware), // Thunk is automatically included by Redux Toolkit
});
let prevDraft = store.getState().common.studentSignup;
store.subscribe(() => {
  const nextDraft = store.getState().common.studentSignup;
  if (nextDraft !== prevDraft) {
    /* write to localStorage on every change */
    saveDraft(nextDraft);
    prevDraft = nextDraft;
  }
});
const persistor = persistStore(store);

export { store, persistor };
