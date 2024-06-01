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
    <div className="min-h-screen ">
      <div className="max-w-6xl w-full p-2">
        <div className="flex flex-wrap lg:mx-7 justify-between p-2 px-8">
          {cardData?.map((item, index) => (
            <DashCard key={index} {...item} />
          ))}
        </div>
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/2">
            <TotalAttendanceGraph />
          </div>
          <div className="w-full md:w-1/2">
            <TotalEarningsGraph />
          </div>
        </div>
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-2/3">
            <TopRankingStudents />
          </div>
          <div className="w-full md:w-1/3">
            <TotalStudentsGraphjs />
          </div>
        </div>
        <div className="flex flex-wrap mt-3 justify-between ">
          <div className="w-full md:w-1/2">
            <BestPerformersChart data={performanceData} />
          </div>
          <div className="w-full md:w-1/2">
            <Library />
          </div>
        </div>

        <div className="flex flex-wrap justify-between ">
          <div className="w-full md:w-1/2">
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
