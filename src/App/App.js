import { Suspense, lazy, useEffect, useState } from "react";
import Error from "../Components/Common/Error.js";
import Offline from "../Components/Common/Offline.js";
import Home from "../Modules/HomePage/Home";
import ParentLogin from "../Modules/LoginPages/Parent/ParentLogin";
import StudentLogin from "../Modules/LoginPages/Student/Login/StudentLogin.js";
import TeacherLogin from "../Modules/LoginPages/Teacher/TeacherLogin";
import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import ProtectRoute from "../Routes/ProtectedRoutes/ProtectedRoute";
import StudentSignUp from "../Modules/LoginPages/Student/SignUp/StudentSignUp.js";
import ResetPassword from "../Modules/LoginPages/Student/ResetPassword/ResetPassword.js";
import Fallback from "../Components/Common/Fallback.js";


function App() {
  const Dash = lazy(() => import("../Modules/Admin/Dashboard/Dash.js"));
  const Group_Section = lazy(() =>
    import("../Modules/Admin/Groups&Sections/Group_Section.js")
  );
  const Rubric = lazy(() =>
    import("../Modules/Admin/Subjects/Modules/Rubric/Rubric.js")
  );
  const Assignment = lazy(() =>
    import("../Modules/Admin/Subjects/Modules/Assignments/Assignment.js")
  );
  const Chapter = lazy(() =>
    import("../Modules/Admin/Subjects/Modules/Chapter/Chapter.js")
  );

  const Module = lazy(() =>
    import("../Modules/Admin/Subjects/Modules/Module/Module.js")
  );

  const Attendance = lazy(() =>
    import("../Modules/Admin/Attendance/Attendance.js")
  );
  // const Subject = lazy(() => import("../Modules/Admin/Subject/Subject.js"));
  const Students = lazy(() => import("../Modules/Admin/Students/Students.js"));
  const Addmission = lazy(() =>
    import("../Modules/Admin/Addmission/Addmission.js")
  );
  const Classes = lazy(() => import("../Modules/Admin/Classes/Classes.js"));
  const Class = lazy(() =>
    import("../Modules/Admin/Classes/SubClass/Class.js")
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

  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    // Add event listeners for online/offline events
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    // Cleanup: remove event listeners
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  const AppRouter = createBrowserRouter([
    // Verification Routes
    {
      path: "/",
      element: <Home />,
      errorElement: <Error />,
    },
    {
      path: "/studentlogin",
      element: <StudentLogin />,
      errorElement: <Error />,
    },
    {
      path: "/parentlogin",
      element: <ParentLogin />,
      errorElement: <Error />,
    },
    {
      path: "/stafflogin",
      element: <TeacherLogin />,
      errorElement: <Error />,
    },
    {
      path: "/signup",
      element: <StudentSignUp />,
      errorElement: <Error />,
    },
    {
      path: "/reset_password",
      element: <ResetPassword />,
      errorElement: <Error />,
    },
    // Admin Routes------------------------
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
    //Admin Class Route ------------------------------
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
      path: "/class/:cid/attendance",
      element: <ProtectRoute Component={Attendance} role="admin" />,
      errorElement: <Error />,
    },
    //Admin Subject Module Route -------------------

    {
      path: "/class/:cid/:sid/module",
      element: <ProtectRoute Component={Module} role="admin" />,
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/chapter",
      element: <ProtectRoute Component={Chapter} role="admin" />,
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/assignments",
      element: <ProtectRoute Component={Assignment} role="admin" />,
      errorElement: <Error />,
    },
    
    {
      path: "/class/:cid/:sid/rubric",
      element: <ProtectRoute Component={Rubric} role="admin" />,
      errorElement: <Error />,
    },

    //Student Routes-------------------------
    {
      path: "/student_dash",
      element: <ProtectRoute Component={StudentDash} role="student" />,
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
