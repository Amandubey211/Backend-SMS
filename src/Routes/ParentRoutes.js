import React, { lazy } from "react";
import ProtectRoute from "./ProtectedRoutes/ProtectedRoute";
import Error from "../Components/Common/Error";

// Lazy-load parent modules
const ParentDash = lazy(() =>
  import("../Modules/Parents/Dashboard/ParentDash")
);
const MyChildren = lazy(() =>
  import("../Modules/Parents/Childrens/ChildScreen")
);
// ... more parent modules

const parentRoutes = [
  {
    path: "/parent_dash",
    element: <ProtectRoute Component={ParentDash} allowedRoles={["parent"]} />,
    errorElement: <Error />,
  },
  {
    path: "/children",
    element: <ProtectRoute Component={MyChildren} allowedRoles={["parent"]} />,
    errorElement: <Error />,
  },
  // ... other parent routes
];

export default parentRoutes;
