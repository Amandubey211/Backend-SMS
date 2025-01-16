import React from "react";
import TotalAttendanceGraph from "../Graphs/TotalAttendanceGraph";
import TotalEarningsGraph from "../Graphs/TotalEarningsGraph";
import TotalStudentsGraphjs from "../Graphs/TotalStudentsGraph";
import TopRankingStudents from "../Graphs/TopRankingStudents";
import Library from "../LibraryModule/Library";
import Events from "../EventModule/Event";
import NoticeBoard from "../NoticeModule/NoticeBoard";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../config/permission";
const AdminSection = () => {
  return (
    <div className="w-full h-full overflow-hidden">
      {/* First Row: Attendance and Earnings */}
      <div className="flex flex-wrap justify-between items-start border-y h-full relative max-w-screen">
        <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 border-l border-gray-300"></div>
        <div className="w-full md:w-1/2 p-2 h-full flex items-center justify-center">
          <div className="w-full h-full">
          <ProtectedSection requiredPermission={PERMISSIONS.VIEW_ATTENDANCE}>
              <TotalAttendanceGraph />
            </ProtectedSection>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-2 h-full flex items-center justify-center">
          <div className="w-full h-full">
          <ProtectedSection requiredPermission={PERMISSIONS.VIEW_EARNINGS}>
              <TotalEarningsGraph />
            </ProtectedSection>
          </div>
        </div>
      </div>

      {/* Second Row: Top Ranking and Total Students with Middle Divider */}
      <div className="flex flex-wrap justify-between items-start border-y h-full relative max-w-screen">
        <div className="absolute left-2/3 transform -translate-x-1/2 top-0 bottom-0 border-l border-gray-300"></div>
        <div className="w-full md:w-2/3 h-full p-2 flex items-center justify-center">
          <div className="w-full h-full">
          <ProtectedSection requiredPermission={PERMISSIONS.VIEW_TOP_RANKING}>
              <TopRankingStudents />
            </ProtectedSection>
          </div>
        </div>
        <div className="w-full md:w-1/3 h-full p-2 flex items-center justify-center">
          <div className="w-full h-full">
          <ProtectedSection requiredPermission={PERMISSIONS.VIEW_STUDENTS}>
              <TotalStudentsGraphjs />
            </ProtectedSection>
          </div>
        </div>
      </div>

      {/* Third Row: Notice Board and Events with Middle Divider */}
      <div className="flex flex-wrap justify-between items-start border-y h-full relative max-w-screen">
        <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 border-l border-gray-300"></div>
        <div className="w-full md:w-1/2 p-2 h-full flex items-center justify-center">
          <div className="w-full h-full">
          <ProtectedSection requiredPermission={PERMISSIONS.VIEW_NOTICES}>
              <NoticeBoard descriptionLength={58} />
            </ProtectedSection>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-2 h-full flex items-center justify-center">
          <div className="w-full h-full">
          <ProtectedSection requiredPermission={PERMISSIONS.VIEW_EVENTS}>
              <Events />
            </ProtectedSection>
          </div>
        </div>
      </div>

      {/* Full Width Library Section */}
      <div className="w-full p-4 h-full flex items-center justify-center max-w-screen">
        <div className="w-full h-full">
          <ProtectedSection requiredPermission={PERMISSIONS.VIEW_LIBRARY}>
            <Library />
          </ProtectedSection>
        </div>
      </div>
    </div>
  );
};

export default AdminSection;
