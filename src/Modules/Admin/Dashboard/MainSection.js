import React from "react";
import DashCard from "./Dashcard";
import TotalAttendanceGraph from "./Graphs/TotalAttendanceGraph";
import { cardData } from "./DashboardData/CardData";
import TotalEarningsGraph from "./Graphs/TotalEarningsGraph";
import TotalStudentsGraphjs from "./Graphs/TotalStudentsGraph.js";
import TopRankingStudents from "./Graphs/TopRankingStudents.js";
import Library from "./LibraryModule/Library.js";
import Events from "./EventModule/Event.js";
import BestPerformersChart from "./Graphs/BestPerformancGraph.js";
import performanceData from "./DashboardData/PerformanceData.js";
import noticeData from "./DashboardData/NoticeData.js";
import Notice from "./NoticeModule/Notice.js";
import NoticeBoard from "./NoticeModule/NoticeBoard.js";

const MainSection = () => {
  return (
    <div className="h-full">
      <div className="max-w-6xl w-full p-2">
        <div className="flex flex-wrap justify-center gap-3 py-4 ">
          {cardData?.map((item, index) => (
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
            <TotalStudentsGraphjs />
          </div>
        </div>
        <div className="flex flex-wrap items-start justify-between border-y   ">
          <div className="w-full md:w-1/2  border-r flex flex-col  justify-center">
            <BestPerformersChart data={performanceData} />
          </div>
          <div className="w-full md:w-1/2 ">
            <Library />
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-start  border-y">
          <div className="w-full md:w-1/2 border-r" >
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
