import React, { useEffect } from "react";
import { Skeleton } from "antd"; // Import Ant Design's Skeleton component

import DashCard from "./Dashcard";

// Import role-specific sections
import AdminSection from "./SubDashboard/AdminSection";
import TeacherSection from "./SubDashboard/TeacherSection";
import AccountantSection from "./SubDashboard/AccountantSection";
import LibrarianSection from "./SubDashboard/LibrarianSection";
import StaffSection from "./SubDashboard/StaffSection";

// Import SVG icons
import { ReactComponent as StudentIcon } from "../../../Assets/DashboardAssets/SVG/student.svg";
import { ReactComponent as InstructorIcon } from "../../../Assets/DashboardAssets/SVG/instructor.svg";
import { ReactComponent as ParentIcon } from "../../../Assets/DashboardAssets/SVG/parent.svg";
import { ReactComponent as StaffIcon } from "../../../Assets/DashboardAssets/SVG/staff.svg";
import { RiDashboardFill } from "react-icons/ri";
// import Spinner from "../../../Components/Common/Spinner"; // Removed spinner in favor of shimmer UI

import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
// import { createStaffSalary } from "../../../Store/Slices/Admin/Accounting/Expenses/expenses.action";
import { fetchAdminDashboardData } from "../../../Store/Slices/Admin/Dashboard/adminDashboard.action";
import { fetchAllClasses } from "../../../Store/Slices/Admin/Class/actions/classThunk";
import { PERMISSIONS } from "../../../config/permission";
import ProtectedSection from "../../../Routes/ProtectedRoutes/ProtectedSection";

// Shimmer UI component for DashCard
const DashCardShimmer = () => {
  return (
    <div className="p-3 px-6 w-[24%] rounded-lg border bg-white">
      <div className="flex gap-4 items-center">
        {/* Simulated icon area */}
        <div className="p-3 rounded-full">
          <Skeleton.Avatar active size="large" shape="circle" />
        </div>
        {/* Simulated text content */}
        <div className="flex flex-col">
          <Skeleton.Input
            active
            size="small"
            style={{ width: 60, marginBottom: 8 }}
          />
          <Skeleton.Input active size="small" style={{ width: 80 }} />
        </div>
      </div>
    </div>
  );
};

const MainSection = () => {
  const { dashboardData, errorDashboard, loadingDashboard } = useSelector(
    (store) => store.admin.adminDashboard
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllClasses());
  }, [dispatch]);

  const { role } = useSelector((state) => ({
    role: state.common.auth.role,
  }));

  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchAdminDashboardData());
  }, [dispatch]);

  function capitalizeFirstLetter(string) {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const cardData = [
    {
      label: t("Students", { ns: "dashboard" }),
      value:
        typeof dashboardData?.totalStudents === "number"
          ? dashboardData.totalStudents
          : 0,
      bgColor: "bg-purple-100",
      textColor: "text-purple-700",
      icon: <StudentIcon className="w-10 h-10" />,
      iconBackground: "bg-[#564FFD]",
      navigateTo: "/users/students",
    },
    {
      label: t("Teacher", { ns: "dashboard" }),
      value:
        typeof dashboardData?.teachers === "number"
          ? dashboardData.teachers
          : 0,
      bgColor: "bg-green-100",
      textColor: "text-green-700",
      icon: <InstructorIcon className="w-10 h-10" />,
      iconBackground: "bg-[#23BD331A]",
      navigateTo: "/users/teachers",
    },
    {
      label: t("Parents", { ns: "dashboard" }),
      value:
        typeof dashboardData?.parents === "number" ? dashboardData.parents : 0,
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-700",
      icon: <ParentIcon className="w-10 h-10" />,
      iconBackground: "bg-[#F09F04]",
      navigateTo: "/users/parents",
    },
    {
      label: t("Staff", { ns: "dashboard" }),
      value:
        typeof dashboardData?.staffs === "number" ? dashboardData.staffs : 0,
      bgColor: "bg-pink-100",
      textColor: "text-pink-700",
      icon: <StaffIcon className="w-10 h-10" />,
      iconBackground: "bg-[#EA2058]",
      navigateTo: "/users/staffs",
    },
  ];

  return (
    <div className="w-full overflow-x-hidden">
      <ProtectedSection
        requiredPermission={PERMISSIONS.GET_DASHBOARD_CARD}
        title={t("Cards")}
      >
        <div className="flex flex-wrap justify-center gap-3 py-4 px-4 ">
          {loadingDashboard
            ? // Render 4 shimmer cards while data is loading
              [1, 2, 3, 4].map((_, index) => <DashCardShimmer key={index} />)
            : // Once data is loaded, render the actual cards
              cardData.map((item, index) => <DashCard key={index} {...item} />)}
        </div>
      </ProtectedSection>

      {errorDashboard && (
        <div className="flex flex-col items-center justify-center w-full">
          <RiDashboardFill className="text-gray-400 text-9xl mb-4" />
          <p className="text-gray-600 text-2xl">
            {errorDashboard}: Unable to Fetch {capitalizeFirstLetter(role)}{" "}
            Dashboard
          </p>
          <hr className="my-4 border-gray-300" />
        </div>
      )}

      {!errorDashboard && (
        <>
          {role === "admin" && <AdminSection />}
          {role === "teacher" && <TeacherSection />}
          {role === "finance" && <AccountantSection />}
          {role === "librarian" && <LibrarianSection />}
          {role === "staff" && <StaffSection />}
        </>
      )}
    </div>
  );
};

export default MainSection;
