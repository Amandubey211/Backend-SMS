import React from "react";
import DashCard from "./Dashcard.js";
// import TotalAttendanceGraph from "./Graphs/TotalAttendanceGraph.js";
import { cardData } from "./DashboardData/CardData.js";
// import TotalEarningsGraph from "./Graphs/TotalEarningsGraph.js";
// import TotalStudentsGraphjs from "./Graphs/TotalStudentsGraph.js";
// import TopRankingStudents from "./Graphs/TopRankingStudents.js";
// import Library from "./LibraryModule/Library.js";
// import Events from "./EventModule/Event.js";
// import BestPerformersChart from "./Graphs/BestPerformancGraph.js";
// import performanceData from "./DashboardData/PerformanceData.js";
// import noticeData from "./DashboardData/NoticeData.js";
// import Notice from "./NoticeModule/Notice.js";
// import NoticeBoard from "./NoticeModule/NoticeBoard.js";
// import SubjectsSlider from "./DashBoardComponents/allSubjects/SubjectsSlider.js";
import AllSubjects from "./DashBoardComponents/allSubjects/AllSubjects.js";
import AttendanceChart from "./DashBoardComponents/Charts/AttendanceChart.js";
import StudentGradePieChart from "./DashBoardComponents/Charts/StudentGradePieChart.js";
import TaskCompletionChart from "./DashBoardComponents/Charts/TaskCompletionChart.js";
import StudentRecentGradeTable from "./DashBoardComponents/StudentRecentGradeTable.js";
import StudentDashFeeCard from "./DashBoardComponents/StudentDashFeeCard.js";
import AttendanceDashboard from "./DashBoardComponents/Charts/AttendanceDashboard.js";

const StudentMainSection = () => {
  return (
    <>
      <div className=" flex flex-col h-screen  ">
        <div>
          <div className=" border  flex flex-wrap justify-center gap-3 py-4 ">
            {cardData?.map((item, index) => (
              <DashCard key={index} {...item} />
            ))}
          </div>
        </div>
        <div className="flex flex-1 py-10 border   w-full">
          {/* left slider */}
          <div className="w-[30%]    ">
            <AllSubjects />
          </div>
          {/* right side  */}
          <div className="w-[70%] flex flex-col flex-wrap border p-2">
            <div className="    w-full border   ">
              <div className=" border  px-32    w-full ">
                {/* <AttendanceChart /> */}
                <AttendanceDashboard/>
              </div>
            </div>
            <div className="p-10 gap-3 border  flex flex-row  items-center  justify-around ">
              <div className="w-[50%] flex flex-col  border  ">
                <span>Student grade</span>
                <StudentGradePieChart />
              </div>
              <div className=" flex flex-col w-[50%]  border  ">
              <span>Task</span>

                <TaskCompletionChart />
              </div>
            </div>
          </div>
        </div>
        <div className="flex p-4 border ">
          <div className="w-[65%]  p-2 ">
            <StudentRecentGradeTable />
          </div>
          <div className=" border-l border-gray-600 w-[35%] py-2 px-5 ">
            <div className=" flex flex-col gap-2 ">
              <StudentDashFeeCard
                title="Paid Fees"
                amount={5000}
                unpaidFees={0} // Assuming there are no unpaid fees for this
               
              />
           
            
              <StudentDashFeeCard
                title="UnPaid Fees"
                amount={0}
                unpaidFees={2200} // Assuming there are no unpaid fees for this
                 buttonText="Pay Now"
              />
            </div>
          </div>
        </div>
      </div>
      {/* <AttendanceChart /> */}
    </>
  );
};

export default StudentMainSection;
// import React from "react";
// import DashCard from "./Dashcard.js";
// import TotalAttendanceGraph from "./Graphs/TotalAttendanceGraph.js";
// import { cardData } from "./DashboardData/CardData.js";
// import TotalEarningsGraph from "./Graphs/TotalEarningsGraph.js";
// import TotalStudentsGraphjs from "./Graphs/TotalStudentsGraph.js";
// import TopRankingStudents from "./Graphs/TopRankingStudents.js";
// import Library from "./LibraryModule/Library.js";
// import Events from "./EventModule/Event.js";
// import BestPerformersChart from "./Graphs/BestPerformancGraph.js";
// import performanceData from "./DashboardData/PerformanceData.js";
// import noticeData from "./DashboardData/NoticeData.js";
// import Notice from "./NoticeModule/Notice.js";
// import NoticeBoard from "./NoticeModule/NoticeBoard.js";
// import SubjectsSlider from "./allSubjects/SubjectsSlider.js";
// import AllSubjects from "./allSubjects/AllSubjects.js";

// const StudentMainSection = () => {
//   return (
//     <div className="h-full">
//       <div className=" w-full p-2">
// <div className="flex flex-wrap justify-center gap-3 py-4 ">
//   {cardData?.map((item, index) => (
//     <DashCard key={index} {...item} />
//   ))}
// </div>
//         <div className="  flex flex-wrap justify-between items-start border-y">
//           <div className="w-full md:w-1/2 border-r">
//           <AllSubjects/>
//           </div>
//           <div className="w-full md:w-1/2 flex flex-col">
//           <div>
// <TotalAttendanceGraph />

//           </div>
//           <div className="flex flex-col">
//           <TotalEarningsGraph />
//           <TotalEarningsGraph />

//           </div>

//           </div>
//         </div>
//         <div className="flex flex-wrap justify-between items-start border-y">
//           <div className="w-full md:w-2/3 h-full border-r">
//             <TopRankingStudents />
//           </div>
//           <div className="w-full h-full flex flex-col md:w-1/3 ps-3">
//             <TotalStudentsGraphjs />
//           </div>
//         </div>
//         <div className="flex flex-wrap items-start justify-between border-y   ">
//           <div className="w-full md:w-1/2  border-r flex flex-col  justify-center">
//             <BestPerformersChart data={performanceData} />
//           </div>
//           <div className="w-full md:w-1/2 ">
//             <Library />
//           </div>
//         </div>

//         <div className="flex flex-wrap justify-between items-start  border-y">
//           <div className="w-full md:w-1/2 border-r" >
//             <NoticeBoard />
//           </div>
//           <div className="w-full md:w-2/4">
//             <Events />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentMainSection;
