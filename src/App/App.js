import { Suspense, lazy, useEffect, useState } from "react";
import Error from "../Components/Error";
import Offline from "../Components/Offline";
import Home from "../Modules/HomePage/Home";
import ParentLogin from "../Modules/LoginPages/Parent/ParentLogin";
import StudentLogin from "../Modules/LoginPages/Student/StudentLogin";
import TeacherLogin from "../Modules/LoginPages/Teacher/TeacherLogin";
import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import StudentDiwanLogo from "../Assets/HomeAssets/StudentDiwanLogo.png";
import ProtectRoute from "../Routes/ProtectedRoutes/ProtectedRoute";
function App() {
  const Dash = lazy(() => import("../Modules/Dashboard/Dash.js"));

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
      path: "/dash",
      element: <ProtectRoute Component={Dash} />,
      errorElement: <Error />,
    },
  ]);
  return (
    <>
      {/* Render OfflineMessage component if offline */}
      {!isOnline && <Offline />}
      <Suspense
        fallback={
          <div className="flex justify-center items-center w-screen h-screen">
            <img src={StudentDiwanLogo} className="h-20" alt="student diwan " />
          </div>
        } // Render Loader component while loading
      >
        <RouterProvider router={AppRouter} />
      </Suspense>
    </>
  );
}

export default App;
