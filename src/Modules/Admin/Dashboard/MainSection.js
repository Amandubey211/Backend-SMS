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
import { RiDashboardFill } from "react-icons/ri";
import Spinner from "../../../Components/Common/Spinner";
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
          {role === "admin" && (
            <>
              <div className="flex flex-wrap justify-between items-start border-y h-auto">
                <div className="w-full md:w-1/2 p-2 border-r border-gray-300">
                  <TotalAttendanceGraph />
                </div>
                <div className="w-full md:w-1/2 p-2">
                  <TotalEarningsGraph />
                </div>
              </div>

              <div className="flex flex-wrap justify-between items-start border-y h-[33rem] relative">
                <div className="absolute left-2/3 transform -translate-x-1/2 h-full border-l border-gray-300"></div>
                <div className="w-full md:w-2/3 h-full p-2">
                  <TopRankingStudents />
                </div>
                <div className="w-full h-full flex flex-col md:w-1/3 p-2">
                  <TotalStudentsGraphjs />
                </div>
              </div>
              <div className="flex flex-wrap items-start justify-between border-y relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full border-l border-gray-300"></div>
                <div className="w-full md:w-1/2 p-2">
                  <BestPerformersChart data={performanceData} />
                </div>
                <div className="w-full md:w-1/2 p-2">
                  <Library />
                </div>
              </div>
              <div className="flex flex-wrap justify-between items-start border-y relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full border-l border-gray-300"></div>
                <div className="w-full md:w-1/2 p-2">
                  <NoticeBoard descriptionLength={58} />
                </div>
                <div className="w-full md:w-1/2 p-2">
                  <Events />
                </div>
              </div>
            </>
          )}

          {role === "teacher" && (
            <>
              <div className="flex flex-wrap justify-between items-start border-y h-auto">
                <div className="w-full md:w-1/2 p-2 border-r border-gray-300">
                  <TotalAttendanceGraph />
                </div>
                <div className="w-full md:w-1/2 p-2">
                  <TopRankingStudents />
                </div>
              </div>

              <div className="flex flex-wrap justify-between items-start border-y h-auto relative">
                <div className="flex w-full">
                  {/* Total Students Graph */}
                  <div className="w-full h-full flex flex-col md:w-2/5 p-2 border-r border-gray-300">
                    <TotalStudentsGraphjs />
                  </div>
                  {/* Best Performers Chart */}
                  <div className="w-full md:w-3/5 p-4">
                    <BestPerformersChart data={performanceData} />
                  </div>
                </div>
              </div>


              <div className="flex flex-wrap items-start justify-between border-y h-auto">
                <div className="w-full md:w-1/2 p-2 border-r border-gray-300">
                  <NoticeBoard descriptionLength={58} />
                </div>
                <div className="w-full md:w-1/2 p-2">
                  <Events />
                </div>
              </div>


            </>
          )}

          {role === "accountant" && (
            <>
              {/* Total Earnings Graph and Total Students Graph aligned in one row */}
              <div className="flex flex-wrap items-start justify-between border-y h-auto">
                <div className="w-full md:w-2/3 p-4 border-r border-gray-300">
                  <TotalEarningsGraph />
                </div>
                <div className="w-full md:w-1/3 p-4">
                  <TotalStudentsGraphjs />
                </div>
              </div>

              {/* NoticeBoard and Events aligned in one row */}
              <div className="flex flex-wrap items-start justify-between border-y h-auto">
                <div className="w-full md:w-1/2 p-4 border-r border-gray-300">
                  <NoticeBoard descriptionLength={58} />
                </div>
                <div className="w-full md:w-1/2 p-4">
                  <Events />
                </div>
              </div>
            </>
          )}

          {role === "librarian" && (
            <>
              {/* Library Component */}
              <div className="flex flex-wrap justify-between items-start border-y h-auto">
                <div className="w-full md:w-1/2 p-4 border-r border-gray-300">
                  <Library />
                </div>
                <div className="w-full md:w-1/2 p-4">
                  <Events />
                </div>
              </div>

              {/* NoticeBoard Component */}
              <div className="flex flex-wrap items-start justify-between border-y h-auto">
                <div className="w-full p-4">
                  <NoticeBoard descriptionLength={140} />
                </div>
              </div>
            </>
          )}


        </>
      )}
    </div>
  );
};

export default MainSection;
