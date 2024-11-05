import React from "react";
import TotalAttendanceGraph from "../Graphs/TotalAttendanceGraph";
import TotalEarningsGraph from "../Graphs/TotalEarningsGraph";
import TotalStudentsGraphjs from "../Graphs/TotalStudentsGraph";
import TopRankingStudents from "../Graphs/TopRankingStudents";
import Library from "../LibraryModule/Library";
import Events from "../EventModule/Event";
import NoticeBoard from "../NoticeModule/NoticeBoard";
import performanceData from "../DashboardData/PerformanceData";

const AdminSection = () => {
  return (
    <>
      {/* First Row: Attendance and Earnings */}
      <div className="flex flex-wrap justify-between items-start border-y h-auto">
        <div className="w-full md:w-1/2 p-2 border-r border-gray-300">
          <TotalAttendanceGraph />
        </div>
        <div className="w-full md:w-1/2 p-2">
          <TotalEarningsGraph />
        </div>
      </div>

      {/* Second Row: Top Ranking and Total Students with Middle Divider */}
      <div className="flex flex-wrap justify-between items-start border-y h-[33rem] relative">
        <div className="absolute left-2/3 transform -translate-x-1/2 top-0 bottom-0 border-l border-gray-300"></div>
        <div className="w-full md:w-2/3 h-full p-2">
          <TopRankingStudents />
        </div>
        <div className="w-full md:w-1/3 h-full flex flex-col p-2">
          <TotalStudentsGraphjs />
        </div>
      </div>

      {/* Third Row: Notice Board and Events with Middle Divider */}
      <div className="flex flex-wrap justify-between items-start border-y relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 border-l border-gray-300"></div>
        <div className="w-full md:w-1/2 p-2">
          <NoticeBoard descriptionLength={58} />
        </div>
        <div className="w-full md:w-1/2 p-2">
          <Events />
        </div>
      </div>

      {/* Full Width Library Section */}
      <div className="w-full p-4">
        <Library />
      </div>
    </>
  );
};

export default AdminSection;
