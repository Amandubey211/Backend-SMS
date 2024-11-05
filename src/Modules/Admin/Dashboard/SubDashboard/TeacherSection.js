import React from "react";
import TotalAttendanceGraph from "../Graphs/TotalAttendanceGraph";
import TotalStudentsGraphjs from "../Graphs/TotalStudentsGraph";
import TopRankingStudents from "../Graphs/TopRankingStudents";
import Library from "../LibraryModule/Library";
import NoticeBoard from "../NoticeModule/NoticeBoard";
import Events from "../EventModule/Event";

const TeacherSection = () => {
  return (
    <>
      {/* First Row */}
      <div className="flex flex-wrap justify-between items-start border-y h-auto relative">
        <div className="w-full md:w-1/2 p-2 border-r border-gray-300">
          <TotalAttendanceGraph />
        </div>
        <div className="w-full md:w-1/2 p-2">
          <TopRankingStudents />
        </div>
        {/* Middle Vertical Divider */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 border-l border-gray-300"></div>
      </div>

      {/* Second Row */}
      <div className="flex flex-wrap justify-between items-start border-y h-auto relative">
        <div className="w-full md:w-2/5 p-2 border-r border-gray-300">
          <TotalStudentsGraphjs />
        </div>
        <div className="w-full md:w-3/5 p-4">
          <Library />
        </div>
        {/* Middle Vertical Divider */}
        <div className="absolute left-2/5 transform translate-x-1/2 top-0 bottom-0 border-l border-gray-300"></div>
      </div>

      {/* Third Row */}
      <div className="flex flex-wrap items-start justify-between border-y h-auto relative">
        <div className="w-full md:w-1/2 p-2 border-r border-gray-300">
          <NoticeBoard descriptionLength={58} />
        </div>
        <div className="w-full md:w-1/2 p-2">
          <Events />
        </div>
        {/* Middle Vertical Divider */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 border-l border-gray-300"></div>
      </div>
    </>
  );
};

export default TeacherSection;
