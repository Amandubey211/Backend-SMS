import React, { lazy } from "react";
import ProtectRoute from "./ProtectedRoutes/ProtectedRoute";
import Error from "../Components/Common/Error";

// Lazy-load student modules
const StudentDashboard = lazy(() =>
  import("../Modules/Student/Dashboard/StudentDash")
);
const StudentClass = lazy(() =>
  import("../Modules/Student/StudentClass/SubClass/StudentClass")
);
// ... more student modules

const studentRoutes = [
  {
    path: "/student_dash",
    element: (
      <ProtectRoute Component={StudentDashboard} allowedRoles={["student"]} />
    ),
    errorElement: <Error />,
  },
  {
    path: "/student_class",
    element: (
      <ProtectRoute Component={StudentClass} allowedRoles={["student"]} />
    ),
    errorElement: <Error />,
  },
  // ... other student routes
];

export default studentRoutes;
