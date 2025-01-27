import React from "react";
import TotalAttendanceGraph from "../Graphs/TotalAttendanceGraph";
import TotalStudentsGraphjs from "../Graphs/TotalStudentsGraph";
import TopRankingStudents from "../Graphs/TopRankingStudents";
import Library from "../LibraryModule/Library";
import NoticeBoard from "../NoticeModule/NoticeBoard";
import Events from "../EventModule/Event";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../config/permission";

const TeacherSection = () => {
  return (
    <div className="w-full h-full overflow-hidden">
      {/* First Row */}
      <div className="flex flex-wrap justify-between items-start border-y h-auto relative max-w-screen">
        {/* Middle Vertical Divider */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 border-l border-gray-300 "></div>
        <div className="w-full md:w-1/2 p-2 h-full flex items-center justify-center ">
          <div className="w-full h-full">
            <ProtectedSection requiredPermission={PERMISSIONS.GET_ATTENDANCE_STATS} title={"Total Attendance Graph"}>
              <TotalAttendanceGraph />
            </ProtectedSection>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-2 h-full flex items-center justify-center">
          <div className="w-full h-full">
            <ProtectedSection requiredPermission={PERMISSIONS.GET_TOP_STUDENTS} title={"Top Ranking Students"}>
              <TopRankingStudents />
            </ProtectedSection>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="flex flex-wrap items-start justify-between border-y relative max-w-screen">
        {/* Middle Vertical Divider */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 border-l border-gray-300"></div>
        <div className="w-[50%] p-2 h-full flex items-center justify-center">
          <div className="w-full h-full">
            <ProtectedSection requiredPermission={PERMISSIONS.GET_ALL_STUDENTS} title={"Total Students Graph"}>
              <TotalStudentsGraphjs />
            </ProtectedSection>
          </div>
        </div>
        <div className="w-[50%] p-2 h-full flex items-center justify-center">
          <div className="w-full h-full">
            <ProtectedSection requiredPermission={PERMISSIONS.VIEW_LIBRARIAN} title={"Library"}>
              <Library />
            </ProtectedSection>
          </div>
        </div>
      </div>


      {/* Third Row */}
      <div className="flex flex-wrap items-start justify-between border-y relative max-w-screen">
        {/* Middle Vertical Divider */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 border-l border-gray-300"></div>
        <div className="w-full md:w-1/2 p-2 h-full flex items-center justify-center">
          <div className="w-full h-full">
            <ProtectedSection requiredPermission={PERMISSIONS.VIEW_NOTICE} title={"Notices"}>
              <NoticeBoard descriptionLength={58} />
            </ProtectedSection>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-2 h-full flex items-center justify-center">
          <div className="w-full h-full">
            <ProtectedSection requiredPermission={PERMISSIONS.VIEW_EVENTS} title={"Events"}>
              <Events descriptionLength={58} />
            </ProtectedSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSection;
