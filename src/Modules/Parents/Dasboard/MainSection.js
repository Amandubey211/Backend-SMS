import React from "react";
import DashCard from "../Dasboard/Dashcard.js";
// import TotalAttendanceGraph from "./Graphs/TotalAttendanceGraph";
import { cardData } from "../Dasboard/DashboardData/CardData.js";
import ParentAccounting from "../Accounting/MainSection/ParentAccounts.js";
import StudentParentCard from "../Dasboard/DashboardData/Students.js";
// import TotalEarningsGraph from "./Graphs/TotalEarningsGraph";
// import TotalStudentsGraphjs from "./Graphs/TotalStudentsGraph.js";
// import TopRankingStudents from "./Graphs/TopRankingStudents.js";
// import Library from "./LibraryModule/Library.js";
// import Events from "./EventModule/Event.js";
// import BestPerformersChart from "./Graphs/BestPerformancGraph.js";
// import performanceData from "./DashboardData/PerformanceData.js";
import NoticeBoard from "../Dasboard/NoticeModule/NoticeBoard.js";

const  ParentSection = () => {
  return (
    <div className="h-full  w-full">
      <div className=" w-full p-2">
        <div className="flex flex-wrap justify-center gap-3 py-4 ">
          {cardData?.map((item, index) => (
            <DashCard key={index} {...item} />
          ))}
        </div>
        {/* <div className="flex flex-wrap justify-between items-start border-y">
          <div className="w-full md:w-1/2 border-r">
            <TotalAttendanceGraph />
          </div>
          <div className="w-full md:w-1/2">
            <TotalEarningsGraph />
          </div>
        </div> */}
        {/* <div className="flex flex-wrap justify-between items-start border-y">
          <div className="w-full md:w-2/3 h-full border-r">
            <TopRankingStudents />
          </div>
          <div className="w-full h-full flex flex-col md:w-1/3 ps-3">
            <TotalStudentsGraphjs />
          </div>
        </div> */}
        {/* <div className="flex flex-wrap items-start justify-between border-y   ">
          <div className="w-full md:w-1/2  border-r flex flex-col  justify-center">
            <BestPerformersChart data={performanceData} />
          </div>
          <div className="w-full md:w-1/2 ">
            <Library />
          </div>
        </div> */}

        <div className="flex flex-wrap justify-between items-start  border-y">
          <div className="w-full md:w-1/2 border-r" >
            <StudentParentCard />
          </div>
          <div className="w-full md:w-1/2 border-r" >
            <NoticeBoard />
          </div>




        </div>
        <div className="flex flex-wrap justify-between items-start  border-y">
          <div className="w-full  border-r" >
            <ParentAccounting />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentSection;
