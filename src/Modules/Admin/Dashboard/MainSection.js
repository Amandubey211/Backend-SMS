import React, { useEffect } from "react";
import TotalAttendanceGraph from "./Graphs/TotalAttendanceGraph";
import TotalEarningsGraph from "./Graphs/TotalEarningsGraph";
import TotalStudentsGraphjs from "./Graphs/TotalStudentsGraph";
import TopRankingStudents from "./Graphs/TopRankingStudents";
import Library from "./LibraryModule/Library";
import Events from "./EventModule/Event";
import BestPerformersChart from "./Graphs/BestPerformancGraph";
import performanceData from "./DashboardData/PerformanceData";
import NoticeBoard from "./NoticeModule/NoticeBoard";
import useGetAdminDashboardData from "../../../Hooks/AuthHooks/Staff/Admin/Dashboard/useGetAdminDashboardData";
import DashCard from "./Dashcard";


// Import role-specific sections
import AdminSection from "./SubDashboard/AdminSection";
import TeacherSection from "./SubDashboard/TeacherSection";
import AccountantSection from "./SubDashboard/AccountantSection";
import LibrarianSection from "./SubDashboard/LibrarianSection";
import StaffSection from "./SubDashboard/StaffSection";



import { ReactComponent as StudentIcon } from "../../../Assets/DashboardAssets/SVG/student.svg";
import { ReactComponent as InstructorIcon } from "../../../Assets/DashboardAssets/SVG/instructor.svg";
import { ReactComponent as ParentIcon } from "../../../Assets/DashboardAssets/SVG/parent.svg";
import { ReactComponent as StaffIcon } from "../../../Assets/DashboardAssets/SVG/staff.svg";
import { RiDashboardFill } from "react-icons/ri";
import Spinner from "../../../Components/Common/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { createStaffSalary } from "../../../Store/Slices/Admin/Accounting/Expenses/expenses.action";
import { fetchAcademicYear } from "../../../Store/Slices/Common/AcademicYear/academicYear.action";

const MainSection = () => {
  // const {academicYears} = useSelector((store)=>store.common.academicYear)
  // useEffect(()=>{
  //   dispatch(fetchAcademicYear()).then(()=>{
  //     const activeAcademicYear = academicYears?.find((i)=>i.isActive == true);
  //     localStorage.setItem("say", activeAcademicYear?._id);
  //   });
  // },[])
  const { dashboardData, error, fetchAdminDashboardData, loading } =
    useGetAdminDashboardData();
    const dispatch=useDispatch();

  const { role } = useSelector((state) => ({
    role: state.common.auth.role,
  }));

  useEffect(() => {
    fetchAdminDashboardData();
  }, [fetchAdminDashboardData]);



  useEffect(()=>{
   dispatch(createStaffSalary({status:"unpaid",action:"pay now"}))
  },[dispatch,createStaffSalary])

  function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const cardData = [
    {
      label: "Students",
      value:
        typeof dashboardData?.totalStudents === "number"
          ? dashboardData.totalStudents
          : 0,
      bgColor: "bg-purple-100",
      textColor: "text-purple-700",
      icon: <StudentIcon className="w-10 h-10" />,
      iconBackground: "bg-[#564FFD]",
      navigateTo: '/users/students',  // Add this line
    },
    {
      label: "Teacher",
      value:
        typeof dashboardData?.teachers === "number"
          ? dashboardData.teachers
          : 0,
      bgColor: "bg-green-100",
      textColor: "text-green-700",
      icon: <InstructorIcon className="w-10 h-10" />,
      iconBackground: "bg-[#23BD331A]",
      navigateTo: '/users/teachers',  // Add this line
    },
    {
      label: "Parents",
      value:
        typeof dashboardData?.parents === "number"
          ? dashboardData.parents
          : 0,
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-700",
      icon: <ParentIcon className="w-10 h-10" />,
      iconBackground: "bg-[#F09F04]",
      navigateTo: '/users/parents',  // Add this line
    },
    {
      label: "Staff",
      value:
        typeof dashboardData?.staffs === "number"
          ? dashboardData.staffs
          : 0,
      bgColor: "bg-pink-100",
      textColor: "text-pink-700",
      icon: <StaffIcon className="w-10 h-10" />,
      iconBackground: "bg-[#EA2058]",
      navigateTo: '/users/staffs',  // Add this line
    },
  ];

  return (
    <div className="w-full overflow-x-hidden">
      <div className="flex flex-wrap justify-center gap-3 py-4">
        {cardData.map((item, index) => (
          <DashCard key={index} {...item} />
        ))}
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center w-full">
          <Spinner />
          <hr className="my-4 border-gray-300" />
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center w-full">
          <RiDashboardFill className="text-gray-400 text-9xl mb-4" />
          <p className="text-gray-600 text-2xl">{error}: Unable to Fetch {capitalizeFirstLetter(role)} Dashboard</p>
          <hr className="my-4 border-gray-300" />
        </div>
      )}

      {!loading && !error && (
        <>
          {role === "admin" && <AdminSection />}
          {role === "teacher" && <TeacherSection />}
          {role === "accountant" && <AccountantSection />}
          {role === "librarian" && <LibrarianSection />}
          {role === "staff" && <StaffSection />}


        </>
      )}
    </div>
  );
};

export default MainSection;
