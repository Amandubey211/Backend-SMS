import React, { lazy, Suspense } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ProtectRoute from "../Routes/ProtectedRoutes/ProtectedRoute";
import Error from "../Components/Common/Error.js";
import Fallback from "../Components/Common/Fallback.js";
import Home from "../Modules/HomePage/Home";
import ParentLogin from "../Modules/LoginPages/Parent/ParentLogin";
import StudentLogin from "../Modules/LoginPages/Student/Login/StudentLogin.js";
import StudentSignUp from "../Modules/LoginPages/Student/SignUp/StudentSignUp.js";
import ResetPassword from "../Modules/LoginPages/Student/ResetPassword/ResetPassword.js";
import GraduationPage from "../Modules/Admin/Graduation/GraduationPage.js";

// Lazy load components
const Academic = lazy(() => import("../Modules/Admin/AcademicYear/Academic.js"));
const CreateAcademicYear = lazy(() =>
  import("../Components/Admin/CreateAcademicYear.js")
);
const AllStudents = lazy(() =>
  import("../Modules/Admin/UsersProfiles/StudentProfile/MainSection.js/AllStudents.js")
);
const SingleStudent = lazy(() =>
  import("../Modules/Admin/UsersProfiles/StudentProfile/MainSection.js/SingleStudent.js")
);
const AllTeachers = lazy(() =>
  import("../Modules/Admin/UsersProfiles/TeacherProfile/AllTeachers.js")
);
const AllLibrarian = lazy(() =>
  import("../Modules/Admin/UsersProfiles/LibrarianProfile/AllLibrarian.js")
);
const AllStaff = lazy(() =>
  import("../Modules/Admin/UsersProfiles/StaffProfile/AllStaff.js")
);
const AllAccountants = lazy(() =>
  import("../Modules/Admin/UsersProfiles/AccountantProfile/AllAccountants.js")
);
const StudentParentProfile = lazy(() =>
  import("../Modules/Admin/UsersProfiles/StudentParentsProfile/StudentParentProfile.js")
);
const UserProfile = lazy(() =>
  import("../Modules/Admin/UsersProfiles/AdminProfile/UserProfile.js")
);
const SpeedGrade = lazy(() =>
  import("../Modules/Admin/Subjects/Modules/SpeedGrade/SpeedGrade.js")
);
const StudentProfile = lazy(() =>
  import("../Modules/Student/profile/StudentProfile.js")
);
const StudentFinance = lazy(() =>
  import("../Modules/Student/Finance/StudentFinance.js")
);
const TakeAttendance = lazy(() =>
  import("../Modules/Admin/Attendance/TakeAttendance/TakeAttendance.js")
);
const CreateAssignment = lazy(() =>
  import("../Modules/Admin/Subjects/Modules/Assignments/CreateAssignment/CreateAssignment.js")
);
const Module = lazy(() =>
  import("../Modules/Admin/Subjects/Modules/Module/Module.js")
);
const CreateQuizzes = lazy(() =>
  import("../Modules/Admin/Subjects/Modules/Quizzes/CreateQuizzes/CreateQuizzes.js")
);
const CreateSyllabus = lazy(() =>
  import("../Modules/Admin/Subjects/Modules/Syllabus/CreateSyllabus/CreateSyllabus.js")
);
const StudentEvent = lazy(() =>
  import("../Modules/Student/StudentEvent/StudentEvent.js")
);
const Attendance = lazy(() =>
  import("../Modules/Admin/Attendance/Attendance.js")
);
const Events = lazy(() =>
  import("../Modules/Admin/Dashboard/EventModule/Event.js")
);
const QuizzList = lazy(() =>
  import("../Modules/Admin/Subjects/Modules/Quizzes/QuizzList/QuizzList.js")
);
const Rubric = lazy(() =>
  import("../Modules/Admin/Subjects/Modules/Rubric/Rubric.js")
);
const CreateAnnouncement = lazy(() =>
  import("../Modules/Admin/Subjects/Modules/Announcement/CreateAnnouncement/CreateAnnouncement.js")
);
const AnnouncementView = lazy(() =>
  import("../Modules/Admin/Subjects/Modules/Announcement/AnnouncementView/AnnouncementView.js")
);
const Announcement = lazy(() =>
  import("../Modules/Admin/Subjects/Modules/Announcement/Announcement.js")
);
const StudentDash = lazy(() =>
  import("../Modules/Student/Dashboard/StudentDash.js")
);
const StudentClass = lazy(() =>
  import("../Modules/Student/StudentClass/SubClass/StudentClass.js")
);
const ParentDash = lazy(() =>
  import("../Modules/Parents/Dasboard/ParentDash.js")
);
const MyChildren = lazy(() =>
  import("../Modules/Parents/Childrens/ChildScreen.js")
);
const Calendar = lazy(() =>
  import("../Modules/Parents/Attendance/ChildrenAttendence.js")
);
const ParentFinance = lazy(() =>
  import("../Modules/Parents/ParentFinance.js")
);
const ChildGrade = lazy(() =>
  import("../Modules/Parents/GradeChild/GradeChild.js")
);
const ParentEvent = lazy(() => 
  import("../Modules/Parents/ParentEvent/ParentEvent.js")
);





const Dash = lazy(() => import("../Modules/Admin/Dashboard/Dash.js"));

// Define your routes in an array
const routes = [
  { path: "/", element: <Home />, errorElement: <Error /> },
  { path: "/studentlogin", element: <StudentLogin />, errorElement: <Error /> },
  { path: "/parentlogin", element: <ParentLogin />, errorElement: <Error /> },
  { path: "/signup", element: <StudentSignUp />, errorElement: <Error /> },
  { path: "/reset_password/:token", element: <ResetPassword />, errorElement: <Error /> },

  // Admin Routes
  {
    path: "/dashboard",
    element: <ProtectRoute Component={Dash} allowedRoles={["admin", "teacher"]} />,
    errorElement: <Error />,
  },
  {
    path: "/class",
    element: <ProtectRoute Component={AllStudents} allowedRoles={["admin", "teacher"]} />,
    errorElement: <Error />,
  },
  {
    path: "/class/:cid/attendance",
    element: <ProtectRoute Component={Attendance} allowedRoles={["admin", "teacher"]} />,
    errorElement: <Error />,
  },
  {
    path: "/class/:cid/take_attendance",
    element: <ProtectRoute Component={TakeAttendance} allowedRoles={["admin", "teacher"]} />,
    errorElement: <Error />,
  },
  {
    path: "/class/:cid/:sid/module",
    element: <ProtectRoute Component={Module} allowedRoles={["admin", "teacher"]} />,
    errorElement: <Error />,
  },
  {
    path: "/class/:cid/:sid/assignment",
    element: <ProtectRoute Component={CreateAssignment} allowedRoles={["admin", "teacher"]} />,
    errorElement: <Error />,
  },
  {
    path: "/class/:cid/:sid/create_quiz",
    element: <ProtectRoute Component={CreateQuizzes} allowedRoles={["admin", "teacher"]} />,
    errorElement: <Error />,
  },
  {
    path: "/class/:cid/:sid/create_syllabus",
    element: <ProtectRoute Component={CreateSyllabus} allowedRoles={["admin", "teacher"]} />,
    errorElement: <Error />,
  },
  {
    path: "/class/:cid/:sid/announcements",
    element: <ProtectRoute Component={Announcement} allowedRoles={["admin", "teacher"]} />,
    errorElement: <Error />,
  },
  {
    path: "/class/:cid/:sid/announcements/create_announcement",
    element: <ProtectRoute Component={CreateAnnouncement} allowedRoles={["admin", "teacher"]} />,
    errorElement: <Error />,
  },
  {
    path: "/class/:cid/:sid/grades",
    element: <ProtectRoute Component={SpeedGrade} allowedRoles={["admin", "teacher"]} />,
    errorElement: <Error />,
  },
  {
    path: "/graduates",
    element: (
      <ProtectRoute Component={GraduationPage} allowedRoles={["admin"]} />
    ),
    errorElement: <Error />,
  },

  // Student Routes
  {
    path: "/student_dash",
    element: <ProtectRoute Component={StudentDash} allowedRoles={["student"]} />,
    errorElement: <Error />,
  },
  {
    path: "/student_class",
    element: <ProtectRoute Component={StudentClass} allowedRoles={["student"]} />,
    errorElement: <Error />,
  },
  {
    path: "/student_class/:cid/:sid/module",
    element: <ProtectRoute Component={Module} allowedRoles={["student"]} />,
    errorElement: <Error />,
  },
  {
    path: "/student_class/:cid/:sid/announcements",
    element: <ProtectRoute Component={Announcement} allowedRoles={["student"]} />,
    errorElement: <Error />,
  },
  {
    path: "/student_finance",
    element: <ProtectRoute Component={StudentFinance} allowedRoles={["student"]} />,
    errorElement: <Error />,
  },
  {
    path: "/users/student/profile",
    element: <ProtectRoute Component={StudentProfile} allowedRoles={["student"]} />,
    errorElement: <Error />,
  },

  // Parent Routes
  {
    path: "/parent_dash",
    element: <ProtectRoute Component={ParentDash} allowedRoles={["parent"]} />,
    errorElement: <Error />,
  },
  
  {
    path: "/children",
    element: <ProtectRoute Component={MyChildren} allowedRoles={["parent"]} />, // Protected route for children
    errorElement: <Error />,
  },
  {
    path: "/attendance",
    element: <ProtectRoute Component={Calendar} allowedRoles={["parent"]} />, // Protected attendance route
    errorElement: <Error />,
  },
  {
    path: "/parentfinance",
    element: <ProtectRoute Component={ParentFinance} allowedRoles={["parent"]} />, // Protected finance route
    errorElement: <Error />,
  },
  {
    path: "/childgrade/:studentId",
    element: <ProtectRoute Component={ChildGrade} allowedRoles={["parent"]} />, // Protect this as well
    errorElement: <Error />,
  },
  {
    path: "/checkprogress/:studentId",
    element: <ProtectRoute Component={CheckProgress} allowedRoles={["parent"]} />, // Protected check progress route
    errorElement: <Error />,
  },
  {
    path: "/users/parent/profile",
    element: <ProtectRoute Component={ParentProfile} allowedRoles={["parent"]} />, // Protect the profile route
    errorElement: <Error />,
  },
  {
    path: "/parent/events",
    element: <ProtectRoute Component={ParentEvent} allowedRoles={["parent"]} />,
    errorElement: <Error />,
  },
  
];

// Create the browser router
const AppRouter = createBrowserRouter(routes);

export default function AllRoutes() {
  return (
    <Suspense fallback={<Fallback />}>
      <RouterProvider router={AppRouter} />
    </Suspense>
  );
}
