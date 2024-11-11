import React from "react";
import TotalAttendanceGraph from "../Graphs/TotalAttendanceGraph";
import TotalStudentsGraphjs from "../Graphs/TotalStudentsGraph";
import TopRankingStudents from "../Graphs/TopRankingStudents";
import Library from "../LibraryModule/Library";
import NoticeBoard from "../NoticeModule/NoticeBoard";
import Events from "../EventModule/Event";

const TeacherSection = () => {
  return (
    <div className="w-full h-full overflow-hidden">
      {/* First Row */}
      <div className="flex flex-wrap justify-between items-start border-y h-[400px] relative max-w-screen">
        {/* Middle Vertical Divider */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 border-l border-gray-300"></div>
        <div className="w-full md:w-1/2 p-2 h-full flex items-center justify-center">
          <div className="w-full h-full">
            <TotalAttendanceGraph />
          </div>
        </div>
        <div className="w-full md:w-1/2 p-2 h-full flex items-center justify-center">
          <div className="w-full h-full">
            <TopRankingStudents />
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="flex flex-wrap justify-between items-start border-y h-[400px] relative max-w-screen">
        {/* Middle Vertical Divider */}
        <div className="absolute left-2/5 transform translate-x-1/2 top-0 bottom-0 border-l border-gray-300"></div>
        <div className="w-full md:w-2/5 p-2 h-full flex items-center justify-center">
          <div className="w-full h-full">
            <TotalStudentsGraphjs />
          </div>
        </div>
        <div className="w-full md:w-3/5 p-4 h-full flex items-center justify-center">
          <div className="w-full h-full">
            <Library />
          </div>
        </div>
      </div>

      {/* Third Row */}
      <div className="flex flex-wrap items-start justify-between border-y h-[400px] relative max-w-screen">
        {/* Middle Vertical Divider */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 border-l border-gray-300"></div>
        <div className="w-full md:w-1/2 p-2 h-full flex items-center justify-center">
          <div className="w-full h-full">
            <NoticeBoard descriptionLength={58} />
          </div>
        </div>
        <div className="w-full md:w-1/2 p-2 h-full flex items-center justify-center">
          <div className="w-full h-full">
            <Events />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSection;
