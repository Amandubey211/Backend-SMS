import React from "react";
import LibraryTable from "../../../Components/Parents/Libary/LibraryList";

// import TotalAttendanceGraph from "./Graphs/TotalAttendanceGraph";
// import TotalEarningsGraph from "./Graphs/TotalEarningsGraph";
// import TotalStudentsGraphjs from "./Graphs/TotalStudentsGraph.js";
// import TopRankingStudents from "./Graphs/TopRankingStudents.js";
// import Library from "./LibraryModule/Library.js";
// import Events from "./EventModule/Event.js";
// import BestPerformersChart from "./Graphs/BestPerformancGraph.js";
// import performanceData from "./DashboardData/PerformanceData.js";
const ParentSection = () => {
  return (
    <div className="h-full  w-full">
      <div className=" w-full p-2">
        
        
        <div className="flex flex-wrap justify-between items-start  border-y">
          <div className="w-full  border-r" >
            <LibraryTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentSection;
