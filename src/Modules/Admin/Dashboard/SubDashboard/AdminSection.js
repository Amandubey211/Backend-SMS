import React from "react";
import TotalAttendanceGraph from "../Graphs/TotalAttendanceGraph";
import TotalEarningsGraph from "../Graphs/TotalEarningsGraph";
import TotalStudentsGraphjs from "../Graphs/TotalStudentsGraph";
import TopRankingStudents from "../Graphs/TopRankingStudents";
import BestPerformersChart from "../Graphs/BestPerformancGraph";
import Library from "../LibraryModule/Library";
import Events from "../EventModule/Event";
import NoticeBoard from "../NoticeModule/NoticeBoard";
import performanceData from "../DashboardData/PerformanceData";

const AdminSection = () => {
  return (
    <>
      <div className="flex flex-wrap justify-between items-start border-y h-auto">
        <div className="w-full md:w-1/2 p-2 border-r border-grey-300   h-[inherit] ">
          <TotalAttendanceGraph />
        </div>
        <div className="w-full md:w-1/2 p-2 ">
           <TotalEarningsGraph /> 
        </div>
      </div>

      <div className="flex flex-wrap justify-between items-start border-y h-[33rem] relative">
        <div className="absolute left-2/3 transform -translate-x-1/2 h-full border-l border-gray-300"></div>
        <div className="w-full md:w-2/3 h-full p-2">
           <TopRankingStudents />  
        </div>
        <div className="w-full h-full flex flex-col md:w-1/3 p-2">
            <TotalStudentsGraphjs />  
        </div>
      </div>
     {/* <div className="flex flex-wrap items-start justify-between border-y relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full border-l border-gray-300"></div>
         <div className="w-full md:w-1/2 p-2">
           <BestPerformersChart data={performanceData} /> 
        </div> 
        
      </div>*/}
    
      <div className="flex flex-wrap justify-between items-start border-y relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full border-l border-gray-300"></div>
        <div className="w-full md:w-1/2 p-2">
          <NoticeBoard descriptionLength={58} /> 
        </div>
        <div className="w-full md:w-1/2 ">
           <Events /> 
        </div>
     
      </div>
      <div className="w-full md:w-full">
           <Library /> 
        </div>
    </>
  );
};

export default AdminSection;
