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

import { ReactComponent as StudentIcon } from "../../../Assets/DashboardAssets/SVG/student.svg";
import { ReactComponent as InstructorIcon } from "../../../Assets/DashboardAssets/SVG/instructor.svg";
import { ReactComponent as ParentIcon } from "../../../Assets/DashboardAssets/SVG/parent.svg";
import { ReactComponent as StaffIcon } from "../../../Assets/DashboardAssets/SVG/staff.svg";
import Spinner from "../../../Components/Common/Spinner";
import NoDataFound from "../../../Components/Common/NoDataFound";
import { useSelector } from "react-redux";

const MainSection = () => {
  const { dashboardData, error, fetchAdminDashboardData, loading } =
    useGetAdminDashboardData();
  const { role } = useSelector((state) => ({
    role: state.common.auth.role,
  }));

  useEffect(() => {
    fetchAdminDashboardData();
  }, [fetchAdminDashboardData]);

  const cardData = [
    {
      label: "Students",
      value:
        typeof dashboardData?.totalStudents === "number"
          ? dashboardData.totalStudents
          : "Loading...",
      bgColor: "bg-purple-100",
      textColor: "text-purple-700",
      icon: <StudentIcon className="w-10 h-10" />,
      iconBackground: "bg-[#564FFD]",
    },
    {
      label: "Teacher",
      value:
        typeof dashboardData?.teachers === "number"
          ? dashboardData.teachers
          : "Loading...",
      bgColor: "bg-green-100",
      textColor: "text-green-700",
      icon: <InstructorIcon className="w-10 h-10" />,
      iconBackground: "bg-[#23BD331A]",
    },
    {
      label: "Parents",
      value:
        typeof dashboardData?.parents === "number"
          ? dashboardData.parents
          : "Loading...",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-700",
      icon: <ParentIcon className="w-10 h-10" />,
      iconBackground: "bg-[#F09F04]",
    },
    {
      label: "Staff",
      value:
        typeof dashboardData?.staffs === "number"
          ? dashboardData.staffs
          : "Loading...",
      bgColor: "bg-pink-100",
      textColor: "text-pink-700",
      icon: <StaffIcon className="w-10 h-10" />,
      iconBackground: "bg-[#EA2058]",
    },
  ];

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <NoDataFound />;
  }

  return (
    <div className="w-full overflow-x-hidden">
      <div className="flex flex-wrap justify-center gap-3 py-4">
        {cardData.map((item, index) => (
          <DashCard key={index} {...item} />
        ))}
      </div>


      <div
        className={`flex flex-wrap relative ${role !== "teacher" ? "justify-between" : "justify-center"} items-start border-y`}
      >
        {/* Middle Border - only visible when role is not "teacher" */}
        {role !== "teacher" && (
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full border-l border-gray-300"></div>
        )}

        <div className={`w-[95%] ${role !== "teacher" ? "md:w-1/2" : "w-1/2"} p-2`}>
          <TotalAttendanceGraph />
        </div>

        {role !== "teacher" && (
          <div className="w-full md:w-1/2 p-2">
            <TotalEarningsGraph />
          </div>
        )}
      </div>



      <div className="flex flex-wrap justify-between items-start border-y h-[33rem] relative">
        {/* Middle Border */}
        <div className="absolute left-2/3 transform -translate-x-1/2 h-full border-l border-gray-300"></div>

        <div className="w-full md:w-2/3 h-full p-2">
          <TopRankingStudents />
        </div>

        <div className="w-full h-full flex flex-col md:w-1/3 p-2">
          {/* We have to update the Total Student Graphs after modification of the Backend, as per the requirement given by Jawairia */}
          <TotalStudentsGraphjs />
        </div>
      </div>

      <div className="flex flex-wrap items-start justify-between border-y relative">
        {/* Middle Border */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full border-l border-gray-300"></div>

        <div className="w-full md:w-1/2 p-2">
          <BestPerformersChart data={performanceData} />
        </div>

        <div className="w-full md:w-1/2 p-2">
          {/* We have to update the Total Student Graphs after modification of the Backend, as per the requirement given by Jawairia */}
          <Library />
        </div>
      </div>

      <div className="flex flex-wrap justify-between items-start border-y relative">
        {/* Middle Border */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full border-l border-gray-300"></div>

        <div className="w-full md:w-1/2 p-2">
          <NoticeBoard />
        </div>

        <div className="w-full md:w-1/2 p-2">
          <Events />
        </div>
      </div>

    </div>
  );
};

export default MainSection;
