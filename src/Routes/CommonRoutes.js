import React, { lazy } from "react";
import Error from "../Components/Common/Error";
import ProtectRoute from "./ProtectedRoutes/ProtectedRoute";

// Direct imports or lazy loading for common components
import Home from "../Modules/HomePage/Home";
import StudentLogin from "../Modules/LoginPages/Student/Login/StudentLogin";
import ParentLogin from "../Modules/LoginPages/Parent/ParentLogin";

// Example of lazy-loaded components
const PrivacyPolicy = lazy(() =>
  import("../Modules/LoginPages/Policys/PrivacyPolicy")
);
const TermsAndConditions = lazy(() =>
  import("../Modules/LoginPages/Policys/TermsAndConditions")
);

const commonRoutes = [
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
    path: "/privacy-policy",
    element: <PrivacyPolicy />,
    errorElement: <Error />,
  },
  {
    path: "/terms-and-conditions",
    element: <TermsAndConditions />,
    errorElement: <Error />,
  },
  // Example protected route
  {
    path: "/example_protected",
    element: (
      <ProtectRoute
        Component={() => <div>Example Protected Page</div>}
        allowedRoles={["admin", "student", "parent"]}
      />
    ),
    errorElement: <Error />,
  },
];

export default commonRoutes;
