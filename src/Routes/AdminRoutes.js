import React, { lazy } from "react";
import ProtectRoute from "./ProtectedRoutes/ProtectedRoute";
import Error from "../Components/Common/Error";

// Lazy-load heavy modules specific to admin
const AdminDashboard = lazy(() => import("../Modules/Admin/Dashboard/Dash"));
const Classes = lazy(() => import("../Modules/Admin/Classes/Classes"));
const Branch = lazy(() => import("../Modules/Admin/Branchs/Branch"));
// ... add other admin components

const adminRoutes = [
  {
    path: "/dashboard",
    element: (
      <ProtectRoute
        Component={AdminDashboard}
        allowedRoles={["admin", "teacher", "librarian", "finance", "staff"]}
      />
    ),
    errorElement: <Error />,
  },
  {
    path: "/dashboard/all/branch",
    element: (
      <ProtectRoute Component={Branch} allowedRoles={["admin"]} />
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
  // ... other admin routes
];

export default adminRoutes;
