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
            <ProtectedSection requiredPermission={PERMISSIONS.VIEW_ATTENDANCE}>
              <TotalAttendanceGraph />
            </ProtectedSection>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-2 h-full flex items-center justify-center">
          <div className="w-full h-full">
            <ProtectedSection requiredPermission={PERMISSIONS.VIEW_TOP_RANKING}>
              <TopRankingStudents />
            </ProtectedSection>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="flex flex-wrap justify-between items-start border-y h-[33.4375rem] relative max-w-screen">
        {/* Middle Vertical Divider */}
        <div className="absolute left-2/5 transform translate-x-1/2 top-0 bottom-0 "></div>
        <div className=" w-[35%]  p-2 h-auto flex items-center justify-center">
          <div className="w-auto h-full">
            <ProtectedSection requiredPermission={PERMISSIONS.VIEW_STUDENTS}>
              <TotalStudentsGraphjs />
            </ProtectedSection>
          </div>
        </div>
        <div className="w-[65%] p-2 h-auto flex items-center justify-center">
          <div className="w-full h-full">
            <ProtectedSection requiredPermission={PERMISSIONS.VIEW_LIBRARY}>
              <Library />
            </ProtectedSection>
          </div>
        </div>
      </div>

      {/* Third Row */}
      <div className="flex flex-wrap items-start justify-between border-y h-[400px] relative max-w-screen">
        {/* Middle Vertical Divider */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 border-l border-gray-300"></div>
        <div className="w-full md:w-1/2 p-2 h-full flex items-center justify-center">
          <div className="w-full h-full">
            <ProtectedSection requiredPermission="viewNotices">
              <NoticeBoard descriptionLength={58} />
            </ProtectedSection>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-2 h-full flex items-center justify-center">
          <div className="w-full h-full">
            <ProtectedSection requiredPermission={PERMISSIONS.VIEW_NOTICES}>
              <NoticeBoard descriptionLength={58} />
            </ProtectedSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSection;
