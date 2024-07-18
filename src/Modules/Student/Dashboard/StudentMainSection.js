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
         
          <div className="w-[30%]    ">
             {/* left slider */}
             <div className="px-5">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-gray-800 font-semibold">My Subject</h2>
            <p className="text-sm text-purple-500 cursor-pointer font-bold">See all</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">A total of 5 Courses are in Progress</p>
          </div>
        </div>
            <AllSubjects />
          </div>
          {/* right side  */}
          <div className="w-[70%] flex flex-col flex-wrap border p-2">
            <div className="    w-full    ">
             <div className="flex justify-center items-center w-full  py-10 ">
      {/* <AttendanceChart /> */}
      <AttendanceDashboard />
    </div>
            </div>
            <div className="p-5 gap-3   flex flex-row  items-center w-[100%] justify-around ">
              <div className="w-[100%] flex flex-col  border  ">
                <span>Student grade</span>
                <StudentGradePieChart />
              </div>
              <div className=" flex flex-col w-[100%]  border  ">
                <span>Task</span>

                <TaskCompletionChart />
              </div>
            </div>
          </div>
        </div>
        <div className="flex p-4 border">
          <div className="w-[65%]  p-2 border ">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-lg font-semibold text-gray-800 font-semibold">Recent Exam Results</h4>
            <p className="text-sm text-purple-500 cursor-pointer font-bold">See All</p>
          </div>
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
