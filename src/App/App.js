import React, { Suspense, lazy, useEffect, useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Error from "../Components/Common/Error.js";
import Offline from "../Components/Common/Offline.js";
import Home from "../Modules/HomePage/Home";
import ParentLogin from "../Modules/LoginPages/Parent/ParentLogin";
import StudentLogin from "../Modules/LoginPages/Student/Login/StudentLogin.js";
import TeacherLogin from "../Modules/LoginPages/Teacher/TeacherLogin";
import StudentSignUp from "../Modules/LoginPages/Student/SignUp/StudentSignUp.js";
import ResetPassword from "../Modules/LoginPages/Student/ResetPassword/ResetPassword.js";
import Fallback from "../Components/Common/Fallback.js";
import ProtectRoute from "../Routes/ProtectedRoutes/ProtectedRoute";

import "./App.css";

const AccountingSection = lazy(() =>
  import("../Modules/Admin/Accounting/MainSection/AccountingSection.js")
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
const Announce = lazy(() =>
  import("../Modules/Admin/NoticeBoard/Announcements/Announce.js")
);
const Earning = lazy(() =>
  import("../Modules/Admin/Accounting/Earnings/Earning.js")
);
const Expenses = lazy(() =>
  import("../Modules/Admin/Accounting/Expenses/Expenses.js")
);
const AllStudents = lazy(() =>
  import("../Modules/Admin/StudentProfile/MainSection.js/AllStudents.js")
);
const SingleStudent = lazy(() =>
  import("../Modules/Admin/StudentProfile/MainSection.js/SingleStudent.js")
);

const AssignmentList = lazy(() =>
  import(
    "../Modules/Admin/Subjects/Modules/Assignments/AllAssignments/AssignmentList.js"
  )
);
const Dash = lazy(() => import("../Modules/Admin/Dashboard/Dash.js"));
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
const Attendance = lazy(() =>
  import("../Modules/Admin/Attendance/Attendance.js")
);
const Students = lazy(() => import("../Modules/Admin/Students/Students.js"));
const Addmission = lazy(() =>
  import("../Modules/Admin/Addmission/Addmission.js")
);
const Classes = lazy(() => import("../Modules/Admin/Classes/Classes.js"));
const Class = lazy(() => import("../Modules/Admin/Classes/SubClass/Class.js"));
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

function App() {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

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
    { path: "/", element: <Home />, errorElement: <Error /> },
    {
      path: "/studentlogin",
      element: <StudentLogin />,
      errorElement: <Error />,
    },
    { path: "/parentlogin", element: <ParentLogin />, errorElement: <Error /> },
    { path: "/stafflogin", element: <TeacherLogin />, errorElement: <Error /> },
    { path: "/signup", element: <StudentSignUp />, errorElement: <Error /> },
    {
      path: "/reset_password",
      element: <ResetPassword />,
      errorElement: <Error />,
    },
    // Admin Routes
    {
      path: "/admin_dash",
      element: <ProtectRoute Component={Dash} role="admin" />,
      errorElement: <Error />,
    },
    {
      path: "/class",
      element: <ProtectRoute Component={Classes} role="admin" />,
      errorElement: <Error />,
    },
    {
      path: "/class/:cid",
      element: <ProtectRoute Component={Class} role="admin" />,
      errorElement: <Error />,
    },
    {
      path: "/verify_students",
      element: <ProtectRoute Component={VerificationPage} role="admin" />,
      errorElement: <Error />,
    },
    {
      path: "/verify_students/:sid",
      element: (
        <ProtectRoute Component={UnVerifiedStudentDetails} role="admin" />
      ),
      errorElement: <Error />,
    },
    {
      path: "/admissions",
      element: <ProtectRoute Component={Addmission} role="admin" />,
      errorElement: <Error />,
    },
    // Admin Class Routes
    {
      path: "/class/:cid/teachers",
      element: <ProtectRoute Component={Teachers} role="admin" />,
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/section_group",
      element: <ProtectRoute Component={Group_Section} role="admin" />,
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/students",
      element: <ProtectRoute Component={Students} role="admin" />,
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/attendance",
      element: <ProtectRoute Component={Attendance} role="admin" />,
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/take_attendance",
      element: <ProtectRoute Component={TakeAttendance} role="admin" />,
      errorElement: <Error />,
    },
    // Admin Subject Module Routes
    {
      path: "/class/:cid/:sid/module",
      element: <ProtectRoute Component={Module} role="admin" />,
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/assignments",
      element: <ProtectRoute Component={AssignmentList} role="admin" />,
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/assignments/:aid/view",
      element: <ProtectRoute Component={Assignment} role="admin" />,
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/createassignment",
      element: <ProtectRoute Component={CreateAssignment} role="admin" />,
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/rubric",
      element: <ProtectRoute Component={Rubric} role="admin" />,
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/quizzes",
      element: <ProtectRoute Component={QuizzList} role="admin" />,
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/quizzes/:qid/view",
      element: <ProtectRoute Component={Quizzes} role="admin" />,
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/create_quiz",
      element: <ProtectRoute Component={CreateQuizzes} role="admin" />,
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/discussions",
      element: <ProtectRoute Component={Discussion} role="admin" />,
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/create_discussion",
      element: <ProtectRoute Component={AddDiscussion} role="admin" />,
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/discussions/:did/view",
      element: <ProtectRoute Component={DiscussionView} role="admin" />,
      errorElement: <Error />,
    },
    // Student Routes
    {
      path: "/student_dash",
      element: <ProtectRoute Component={StudentDash} role="student" />,
      errorElement: <Error />,
    },
    {
      path: "accounting/studentfees",
      element: <AccountingSection />,
      errorElement: <Error />,
    },
    { path: "library", element: <Libary />, errorElement: <Error /> },
    {
      path: "noticeboard/events",
      element: <EventSchool />,
      errorElement: <Error />,
    },
    {
      path: "/noticeboard/announcements",
      element: <Announce />,
      errorElement: <Error />,
    },
    {
      path: "/accounting/reports",
      element: <Earning />,
      errorElement: <Error />,
    },
    {
      path: "/accounting/expenses",
      element: <Expenses />,
      errorElement: <Error />,
    },
    {
      path: "/users/students",
      element: <AllStudents />,
      errorElement: <Error />,
    },
    { path: "/user/:cid", element: <SingleStudent />, errorElement: <Error /> },
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
