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
          <div className="w-full h-full flex flex-col md:w-2/5 p-2 border-r border-gray-300">
            <TotalStudentsGraphjs />
          </div>
          <div className="w-full md:w-3/5 p-4">
            <Library />
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
  );
};

export default TeacherSection;
