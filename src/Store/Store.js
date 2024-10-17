import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage for web
import { combineReducers } from "redux";
// common
import authReducer from "./Slices/Common/Auth/reducers/authSlice"; // Importing the auth slice reducer
import userReducer from "./Slices/Common/User/reducers/userSlice"; // Importing the user slice reducer
import alertReducer from "./Slices/Common/Alerts/alertsSlice";

// admin
import adminDashboardReducer from "./Slices/Admin/Dashboard/adminDashboardSlice";
import teacherReducer from "./Slices/Admin/Class/Teachers/teacherSlice";
import classReducer from "./Slices/Admin/Class/reducer/classSlice"; // Importing the combined admin reducer
import subjectReducer from "./Slices/Admin/Class/Subject/subjectSlice";
import subjectGradesReducer from "./Slices/Admin/Class/grades/gradesSlice";
import subjectAssignmentReducer from "./Slices/Admin/Class/Assignments/assignmentSlice";
import subjectQuizReducer from "./Slices/Admin/Class/Quiz/quizSlice";
import sectionReducer from "./Slices/Admin/Class/Section_Groups/groupSectionSlice";
import graduateReducer from "./Slices/Admin/Graduate/graduateSlice"
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
import earningReducer from "./Slices/Admin/Accounting/Earning/earningSlice";
import studentFeesReducer from "./Slices/Admin/Accounting/StudentFees/studentFeesSlice";
import expensesReducer from "./Slices/Admin/Accounting/Expenses/expensesSlice";
import adminRubricReducer from "./Slices/Admin/Class/Rubric/rubricSlice";
import adminDiscussionCommentsReducer from "./Slices/Admin/Class/Discussion/Comments/discussionCommentsSlice";
import adminCommentReducer from "./Slices/Admin/Class/Comment/commentsSlice";
import adminAnnouncementCommentsReducer from "./Slices/Admin/Class/Announcement/Comment/announcementCommentsSlice";
import adminAssignmentReducer from "./Slices/Admin/Class/Assignment/assignmentSlice";
import adminQuizReducer from "./Slices/Admin/Class/Quiz/quizSlice";

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
// parent
import dashboardReducer from "../Store/Slices/Parent/Dashboard/dashboardSlice";
import financeReducer from "../Store/Slices/Parent/Finance/financeSlice";
import noticeReducer from "../Store/Slices/Parent/NoticeBoard/noticeSlice";
import childrenReducer from "../Store/Slices/Parent/Children/childrenSlice";
import libraryReducer from "../Store/Slices/Parent/Library/librarySlices";
import eventReducer from "../Store/Slices/Parent/Events/eventSlice";

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
  ], // Fields to persist
};

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

const stdSubjectPersistConfig = {
  key: "stdSubject",
  storage,
  whitelist: ["subject"],
};

// Combine the Auth and User reducers under a Common entity
const commonReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  user: persistReducer(userPersistConfig, userReducer),
  alertMsg: alertReducer,
});
const AdminReducer = combineReducers({
  adminDashboard: adminDashboardReducer,
  class: classReducer,
  subject: subjectReducer,
  group_section: sectionReducer,
  teacher: teacherReducer,
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
  comments: adminCommentReducer,
  assignments: adminAssignmentReducer,
  quizzes: adminQuizReducer,
  graduates: graduateReducer,
  all_students: allStudentReducer,
  all_parents: allParentReducer,
  all_staff: allstaffReducer,
  earning: earningReducer,
  student_fees: studentFeesReducer,
  expenses: expensesReducer,
  subject_grades: subjectGradesReducer,
  subject_assignment: subjectAssignmentReducer,
  subject_quiz: subjectQuizReducer,

});

const studentReducer = combineReducers({
  studentDashboard: studentDashboardReducer,
  studentFinance: studentFinanceReducer,
  studentLibraryBooks: studentLibraryBooksReducer,
  studentIssueBooks: studentIssueBooksReducer,
  studentAnnouncement: studentAnnouncementReducer,
  studentEvent: studentEventReducer,
  studentClass: studentClassReducer,
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
  studentAssignment: studentAssignmentReducer,
});

const ParentReducer = combineReducers({
  dashboard: dashboardReducer,
  finance: financeReducer,
  children: childrenReducer,
  notice: noticeReducer,
  library: libraryReducer,
  events: eventReducer,
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
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check due to redux-persist
    }), // Thunk is automatically included by Redux Toolkit
});

const persistor = persistStore(store);

export { store, persistor };
