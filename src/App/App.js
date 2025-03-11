import React, { Suspense, lazy, useEffect, useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Error from "../Components/Common/Error.js";
import Offline from "../Components/Common/Offline.js";
import Home from "../Modules/HomePage/Home";
import ParentLogin from "../Modules/LoginPages/Parent/ParentLogin";
import StudentLogin from "../Modules/LoginPages/Student/Login/StudentLogin.js";
import StudentSignUp from "../Modules/LoginPages/Student/SignUp/StudentSignUp.js";
import ResetPassword from "../Modules/LoginPages/Student/ResetPassword/ResetPassword.js";
import Fallback from "../Components/Common/Fallback.js";
import ProtectRoute from "../Routes/ProtectedRoutes/ProtectedRoute";
import { useFirebaseMessaging } from "../Hooks/NotificationHooks/NotificationHooks.js";
import SingleStudent from "../Modules/Admin/UsersProfiles/StudentProfile/MainSection.js/SingleStudent.js";
import AllTeachers from "../Modules/Admin/UsersProfiles/TeacherProfile/AllTeachers.js";
import AllLibrarian from "../Modules/Admin/UsersProfiles/LibrarianProfile/AllLibrarian.js";
import AllStaff from "../Modules/Admin/UsersProfiles/StaffProfile/AllStaff.js";
import AllAccountants from "../Modules/Admin/UsersProfiles/AccountantProfile/AllAccountants.js";
import StudentParentProfile from "../Modules/Admin/UsersProfiles/StudentParentsProfile/StudentParentProfile.js";
import UserProfile from "../Modules/Admin/UsersProfiles/AdminProfile/UserProfile.js";
import "./App.css";
import StaffLogin from "../Modules/LoginPages/Staff/StaffLogin.js";
import ForgetPassword from "../Modules/LoginPages/Student/Login/ForgetPassword/ForgetPassword.js";
import ParentEvent from "../Modules/Parents/ParentEvent/ParentEvent";
import QIDLogin from "../Modules/LoginPages/Student/Login/QIDLogin.js";
import ParentProfile from "../Components/Parents/ParentProfile.js";
import StaffMyProfile from "../Components/Common/StaffMyProfile.js";
import "../Utils/translator/i18n.js";
import GraduationPage from "../Modules/Admin/Graduation/GraduationPage.js";
import PrivacyPolicy from "../Modules/LoginPages/Policys/PrivacyPolicy.jsx";
import TermsAndConditions from "../Modules/LoginPages/Policys/TermsAndConditions.jsx";
import CookiePolicy from "../Modules/LoginPages/Policys/CookiePolicy.jsx";

// new Timetable
import TimeTableDash from "../Modules/Admin/TimeTables/Timetable.js";

// Timetable
// Admin
import TimeTablePage from "../Modules/Admin/TimeTable/TimeTablePage.js";
import TableView from "../Modules/Admin/TimeTable/Components/TableView.js";
import CreateTimeTable from "../Modules/Admin/TimeTable/Components/CreateTimeTable.js";
import UpdateTimeTable from "../Modules/Admin/TimeTable/Components/UpdateTimeTable.js";

// Student
import StudentTimeTablePage from "../Modules/Student/TimeTable/TimeTablePage.js";
import StudentTableView from "../Modules/Student/TimeTable/Components/TableView.js";

// Teacher
import TeacherTimeTablePage from "../Components/Staff/Teacher/TimeTable/TimeTablePage.js";
import TeacherTableView from "../Components/Staff/Teacher/TimeTable/Components/TableView.js";

// Parent
import ParentTimeTablePage from "../Modules/Parents/TimeTable/TimeTablePage.js";
import ParentTableView from "../Modules/Parents/TimeTable/Components/TableView.js";
import ManageRolePage from "../Components/Common/RBAC/ManageRolePage.js";
import TotalRevenueList from "../Modules/Admin/Finance/Earnings/TotalRevenueList.js";
import StudentFeesDash from "../Modules/Admin/Finance/StudentFees/StudentFeesDash.js";
import addStudentFeesForm from "../Modules/Admin/Finance/StudentFees/AddStudentFeesForm.js";
import SummaryRevenueList from "../Modules/Admin/Finance/StudentFees/SummaryRevenueList.js";
import AddNewFees from "../Modules/Admin/Finance/StudentFees/AddNewFees/AddNewFees.js";
import InvoicesMain from "../Modules/Admin/Finance/Invoices/InvoicesMain.js";
import RecentInvoiceList from "../Modules/Admin/Finance/Invoices/RecentInvoiceList.js";
//import ReturnInvoiceList from "../Modules/Admin/Finance/Invoices/ReturnInvoiceList.js";
import EarningMainSection from "../Modules/Admin/Finance/Earnings/EarningMainSection.js";
import ReceiptsMain from "../Modules/Admin/Finance/Reciepts/ReceiptsMain.js";
import RecentReceiptsList from "../Modules/Admin/Finance/Reciepts/RecentReceiptsList.js";
import QuotationMain from "../Modules/Admin/Finance/Quotations/QuotationMain.js";
import RecentQuotationList from "../Modules/Admin/Finance/Quotations/RecentQuotationList.js";
import AddReturnInvoice from "../Modules/Admin/Finance/Invoices/AddInvoice/AddReturnInvoice.js";
import CreateNewInvoice from "../Modules/Admin/Finance/Invoices/AddInvoice/CreateNewInvoice.js";
import CreateReceipt from "../Modules/Admin/Finance/Reciepts/AddReceipt/CreateReceipt.js";
import CreateQuotation from "../Modules/Admin/Finance/Quotations/AddQuotation/CreateQuotation.js";
import CreatePenaltyAdjustment from "../Modules/Admin/Finance/PenaltiesandAdjustments/AddPenaltyAdjustment/CreatePenaltyAdjustment.js";
// lazy loaded routes
const AllStudents = lazy(() =>
  import(
    "../Modules/Admin/UsersProfiles/StudentProfile/MainSection.js/AllStudents.js"
  )
);
const AdjustmentDashboard = lazy(() =>
  import(
    "../Modules/Admin/Finance/PenaltiesandAdjustments/AddPenaltyAdjustment/Dashboard/AdjustmentDashboard.js"
  )
);
const PenalityandAdjustmentList = lazy(() =>
  import(
    "../Modules/Admin/Finance/PenaltiesandAdjustments/AddPenaltyAdjustment/Dashboard/PenalityandAdjustmentList.js"
  )
);

const TotalExpenseList = lazy(() =>
  import(
    "../Modules/Admin/Finance/Expense/TotalExpenseList/TotalExpenseList.js"
  )
);
const ExpenseMain = lazy(() =>
  import("../Modules/Admin/Finance/Expense/ExpenseMain.js")
);
const AddExpense = lazy(() =>
  import("../Modules/Admin/Finance/Expense/AddExpense/AddExpense.js")
);
const AddEarnings = lazy(() =>
  import("../Modules/Admin/Finance/Earnings/AddEarnings/AddEarnings.js")
);
const RoleSelector = lazy(() =>
  import("../Components/Common/RBAC/RoleSelector.js")
);
const Academic = lazy(() =>
  import("../Modules/Admin/AcademicYear/Academic.js")
);

const SelectBranch = lazy(() =>
  import("../Modules/LoginPages/Staff/Admin/SelectBranch.js")
);
const Branch = lazy(() => import("../Modules/Admin/Branchs/Branch.js"));
const commonAcademic = lazy(() =>
  import("../Components/Common/AcademicYear/Academic.js")
);

const CreateAcademicYear = lazy(() =>
  import("../Components/Admin/CreateAcademicYear.js")
);

const StudentProfile = lazy(() =>
  import("../Modules/Student/profile/StudentProfile.js")
);
const SpeedGrade = lazy(() =>
  import("../Modules/Admin/Subjects/Modules/SpeedGrade/SpeedGrade.js")
);
const StudentFinance = lazy(() =>
  import("../Modules/Student/Finance/StudentFinance.js")
);
const StudentEvent = lazy(() =>
  import("../Modules/Student/NoticeBoard/Events/StudentEvent.js")
);
const StudentAnnounce = lazy(() =>
  import("../Modules/Student/NoticeBoard/Notice/StudentAnnounce.js")
);
const StudentLibrarySection = lazy(() =>
  import("../Modules/Student/Library/MainSection/Libary.js")
);
const ViewPage = lazy(() =>
  import("../Modules/Admin/Subjects/Modules/Pages/ViewPage/ViewPage.js")
);
const AddPage = lazy(() =>
  import("../Modules/Admin/Subjects/Modules/Pages/AddPage/AddPage.js")
);
const Page = lazy(() =>
  import("../Modules/Admin/Subjects/Modules/Pages/Page.js")
);
const Grade = lazy(() =>
  import("../Modules/Admin/Subjects/Modules/Grades/Grade.js")
);
const CreateAnnouncement = lazy(() =>
  import(
    "../Modules/Admin/Subjects/Modules/Announcement/CreateAnnouncement/CreateAnnouncement.js"
  )
);
const AnnouncementView = lazy(() =>
  import(
    "../Modules/Admin/Subjects/Modules/Announcement/AnnouncementView/AnnouncementView.js"
  )
);
const Announcement = lazy(() =>
  import("../Modules/Admin/Subjects/Modules/Announcement/Announcement.js")
);
const CreateSyllabus = lazy(() =>
  import(
    "../Modules/Admin/Subjects/Modules/Syllabus/CreateSyllabus/CreateSyllabus.js"
  )
);
const AccountingSection = lazy(() =>
  import("../Modules/Admin/Accounting/MainSection/AccountingSection.js")
);
const Syllabus = lazy(() =>
  import("../Modules/Admin/Subjects/Modules/Syllabus/SyllabusView/Syllabus.js")
);
const DiscussionView = lazy(() =>
  import(
    "../Modules/Admin/Subjects/Modules/Discussion/DiscussionView/DiscussionView.js"
  )
);
const Libary = lazy(() =>
  import("../Modules/Admin/Libary/MainSection/Libary.js")
);
const Events = lazy(() =>
  import("../Modules/Admin/Dashboard/EventModule/Event.js")
);
const EventSchool = lazy(() =>
  import("../Modules/Admin/NoticeBoard/Events/MainSection/EventSchool.js")
);
const AdminNotice = lazy(() =>
  import("../Modules/Admin/NoticeBoard/Notice/AdminNotice.js")
);
const Earning = lazy(() =>
  import("../Modules/Admin/Accounting/Earnings/Earning.js")
);
const Expenses = lazy(() =>
  import("../Modules/Admin/Accounting/Expenses/Expenses.js")
);
const AssignmentList = lazy(() =>
  import(
    "../Modules/Admin/Subjects/Modules/Assignments/AllAssignments/AssignmentList.js"
  )
);
const AddDiscussion = lazy(() =>
  import(
    "../Modules/Admin/Subjects/Modules/Discussion/AddDiscussion/AddDiscussion.js"
  )
);
const TakeAttendance = lazy(() =>
  import("../Modules/Admin/Attendance/TakeAttendance/TakeAttendance.js")
);
const Discussion = lazy(() =>
  import("../Modules/Admin/Subjects/Modules/Discussion/Discussion.js")
);
const QuizzList = lazy(() =>
  import("../Modules/Admin/Subjects/Modules/Quizzes/QuizzList/QuizzList.js")
);
const CreateQuizzes = lazy(() =>
  import(
    "../Modules/Admin/Subjects/Modules/Quizzes/CreateQuizzes/CreateQuizzes.js"
  )
);
const Quizzes = lazy(() =>
  import("../Modules/Admin/Subjects/Modules/Quizzes/Quizzes.js")
);
const CreateAssignment = lazy(() =>
  import(
    "../Modules/Admin/Subjects/Modules/Assignments/CreateAssignment/CreateAssignment.js"
  )
);
const Group_Section = lazy(() =>
  import("../Modules/Admin/Groups&Sections/Group_Section.js")
);
const Rubric = lazy(() =>
  import("../Modules/Admin/Subjects/Modules/Rubric/Rubric.js")
);
const Assignment = lazy(() =>
  import("../Modules/Admin/Subjects/Modules/Assignments/Assignment.js")
);
const Module = lazy(() =>
  import("../Modules/Admin/Subjects/Modules/Module/Module.js")
);
const StudentModule = lazy(() =>
  import("../Modules/Student/StudentClass/Subjects/Modules/Module/Module.js")
);
const StudentAssignmentList = lazy(() =>
  import(
    "../Modules/Student/StudentClass/Subjects/Modules/Assignments/AllAssignments/AssignmentList.js"
  )
);
const StudentAssignmentView = lazy(() =>
  import(
    "../Modules/Student/StudentClass/Subjects/Modules/Assignments/Assignment.js"
  )
);
const StudentQuizzList = lazy(() =>
  import(
    "../Modules/Student/StudentClass/Subjects/Modules/Quizzes/QuizzList/QuizzList.js"
  )
);
const StudentQuizzesView = lazy(() =>
  import("../Modules/Student/StudentClass/Subjects/Modules/Quizzes/Quizzes.js")
);
const StudentDiscussion = lazy(() =>
  import(
    "../Modules/Student/StudentClass/Subjects/Modules/Discussion/Discussion.js"
  )
);
const StudentDiscussionView = lazy(() =>
  import(
    "../Modules/Student/StudentClass/Subjects/Modules/Discussion/DiscussionView/DiscussionView.js"
  )
);
const StudentAnnouncementView = lazy(() =>
  import(
    "../Modules/Student/StudentClass/Subjects/Modules/Announcement/AnnouncementView/AnnouncementView.js"
  )
);
const StudentAnnouncement = lazy(() =>
  import(
    "../Modules/Student/StudentClass/Subjects/Modules/Announcement/Announcement.js"
  )
);
const StudentGrade = lazy(() =>
  import("../Modules/Student/StudentClass/Subjects/Modules/Grades/Grade.js")
);
const StudentSyllabus = lazy(() =>
  import(
    "../Modules/Student/StudentClass/Subjects/Modules/Syllabus/SyllabusView/Syllabus.js"
  )
);
const StudentPage = lazy(() =>
  import("../Modules/Student/StudentClass/Subjects/Modules/Pages/Page.js")
);
const StudentPageView = lazy(() =>
  import(
    "../Modules/Student/StudentClass/Subjects/Modules/Pages/PageView/PageView.js"
  )
);
const StudentRubric = lazy(() =>
  import("../Modules/Student/StudentClass/Subjects/Modules/Rubrics/Rubrics.js")
);
const Attendance = lazy(() =>
  import("../Modules/Admin/Attendance/Attendance.js")
);
const Students = lazy(() => import("../Modules/Admin/Students/Students.js"));
const Addmission = lazy(() =>
  import("../Modules/Admin/Addmission/Addmission.js")
);
const Classes = lazy(() => import("../Modules/Admin/Classes/Classes.js"));
const Class = lazy(() => import("../Modules/Admin/Classes/SubClass/Class.js"));
const StudentClass = lazy(() =>
  import("../Modules/Student/StudentClass/SubClass/StudentClass.js")
);
const Teachers = lazy(() => import("../Modules/Admin/Teachers/Teacher.js"));
const UnVerifiedStudentDetails = lazy(() =>
  import(
    "../Modules/Admin/Verification/SubStudentVerification/UnVerifiedStudentDetails.js"
  )
);
const VerificationPage = lazy(() =>
  import("../Modules/Admin/Verification/VerificationPage.js")
);
const StudentDash = lazy(() =>
  import("../Modules/Student/Dashboard/StudentDash.js")
);
const ParentDash = lazy(() =>
  import("../Modules/Parents/Dashboard/ParentDash.js")
);

const MyChildren = lazy(() =>
  import("../Modules/Parents/Childrens/ChildScreen.js")
);
const MyTeacher = lazy(() =>
  import("../Modules/Parents/Teachers/TeacherScreen.js")
);
const Calendar = lazy(() =>
  import("../Modules/Parents/Attendance/ChildrenAttendence.js")
);
const ParentStudentNotice = lazy(() =>
  import("../Modules/Parents/Notice/Annoucements/AllNotice.js")
);
const LibraryParent = lazy(() =>
  import("../Modules/Parents/Libary/LibraryDash.js")
);
const ParentFinance = lazy(() => import("../Modules/Parents/ParentFinance.js"));
const CheckProgress = lazy(() =>
  import("../Modules/Parents/Grades/CheckProgress.js")
);
const ChildGrade = lazy(() =>
  import("../Modules/Parents/GradeChild/GradeChild.js")
);

const StudentTeacher = lazy(() =>
  import(
    "../Modules/Student/StudentClass/SubClass/Components/Teacher/StudentTeacher.js"
  )
);
const StudentClassMates = lazy(() =>
  import(
    "../Modules/Student/StudentClass/SubClass/Components/ClassMates/StudentClassMates.js"
  )
);
const StudentAttendance = lazy(() =>
  import(
    "../Modules/Student/StudentClass/SubClass/Components/Attendance/AttendanceMain.js"
  )
);
const Dash = lazy(() => import("../Modules/Admin/Dashboard/Dash.js"));

const OfflineExamList = lazy(() =>
  import("../Modules/Admin/Subjects/Modules/OfflineExam/OfflineExamList.js")
);

const OfflineExamViewList = lazy(() =>
  import("../Modules/Admin/Subjects/Modules/OfflineExam/OfflineExamViewList.js")
);
function App() {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  useFirebaseMessaging();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const AppRouter = createBrowserRouter([
    // common-------------------------------------------------------------------------------------
    { path: "/", element: <Home />, errorElement: <Error /> },
    {
      path: "/dashboard/select/academic",
      element: (
        <ProtectRoute
          Component={commonAcademic}
          allowedRoles={[
            "admin",
            "parent",
            "student",
            "teacher",
            "finance",
            "librarian",
            "staff",
          ]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/studentlogin",
      element: <StudentLogin />,
      errorElement: <Error />,
    },
    { path: "/parentlogin", element: <ParentLogin />, errorElement: <Error /> },
    { path: "/stafflogin", element: <StaffLogin />, errorElement: <Error /> },
    { path: "/signup", element: <StudentSignUp />, errorElement: <Error /> },
    { path: "/verify_qid", element: <QIDLogin />, errorElement: <Error /> },
    {
      path: "/privacy-policy",
      element: <PrivacyPolicy />,
      errorElement: <Error />,
    },
    {
      path: "/terms-and-conditions",
      element: <TermsAndConditions />,
      errorElement: <Error />,
    },
    {
      path: "/cookie-policy",
      element: <CookiePolicy />,
      errorElement: <Error />,
    },

    {
      path: "/reset_password/:token",
      element: <ResetPassword />,
      errorElement: <Error />,
    },
    {
      path: "/forget_password",
      element: <ForgetPassword />,
      errorElement: <Error />,
    },
    {
      path: "/create_academicYear",
      element: (
        <ProtectRoute Component={CreateAcademicYear} allowedRoles={["admin"]} />
      ),
      errorElement: <Error />,
    },

    {
      path: "/select_branch",
      element: (
        <ProtectRoute Component={SelectBranch} allowedRoles={["admin"]} />
      ),
      errorElement: <Error />,
    },
    {
      path: "/select_role",
      element: (
        <ProtectRoute
          Component={RoleSelector}
          allowedRoles={[
            "admin",
            //"parent",
            //"student",
            "teacher",
            "finance",
            "librarian",
            "staff",
          ]}
        />
      ),
      errorElement: <Error />,
    },

    {
      path: "/dashboard/academic",
      element: (
        <ProtectRoute
          Component={Academic}
          allowedRoles={["admin", "teacher", "librarian", "finance", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/dashboard/all/branch",
      element: <ProtectRoute Component={Branch} allowedRoles={["admin"]} />,
      errorElement: <Error />,
    },

    //Admin--------------------------------------------------------------------------
    {
      path: "/dashboard",
      element: (
        <ProtectRoute
          Component={Dash}
          allowedRoles={["admin", "teacher", "librarian", "finance", "staff"]}
        />
      ),
      errorElement: <Error />,
    },

    {
      path: "/class",
      element: (
        <ProtectRoute
          Component={Classes}
          allowedRoles={["admin", "teacher", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid",
      element: (
        <ProtectRoute
          Component={Class}
          allowedRoles={["admin", "teacher", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/verify_students",
      element: (
        <ProtectRoute
          Component={VerificationPage}
          allowedRoles={["admin", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/verify_students/:sid",
      element: (
        <ProtectRoute
          Component={UnVerifiedStudentDetails}
          allowedRoles={["admin", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/admissions",
      element: (
        <ProtectRoute
          Component={Addmission}
          allowedRoles={["admin", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/teachers",
      element: (
        <ProtectRoute
          Component={Teachers}
          allowedRoles={["admin", "teacher", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/section_group",
      element: (
        <ProtectRoute
          Component={Group_Section}
          allowedRoles={["admin", "teacher", "staff"]}
        />
      ),
      errorElement: <Error />,
    },

    {
      path: "/class/:cid/students",
      element: (
        <ProtectRoute
          Component={Students}
          allowedRoles={["admin", "teacher", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/attendance",
      element: (
        <ProtectRoute
          Component={Attendance}
          allowedRoles={["admin", "teacher", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/take_attendance",
      element: (
        <ProtectRoute
          Component={TakeAttendance}
          allowedRoles={["admin", "teacher", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/module",
      element: (
        <ProtectRoute
          Component={Module}
          allowedRoles={["admin", "teacher", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/assignment",
      element: (
        <ProtectRoute
          Component={AssignmentList}
          allowedRoles={["admin", "teacher", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/assignment/:aid/view",
      element: (
        <ProtectRoute
          Component={Assignment}
          allowedRoles={["admin", "teacher", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/createassignment",
      element: (
        <ProtectRoute
          Component={CreateAssignment}
          allowedRoles={["admin", "teacher", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/rubric",
      element: (
        <ProtectRoute
          Component={Rubric}
          allowedRoles={["admin", "teacher", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/quiz",
      element: (
        <ProtectRoute
          Component={QuizzList}
          allowedRoles={["admin", "teacher", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/quiz/:qid/view",
      element: (
        <ProtectRoute
          Component={Quizzes}
          allowedRoles={["admin", "teacher", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/create_quiz",
      element: (
        <ProtectRoute
          Component={CreateQuizzes}
          allowedRoles={["admin", "teacher", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/offline_exam",
      element: (
        <ProtectRoute
          Component={OfflineExamList}
          allowedRoles={["admin", "teacher", "student", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/offline_exam/view",
      element: (
        <ProtectRoute
          Component={OfflineExamViewList}
          allowedRoles={["admin", "teacher", "student", "staff"]}
        />
      ),
      errorElement: <Error />,
    },

    {
      path: "/class/:cid/:sid/discussions",
      element: (
        <ProtectRoute
          Component={Discussion}
          allowedRoles={["admin", "teacher", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/create_discussion",
      element: (
        <ProtectRoute
          Component={AddDiscussion}
          allowedRoles={["admin", "teacher", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/discussions/:did/view",
      element: (
        <ProtectRoute
          Component={DiscussionView}
          allowedRoles={["admin", "teacher", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/syllabus",
      element: (
        <ProtectRoute
          Component={Syllabus}
          allowedRoles={["admin", "teacher", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/syllabus/create_syllabus",
      element: (
        <ProtectRoute
          Component={CreateSyllabus}
          allowedRoles={["admin", "teacher", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/announcements",
      element: (
        <ProtectRoute
          Component={Announcement}
          allowedRoles={["admin", "teacher", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/announcements/:aid/view",
      element: (
        <ProtectRoute
          Component={AnnouncementView}
          allowedRoles={["admin", "teacher", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/announcements/create_announcement",
      element: (
        <ProtectRoute
          Component={CreateAnnouncement}
          allowedRoles={["admin", "teacher", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/grades",
      element: (
        <ProtectRoute
          Component={Grade}
          allowedRoles={["admin", "teacher", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/speedgrade/:type/:sgid",
      element: (
        <ProtectRoute
          Component={SpeedGrade}
          allowedRoles={["admin", "teacher", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/page",
      element: (
        <ProtectRoute
          Component={Page}
          allowedRoles={["admin", "teacher", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/page/create_page",
      element: (
        <ProtectRoute
          Component={AddPage}
          allowedRoles={["admin", "teacher", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/page/:pid/view",
      element: (
        <ProtectRoute
          Component={ViewPage}
          allowedRoles={["admin", "teacher", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/accounting/studentfees",
      element: (
        <ProtectRoute
          Component={AccountingSection}
          allowedRoles={["admin", "finance"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/library",
      element: (
        <ProtectRoute
          Component={Libary}
          allowedRoles={[
            "admin",
            "teacher",
            "student",
            "parent",
            "librarian",
            "staff",
          ]}
        />
      ),
    },
    {
      path: "/timetable",
      element: (
        <ProtectRoute
          // Component={TimeTablePage}
          Component={TimeTableDash}
          allowedRoles={["admin", "teacher", "student", "parent", "staff"]}
        />
      ),
      errorElement: <Error />,
      children: [
        {
          path: "viewtable/:tablename",
          element: (
            <ProtectRoute
              Component={TableView}
              allowedRoles={["admin", "teacher", "student", "parent", "staff"]}
            />
          ),
          errorElement: <Error />,
        },
        {
          path: "edit/:id", // New child route
          element: (
            <ProtectRoute
              Component={UpdateTimeTable}
              allowedRoles={["admin", "teacher", "staff"]}
            />
          ),
          errorElement: <Error />,
        },
      ],
    },

    {
      path: "/timetable/create-new-timeTable",
      element: (
        <ProtectRoute
          Component={CreateTimeTable}
          allowedRoles={["admin", "teacher", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/noticeboard/events",
      element: (
        <ProtectRoute
          Component={EventSchool}
          allowedRoles={[
            "admin",
            "teacher",
            "librarian",
            "peon",
            "finance",
            "staff",
          ]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/noticeboard/notice",
      element: (
        <ProtectRoute
          Component={AdminNotice}
          allowedRoles={[
            "admin",
            "teacher",
            "librarian",
            "peon",
            "finance",
            "staff",
          ]}
        />
      ),
      errorElement: <Error />,
    },

    {
      path: "/finance/earning",
      element: (
        <ProtectRoute
          Component={EarningMainSection}
          allowedRoles={["admin", "finance"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/finance/earning/total-revenue-list",
      element: (
        <ProtectRoute
          Component={TotalRevenueList}
          allowedRoles={["admin", "finance"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/finance/expenses",
      element: (
        <ProtectRoute
          Component={ExpenseMain}
          allowedRoles={["admin", "finance"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/finance/expenses/total-expense-list",
      element: (
        <ProtectRoute
          Component={TotalExpenseList}
          allowedRoles={["admin", "finance"]}
        />
      ),
      errorElement: <Error />,
    },

    {
      path: "/finance/studentfees/add/form",
      element: (
        <ProtectRoute
          Component={addStudentFeesForm}
          allowedRoles={["admin", "finance"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/finance/studentfees",
      element: (
        <ProtectRoute
          Component={StudentFeesDash}
          allowedRoles={["admin", "finance"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/finance/earning/add",
      element: (
        <ProtectRoute
          Component={AddEarnings}
          allowedRoles={["admin", "finance"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/finance/expenses/add",
      element: (
        <ProtectRoute
          Component={AddExpense}
          allowedRoles={["admin", "finance"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/finance/studentfees/total-revenue",
      element: (
        <ProtectRoute
          Component={SummaryRevenueList}
          allowedRoles={["admin", "finance"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/finance/studentfees/total-revenue/addFees",
      element: (
        <ProtectRoute
          Component={AddNewFees}
          allowedRoles={["admin", "finance"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/finance/invoices/dashboard",
      element: (
        <ProtectRoute
          Component={InvoicesMain}
          allowedRoles={["admin", "finance"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/finance/invoices/add-new-invoice",
      element: (
        <ProtectRoute
          Component={CreateNewInvoice}
          allowedRoles={["admin", "finance"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/finance/invoices/add-return-invoice",
      element: (
        <ProtectRoute
          Component={AddReturnInvoice}
          allowedRoles={["admin", "finance"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/finance/invoices/dashboard/recent-invoices",
      element: (
        <ProtectRoute
          Component={RecentInvoiceList}
          allowedRoles={["admin", "finance"]}
        />
      ),
      errorElement: <Error />,
    },

    {
      path: "/finance/receipts",
      element: (
        <ProtectRoute
          Component={ReceiptsMain}
          allowedRoles={["admin", "finance"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/finance/receipts/receipt-list",
      element: (
        <ProtectRoute
          Component={RecentReceiptsList}
          allowedRoles={["admin", "finance"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/finance/receipts/add-new-receipt",
      element: (
        <ProtectRoute
          Component={CreateReceipt}
          allowedRoles={["admin", "finance"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/finance/quotations",
      element: (
        <ProtectRoute
          Component={QuotationMain}
          allowedRoles={["admin", "finance"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/finance/quotations/add-new-quotations",
      element: (
        <ProtectRoute
          Component={CreateQuotation}
          allowedRoles={["admin", "finance"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/finance/quotations/quotations-list",
      element: (
        <ProtectRoute
          Component={RecentQuotationList}
          allowedRoles={["admin", "finance"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/finance/penaltyAdjustment/",
      element: (
        <ProtectRoute
          Component={AdjustmentDashboard}
          allowedRoles={["admin", "finance"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/finance/penaltyAdjustment-list",
      element: (
        <ProtectRoute
          Component={PenalityandAdjustmentList}
          allowedRoles={["admin", "finance"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/finance/penaltyAdjustment/add-new-penalty-adjustment",
      element: (
        <ProtectRoute
          Component={CreatePenaltyAdjustment}
          allowedRoles={["admin", "finance"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/users/students",
      element: (
        <ProtectRoute
          Component={AllStudents}
          allowedRoles={["admin", "teacher", "finance", "librarian", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/users/manage-roles",
      element: (
        <ProtectRoute
          Component={ManageRolePage}
          allowedRoles={["admin", "teacher", "finance", "librarian", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/users/students/:cid",
      element: <SingleStudent />,
      errorElement: <Error />,
    },
    {
      path: "/users/teachers",
      element: <AllTeachers />,
      errorElement: <Error />,
    },
    {
      path: "/users/accountants",
      element: <AllAccountants />,
      errorElement: <Error />,
    },
    {
      path: "/graduates",
      element: (
        <ProtectRoute
          Component={GraduationPage}
          allowedRoles={["admin", "staff"]}
        />
      ),
      errorElement: <Error />,
    },

    {
      path: "/users/parents",
      element: (
        <ProtectRoute
          Component={StudentParentProfile}
          allowedRoles={["admin", "teacher", "finance", "librarian", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/users/Librarian",
      element: <AllLibrarian />,
      errorElement: <Error />,
    },
    { path: "/users/staffs", element: <AllStaff />, errorElement: <Error /> },
    { path: "/users/admin", element: <UserProfile />, errorElement: <Error /> },
    {
      path: "/users/my/profile",
      element: (
        <ProtectRoute
          Component={StaffMyProfile}
          allowedRoles={["teacher", "finance", "librarian", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    // Student------------------------------------------------------------------------------
    {
      path: "/student_dash",
      element: (
        <ProtectRoute Component={StudentDash} allowedRoles={["student"]} />
      ),
      errorElement: <Error />,
    },
    //-- Student Class -------------
    {
      path: "/student_class",
      element: (
        <ProtectRoute Component={StudentClass} allowedRoles={["student"]} />
      ),
      errorElement: <Error />,
    },
    {
      path: "/student_class/:classId/teachers",
      element: (
        <ProtectRoute Component={StudentTeacher} allowedRoles={["student"]} />
      ),
      errorElement: <Error />,
    },
    {
      path: "/student_class/:classId/classmates",
      element: (
        <ProtectRoute
          Component={StudentClassMates}
          allowedRoles={["student"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/student_class/:classId/attendance",
      element: (
        <ProtectRoute
          Component={StudentAttendance}
          allowedRoles={["student"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/student_class/:cid/:sid/module",
      element: (
        <ProtectRoute Component={StudentModule} allowedRoles={["student"]} />
      ),
      errorElement: <Error />,
    },
    {
      path: "/student_class/:cid/:sid/assignments",
      element: (
        <ProtectRoute
          Component={StudentAssignmentList}
          allowedRoles={["student"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/student_class/:cid/:sid/assignments/:aid/view",
      element: (
        <ProtectRoute
          Component={StudentAssignmentView}
          allowedRoles={["student"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/student_class/class/:cid/classmates",
      element: (
        <ProtectRoute
          Component={StudentClassMates}
          allowedRoles={["student"]}
        />
      ),
      errorElement: <Error />,
    },

    {
      path: "/student_class/class/:cid/attendance",
      element: (
        <ProtectRoute
          Component={StudentAttendance}
          allowedRoles={["student"]}
        />
      ),
      errorElement: <Error />,
    },

    {
      path: "/student_timetable",
      element: (
        <ProtectRoute
          Component={StudentTimeTablePage}
          allowedRoles={["student"]}
        />
      ),
      errorElement: <Error />,
      children: [
        {
          path: "viewtable/:tablename", // Notice it’s a child path, not a full path
          element: (
            <ProtectRoute
              Component={StudentTableView}
              allowedRoles={["student"]}
            />
          ),
          errorElement: <Error />,
        },
      ],
    },

    //{ path: "/student_class/:sid/createassignment", element: <ProtectRoute Component={StudentCreateAssignment} allowedRoles={["student"]} />, errorElement: <Error /> },
    {
      path: "/student_class/:cid/:sid/quizzes",
      element: (
        <ProtectRoute Component={StudentQuizzList} allowedRoles={["student"]} />
      ),
      errorElement: <Error />,
    },
    {
      path: "/student_class/:cid/:sid/quizzes/:qid/view",
      element: (
        <ProtectRoute
          Component={StudentQuizzesView}
          allowedRoles={["student"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/student_class/:cid/:sid/discussions",
      element: (
        <ProtectRoute
          Component={StudentDiscussion}
          allowedRoles={["student"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/student_class/:cid/:sid/discussions/:did/view",
      element: (
        <ProtectRoute
          Component={StudentDiscussionView}
          allowedRoles={["student"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/student_class/:cid/:sid/grades",
      element: (
        <ProtectRoute Component={StudentGrade} allowedRoles={["student"]} />
      ),
      errorElement: <Error />,
    },
    {
      path: "/student_class/:cid/:sid/announcements",
      element: (
        <ProtectRoute
          Component={StudentAnnouncement}
          allowedRoles={["student"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/student_class/:cid/:sid/announcements/:aid/view",
      element: (
        <ProtectRoute
          Component={StudentAnnouncementView}
          allowedRoles={["student"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/student_class/:cid/:sid/syllabus",
      element: (
        <ProtectRoute Component={StudentSyllabus} allowedRoles={["student"]} />
      ),
      errorElement: <Error />,
    },
    {
      path: "/student_class/:cid/:sid/page",
      element: (
        <ProtectRoute Component={StudentPage} allowedRoles={["student"]} />
      ),
      errorElement: <Error />,
    },
    {
      path: "/student_class/:cid/:sid/page/:pid/view",
      element: (
        <ProtectRoute Component={StudentPageView} allowedRoles={["student"]} />
      ),
      errorElement: <Error />,
    },
    {
      path: "/student_class/:cid/:sid/rubric",
      element: (
        <ProtectRoute Component={StudentRubric} allowedRoles={["student"]} />
      ),
      errorElement: <Error />,
    },

    //--------------------------------------------------------------------------------------------------
    {
      path: "/student_finance",
      element: (
        <ProtectRoute Component={StudentFinance} allowedRoles={["student"]} />
      ),
      errorElement: <Error />,
    },
    {
      path: "/student_dash/profile",
      element: (
        <ProtectRoute Component={StudentProfile} allowedRoles={["student"]} />
      ),
      errorElement: <Error />,
    },

    {
      path: "/student_library",
      element: (
        <ProtectRoute
          Component={StudentLibrarySection}
          allowedRoles={["student"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/student/noticeboard/announcements",
      element: (
        <ProtectRoute Component={StudentAnnounce} allowedRoles={["student"]} />
      ),
      errorElement: <Error />,
    },
    {
      path: "/student/noticeboard/events",
      element: (
        <ProtectRoute Component={StudentEvent} allowedRoles={["student"]} />
      ),
      errorElement: <Error />,
    },

    // teacher----------------------------------------------------------------

    {
      path: "/teacher_timetable",
      element: (
        <ProtectRoute
          Component={TeacherTimeTablePage}
          allowedRoles={["teacher"]}
        />
      ),
      errorElement: <Error />,
      children: [
        {
          path: "viewtable/:tablename", // Notice it’s a child path, not a full path
          element: (
            <ProtectRoute
              Component={TeacherTableView}
              allowedRoles={["teacher"]}
            />
          ),
          errorElement: <Error />,
        },
      ],
    },

    // parent----------------------------------------------------------------
    {
      path: "/parent_dash",
      element: (
        <ProtectRoute Component={ParentDash} allowedRoles={["parent"]} />
      ),
      errorElement: <Error />,
    },
    {
      path: "/children",
      element: (
        <ProtectRoute Component={MyChildren} allowedRoles={["parent"]} />
      ),
      errorElement: <Error />,
    },
    {
      path: "/teacher/:ssid",
      element: <ProtectRoute Component={MyTeacher} allowedRoles={["parent"]} />,
      errorElement: <Error />,
    },
    {
      path: "/attendance/:id",
      element: <ProtectRoute Component={Calendar} allowedRoles={["parent"]} />,
      errorElement: <Error />,
    },
    {
      path: "/parent_timetable",
      element: (
        <ProtectRoute
          Component={ParentTimeTablePage}
          allowedRoles={["parent"]}
        />
      ),
      errorElement: <Error />,
      children: [
        {
          path: "viewtable/:tablename",
          element: (
            <ProtectRoute
              Component={ParentTableView}
              allowedRoles={["parent"]}
            />
          ),
          errorElement: <Error />,
        },
      ],
    },
    {
      path: "/parentchildnotice",
      element: (
        <ProtectRoute
          Component={ParentStudentNotice}
          allowedRoles={["parent"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/parent/events",
      element: (
        <ProtectRoute Component={ParentEvent} allowedRoles={["parent"]} />
      ),
      errorElement: <Error />,
    },
    {
      path: "/parentlibrary",
      element: (
        <ProtectRoute Component={LibraryParent} allowedRoles={["parent"]} />
      ),
      errorElement: <Error />,
    },
    {
      path: "/parentfinance",
      element: (
        <ProtectRoute Component={ParentFinance} allowedRoles={["parent"]} />
      ),
      errorElement: <Error />,
    },
    {
      path: "/checkprogress/:studentId",
      element: (
        <ProtectRoute Component={CheckProgress} allowedRoles={["parent"]} />
      ),
      errorElement: <Error />,
    },
    {
      path: "/users/parent/profile",
      element: (
        <ProtectRoute Component={ParentProfile} allowedRoles={["parent"]} />
      ),
      errorElement: <Error />,
    },
    {
      path: "/childgrade/:studentId",
      element: (
        <ProtectRoute Component={ChildGrade} allowedRoles={["parent"]} />
      ),
      errorElement: <Error />,
    },
  ]);

  return (
    <>
      {!isOnline && <Offline />}
      <Suspense fallback={<Fallback />}>
        <RouterProvider router={AppRouter} />
      </Suspense>
    </>
  );
}

export default App;
