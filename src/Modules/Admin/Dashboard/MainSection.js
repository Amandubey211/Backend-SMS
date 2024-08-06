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
import { FaUsers, FaChalkboardTeacher } from "react-icons/fa";
import { MdFamilyRestroom } from "react-icons/md";
import { SiAuth0 } from "react-icons/si";
import DashCard from "./Dashcard";
import Fallback from "../../../Components/Common/Fallback";

import { ReactComponent as StudentIcon } from "../../../Assets/DashboardAssets/SVG/student.svg";
import { ReactComponent as InstructorIcon } from "../../../Assets/DashboardAssets/SVG/instructor.svg";
import { ReactComponent as ParentIcon } from "../../../Assets/DashboardAssets/SVG/parent.svg";
import { ReactComponent as StaffIcon } from "../../../Assets/DashboardAssets/SVG/staff.svg";
import Spinner from "../../../Components/Common/Spinner";
import NoDataFound from "../../../Components/Common/NoDataFound";

const MainSection = () => {
  const { dashboardData, error, fetchAdminDashboardData, loading } =
    useGetAdminDashboardData();

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
    <div className="h-full w-full">
      <div className="w-full p-2">
        <div className="flex flex-wrap justify-center gap-3 py-4">
          {cardData.map((item, index) => (
            <DashCard key={index} {...item} />
          ))}
        </div>
        <div className="flex flex-wrap justify-between items-start border-y">
          <div className="w-full md:w-1/2 border-r">
            <TotalAttendanceGraph />
          </div>
          <div className="w-full md:w-1/2">
            <TotalEarningsGraph />
          </div>
        </div>
        <div className="flex flex-wrap justify-between items-start border-y">
          <div className="w-full md:w-2/3 h-full border-r">
            <TopRankingStudents />
          </div>
          <div className="w-full h-full flex flex-col md:w-1/3 ps-3">
            <TotalStudentsGraphjs
              maleStudents={dashboardData?.maleStudents || 0}
              femaleStudents={dashboardData?.femaleStudents || 0}
            />
          </div>
        </div>
        <div className="flex flex-wrap items-start justify-between border-y">
          <div className="w-full md:w-1/2 border-r flex flex-col justify-center">
            <BestPerformersChart data={performanceData} />
          </div>
          <div className="w-full md:w-1/2">
            <Library />
          </div>
        </div>
        <div className="flex flex-wrap justify-between items-start border-y">
          <div className="w-full md:w-1/2 border-r">
            <NoticeBoard />
          </div>
          <div className="w-full md:w-2/4">
            <Events />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainSection;
