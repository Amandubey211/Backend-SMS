import React, { Suspense, lazy, useEffect, useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import "../Utils/translator/i18n.js";

// Common Components
import Error from "../Components/Common/Error.js";
import Offline from "../Components/Common/Offline.js";
import Fallback from "../Components/Common/Fallback.js";
import CustomCursor from "../Components/Common/CustomCursor.js";
import StaffMyProfile from "../Components/Common/StaffMyProfile.js";
import ProtectRoute from "../Routes/ProtectedRoutes/ProtectedRoute";
import { useFirebaseMessaging } from "../Hooks/NotificationHooks/NotificationHooks.js";

// Login Pages and Auth Related
import Home from "../Modules/HomePage/Home";
import ParentLogin from "../Modules/LoginPages/Parent/ParentLogin";
import StudentLogin from "../Modules/LoginPages/Student/Login/StudentLogin.js";
import StudentSignUp from "../Modules/LoginPages/Student/SignUp/StudentSignUp.js";
import ResetPassword from "../Modules/LoginPages/Student/ResetPassword/ResetPassword.js";
import StaffLogin from "../Modules/LoginPages/Staff/StaffLogin.js";
import ForgetPassword from "../Modules/LoginPages/Student/Login/ForgetPassword/ForgetPassword.js";
import QIDLogin from "../Modules/LoginPages/Student/Login/QIDLogin.js";

// Policy Pages
import PrivacyPolicy from "../Modules/LoginPages/Policys/PrivacyPolicy.jsx";
import TermsAndConditions from "../Modules/LoginPages/Policys/TermsAndConditions.jsx";
import CookiePolicy from "../Modules/LoginPages/Policys/CookiePolicy.jsx";

// Admin Profile Management
import SingleStudent from "../Modules/Admin/UsersProfiles/StudentProfile/MainSection.js/SingleStudent.js";
import AllTeachers from "../Modules/Admin/UsersProfiles/TeacherProfile/AllTeachers.js";
import AllLibrarian from "../Modules/Admin/UsersProfiles/LibrarianProfile/AllLibrarian.js";
import AllStaff from "../Modules/Admin/UsersProfiles/StaffProfile/AllStaff.js";
import AllAccountants from "../Modules/Admin/UsersProfiles/AccountantProfile/AllAccountants.js";
import StudentParentProfile from "../Modules/Admin/UsersProfiles/StudentParentsProfile/StudentParentProfile.js";
import UserProfile from "../Modules/Admin/UsersProfiles/AdminProfile/UserProfile.js";

// Parent Modules
import ParentEvent from "../Modules/Parents/ParentEvent/ParentEvent";
import ParentProfile from "../Components/Parents/ParentProfile.js";

// Timetable Modules
import TimeTableDash from "../Modules/Admin/TimeTables/Timetable.js";
import StudentParentTimeTablePage from "../Modules/Student/TimeTable/StudentParentTimetable.js";

// Finance Modules (Non-lazy)
import StudentFeesDash from "../Modules/Admin/Finance/StudentFees/StudentFeesDash.js";
import addStudentFeesForm from "../Modules/Admin/Finance/StudentFees/AddStudentFeesForm.js";
import SummaryRevenueList from "../Modules/Admin/Finance/StudentFees/SummaryRevenueList.js";
import ReceiptsMain from "../Modules/Admin/Finance/Reciepts/ReceiptsMain.js";
import RecentReceiptsList from "../Modules/Admin/Finance/Reciepts/RecentReceiptsList.js";
import QuotationMain from "../Modules/Admin/Finance/Quotations/QuotationMain.js";
import CreateReceipt from "../Modules/Admin/Finance/Reciepts/AddReceipt/CreateReceipt.js";
import CreateQuotation from "../Modules/Admin/Finance/Quotations/AddQuotation/CreateQuotation.js";
import InventoryList from "../Modules/Admin/Finance/Inventory/InventoryList.js";
import GraduationPage from "../Modules/Admin/Graduation/GraduationPage.js";

// RBAC (Role-Based Access Control)
import ManageRolePage from "../Components/Common/RBAC/ManageRolePage.js";
import AllHelper from "../Modules/Admin/UsersProfiles/HelperProfile/AllHelper.js";
import AllDriver from "../Modules/Admin/UsersProfiles/DriverProfile/AllDriver.js";
import TransportSimulator from "../Components/Common/TransportSimulator.js";

// =================================================================
// Lazy Loaded Components (Grouped by functionality)
// =================================================================

// 1. Finance Related Lazy Components
const AllStudents = lazy(() =>
  import(
    "../Modules/Admin/UsersProfiles/StudentProfile/MainSection.js/AllStudents.js"
  )
);
const RecentQuotationList = lazy(() =>
  import("../Modules/Admin/Finance/Quotations/RecentQuotationList.js")
);
const EntityRevenueDash = lazy(() =>
  import("../Modules/Admin/Finance/entityRevenue/EntityRevenueDash.js")
);
const AddEntityRevenue = lazy(() =>
  import("../Modules/Admin/Finance/entityRevenue/AddEntityRevenue.js")
);
const EntityRevenueList = lazy(() =>
  import("../Modules/Admin/Finance/entityRevenue/EntityRevenueList.js")
);
const BudgetPlannerDash = lazy(() =>
  import("../Modules/Admin/Finance/budget/BudgetDash.js")
);
const BudgetPlannerList = lazy(() =>
  import("../Modules/Admin/Finance/budget/BudgetList.js")
);
const BankReconciliationList = lazy(() =>
  import("../Modules/Admin/Finance/bankRecon/BankReconciliationList.js")
);
const BankReconciliationDash = lazy(() =>
  import("../Modules/Admin/Finance/bankRecon/BankReconciliation.js")
);
const StartReconciliation = lazy(() =>
  import("../Modules/Admin/Finance/bankRecon/StartReconciliation.js")
);
const DayBook = lazy(() =>
  import("../Modules/Admin/Finance/dayBook/DayBookMain.js")
);
const ConfigurationMain = lazy(() =>
  import("../Modules/Admin/Finance/Configuration/ConfigurationMain.js")
);
const PayRollDash = lazy(() =>
  import("../Modules/Admin/Finance/Payroll/PayRollDash.js")
);
const AddPayRollDash = lazy(() =>
  import("../Modules/Admin/Finance/Payroll/AddPayRoll.js")
);
const PayRollList = lazy(() =>
  import("../Modules/Admin/Finance/Payroll/PayrollList.js")
);
const OperationalExpensesDash = lazy(() =>
  import("../Modules/Admin/Finance/operational-expenses/ExpsenseDash.js")
);
const AddOperationalExpenses = lazy(() =>
  import("../Modules/Admin/Finance/operational-expenses/AddExpsense.js")
);
const ExpenseList = lazy(() =>
  import("../Modules/Admin/Finance/operational-expenses/ExpenseList.js")
);
const FinanceCategory = lazy(() =>
  import("../Modules/Admin/Finance/financeCategory/FinanceCategory.js")
);
const Inventory = lazy(() =>
  import("../Modules/Admin/Finance/Inventory/Inventory.js")
);
const LowInventory = lazy(() =>
  import("../Modules/Admin/Finance/Inventory/LowStockList.js")
);
const Entities = lazy(() =>
  import("../Modules/Admin/Finance/entities/Enities.js")
);

// 2. Transportation Related
const RouteAndBus = lazy(() =>
  import("../Modules/Admin/Transportation/RouteAndBus")
);
const RouteManagement = lazy(() =>
  import("../Modules/Admin/Transportation/RouteManagement.js")
);
const StudentStaffTransportation = lazy(() =>
  import("../Modules/Admin/Transportation/StudentStaffTransportation.js")
);
const DriverStaffTransportation = lazy(() =>
  import("../Modules/Admin/Transportation/DriverStaffTransportation.js")
);
const Maintenance = lazy(() =>
  import("../Modules/Admin/Transportation/Maintenance.js")
);
const RFID = lazy(() => import("../Modules/Admin/Transportation/RFID.js"));
const VehicleManagement = lazy(() =>
  import("../Modules/Admin/Transportation/VehicleManagement.js")
);
const ShiftManagement = lazy(() =>
  import("../Modules/Admin/Transportation/ShiftManagement.js")
);
const DriverVehicleAssignmentPage = lazy(() =>
  import("../Modules/Admin/Transportation/DriverVehicleAssignmentPage.js")
);
const Stoppage = lazy(() =>
  import("../Components/Transportation/StopageList.js")
);

const Scheduling = lazy(() =>
  import("../Modules/Admin/Transportation/Scheduling.js")
);

const ViewTripLogs = lazy(() =>
  import("../Modules/Admin/Transportation/ViewTripLogs.js")
);
const ViewTrip = lazy(() =>
  import(
    "../Modules/Admin/Transportation/RouteManagement/Components/ViewTrip/ViewTrip.js"
  )
);
// 3. Academic Management
const Academic = lazy(() =>
  import("../Modules/Admin/AcademicYear/Academic.js")
);
const FinancialYear = lazy(() =>
  import("../Modules/Admin/FinancialYear/FinanceYear.js")
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

// 4. Student Related
const StudentProfile = lazy(() =>
  import("../Modules/Student/profile/StudentProfile.js")
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
const StudentDash = lazy(() =>
  import("../Modules/Student/Dashboard/StudentDash.js")
);

// 5. Subject and Curriculum Management
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
const SpeedGrade = lazy(() =>
  import("../Modules/Admin/Subjects/Modules/SpeedGrade/SpeedGrade.js")
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
const Syllabus = lazy(() =>
  import("../Modules/Admin/Subjects/Modules/Syllabus/SyllabusView/Syllabus.js")
);
const SyllabusList = lazy(() =>
  import(
    "../Modules/Admin/Subjects/Modules/Syllabus/SyllabusList/SyllabusListPage.js"
  )
);
const DiscussionView = lazy(() =>
  import(
    "../Modules/Admin/Subjects/Modules/Discussion/DiscussionView/DiscussionView.js"
  )
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
const OfflineExamList = lazy(() =>
  import("../Modules/Admin/Subjects/Modules/OfflineExam/OfflineExamList.js")
);
const OfflineExamViewList = lazy(() =>
  import("../Modules/Admin/Subjects/Modules/OfflineExam/OfflineExamViewList.js")
);

// 6. Student Subject Modules
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

// 7. Attendance and Student Management
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

// 8. Parent Modules
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

// 9. Student Class Components
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

// 10. Admin Dashboard and Miscellaneous
const Dash = lazy(() => import("../Modules/Admin/Dashboard/Dash.js"));
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
const AccountingSection = lazy(() =>
  import("../Modules/Admin/Accounting/MainSection/AccountingSection.js")
);
const RoleSelector = lazy(() =>
  import("../Components/Common/RBAC/RoleSelector.js")
);
const ScoreCard = lazy(()=>
  import("../Modules/Admin/ScoreCard/ScoreCard.js")
)
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
      path: "/transport/sim",
      element: <TransportSimulator />,
      errorElement: <Error />,
    }, // sim

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
      path: "/financialYear",
      element: (
        <ProtectRoute Component={FinancialYear} allowedRoles={["admin"]} />
      ),
      errorElement: <Error />,
    },
    {
      path: "/finance/categories",
      element: (
        <ProtectRoute
          Component={FinanceCategory}
          allowedRoles={["admin", "finance"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/finance/Inventory",
      element: (
        <ProtectRoute
          Component={Inventory}
          allowedRoles={["admin", "finance"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/finance/lowStock/Inventory",
      element: (
        <ProtectRoute
          Component={LowInventory}
          allowedRoles={["admin", "finance"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/finance/Inventory/list",
      element: (
        <ProtectRoute
          Component={InventoryList}
          allowedRoles={["admin", "finance"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/finance/entities",
      element: (
        <ProtectRoute
          Component={Entities}
          allowedRoles={["admin", "finance"]}
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
      path: "/transportation/routes-and-buses",
      element: (
        <ProtectRoute
          Component={RouteAndBus}
          allowedRoles={["admin", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/transportation/vehicle-management",
      element: (
        <ProtectRoute
          Component={VehicleManagement}
          allowedRoles={["admin", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/transportation/driver-vehicle-assignment",
      element: (
        <ProtectRoute
          Component={DriverVehicleAssignmentPage}
          allowedRoles={["admin", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/transportation/route-management",
      element: (
        <ProtectRoute
          Component={RouteManagement}
          allowedRoles={["admin", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/transportation/shift-management",
      element: (
        <ProtectRoute
          Component={ShiftManagement}
          allowedRoles={["admin", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/transportation/schedule",
      element: (
        <ProtectRoute
          Component={Scheduling}
          allowedRoles={["admin", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/transportation/student-staff",
      element: (
        <ProtectRoute
          Component={StudentStaffTransportation}
          allowedRoles={["admin", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/transportation/driver-staff",
      element: (
        <ProtectRoute
          Component={DriverStaffTransportation}
          allowedRoles={["admin", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/transportation/maintenance",
      element: (
        <ProtectRoute
          Component={Maintenance}
          allowedRoles={["admin", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/transportation/rfid",
      element: (
        <ProtectRoute Component={RFID} allowedRoles={["admin", "staff"]} />
      ),
      errorElement: <Error />,
    },
    {
      path: "/transportation/route-management/routes/:id/stoppages",
      element: (
        <ProtectRoute Component={Stoppage} allowedRoles={["admin", "staff"]} />
      ),
      errorElement: <Error />,
    },
    {
      path: "/transportation/route-management/view-trip/:vehicleId/logs",
      element: (
        <ProtectRoute
          Component={ViewTripLogs}
          allowedRoles={["admin", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/transportation/route-management/trio/:tripId/view",
      element: (
        <ProtectRoute Component={ViewTrip} allowedRoles={["admin", "staff"]} />
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
          Component={SyllabusList}
          allowedRoles={["admin", "teacher", "staff"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/syllabus/view",
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
      path: "/finance/entity/add/revenue",
      element: (
        <ProtectRoute
          Component={AddEntityRevenue}
          allowedRoles={["admin", "finance"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/finance/budget-planner",
      element: (
        <ProtectRoute
          Component={BudgetPlannerDash}
          allowedRoles={["admin", "finance"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/finance/budget-planner/list",
      element: (
        <ProtectRoute
          Component={BudgetPlannerList}
          allowedRoles={["admin", "finance"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/finance/bank-reconciliation",
      element: (
        <ProtectRoute
          Component={BankReconciliationDash}
          allowedRoles={["admin", "finance"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/finance/bank-reconciliation/list",
      element: (
        <ProtectRoute
          Component={BankReconciliationList}
          allowedRoles={["admin", "finance"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/finance/start-reconciliation",
      element: (
        <ProtectRoute
          Component={StartReconciliation}
          allowedRoles={["admin", "finance"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/finance/day-book",
      element: (
        <ProtectRoute Component={DayBook} allowedRoles={["admin", "finance"]} />
      ),
      errorElement: <Error />,
    },
    {
      path: "/finance/configuration",
      element: (
        <ProtectRoute
          Component={ConfigurationMain}
          allowedRoles={["admin", "finance"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/finance/payroll",
      element: (
        <ProtectRoute
          Component={PayRollDash}
          allowedRoles={["admin", "finance"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/finance/add/payroll",
      element: (
        <ProtectRoute
          Component={AddPayRollDash}
          allowedRoles={["admin", "finance"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/finance/payroll/list",
      element: (
        <ProtectRoute
          Component={PayRollList}
          allowedRoles={["admin", "finance"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/finance/operational-expenses",
      element: (
        <ProtectRoute
          Component={OperationalExpensesDash}
          allowedRoles={["admin", "finance"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/finance/add/operational-expenses",
      element: (
        <ProtectRoute
          Component={AddOperationalExpenses}
          allowedRoles={["admin", "finance"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/finance/operational-expenses/list",
      element: (
        <ProtectRoute
          Component={ExpenseList}
          allowedRoles={["admin", "finance"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/finance/entity/revenue/list",
      element: (
        <ProtectRoute
          Component={EntityRevenueList}
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
      path: "/finance/entity/revenue",
      element: (
        <ProtectRoute
          Component={EntityRevenueDash}
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
          Component={SummaryRevenueList}
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
    {
      path: "/users/helper",
      element: <AllHelper />,
      errorElement: <Error />,
    },
    {
      path: "/users/driver",
      element: <AllDriver />,
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
    {
          path:"/admin/scorecard/:cid",
          element:(
            <ProtectRoute  
            Component={ScoreCard}
            allowedRoles={["admin"]}
            />
          )
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
          Component={StudentParentTimeTablePage}
          allowedRoles={["student", "parent"]}
        />
      ),
      errorElement: <Error />,
    },
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
      path: "users/student/profile",
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
          Component={StudentParentTimeTablePage}
          allowedRoles={["parent", "student"]}
        />
      ),
      errorElement: <Error />,
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
      path: "/checkprogress/:cid/:studentId",
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
      {/* //For Custom Cursor */}
      {/* <CustomCursor /> */}
      <Suspense fallback={<Fallback />}>
        <RouterProvider router={AppRouter} />
      </Suspense>
    </>
  );
}

export default App;
