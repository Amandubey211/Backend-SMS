import React, { useEffect, useState } from "react";
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
import axios from "axios";
const StudentMainSection = () => {
  const [cardData, setCardData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [paidFees, setPaidFees] = useState(0);
  const [unpaidFees, setUnpaidFees] = useState(0);

  const fetchDashboardDetails = async () => {
    const token = localStorage.getItem('student:token')
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/studentDashboard/dashboard/student`,
        {
          headers: {
            Authentication: token
          }
        }
      ); // Replace with your API endpoint
      const { data } = response.data;

      const formattedData = [
        { label: 'Upcoming Exam', value: data.upcomingExam, bgColor: 'bg-red-100', textColor: 'text-red-500', icon: '📝' },
        { label: 'Due Fees', value: data.dueFees, bgColor: 'bg-red-100', textColor: 'text-red-500', icon: '💸' },
        { label: 'Event', value: data.events, bgColor: 'bg-blue-100', textColor: 'text-blue-500', icon: '📅' },
        { label: 'Notice', value: data.notices, bgColor: 'bg-yellow-100', textColor: 'text-yellow-500', icon: '🔔' },
      ];

      setCardData(formattedData);
      setSubjects(data.subjects);
      setPaidFees(data.totalPaidFees);
      setUnpaidFees(data.dueFees);
    } catch (error) {
      console.error('Error fetching dashboard details:', error);
    }
  };

  useEffect(() => {
    fetchDashboardDetails();
  }, []);

  return (
    <>
      <div className=" flex flex-col border-b border-gray-200">
        <div>
          <div className="border-b border-gray-200 flex flex-wrap justify-center gap-3 py-4 ">
            {cardData?.map((item, index) => (
              <DashCard key={index} {...item} />
            ))}
          </div>
        </div>
        <div className="flex flex-1   w-full">

          <div className="w-[30%]">
            {/* left slider */}
            <div className="p-5">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-gray-800 font-semibold">My Subject</h2>
                <p className="text-sm text-purple-500 cursor-pointer font-bold">See all</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">A total of {subjects.length} Courses are in Progress</p>
              </div>
            </div>
            <AllSubjects subjects={subjects} />
          </div>
          {/* right side  */}
          <div className="w-[70%] flex flex-col flex-wrap border-l border-r">
            <div className="w-full">
              <div className="flex justify-center items-center w-full py-5 ">
                {/* <AttendanceChart /> */}
                <AttendanceDashboard />
              </div>
            </div>
            <div className="flex flex-row items-center w-full justify-around">
              <div className="flex flex-col border-t  border-gray-200 w-1/2 h-full">
                <div>
                  <div className="border-b border-gray-300 w-full py-5">
                    <h1 className="text-xl px-2">Student Grade</h1>
                  </div>
                  <div className="flex justify-between px-2 py-5 w-full">
                    <p>Total Point: 90%</p>
                    <select className="select-exam-type">
                      <option value="exam-type">Exam Type</option>
                      <option value="practical-exam">Practical Exam</option>
                    </select>
                  </div>
                </div>
                <div className="flex-1">
                  <StudentGradePieChart />
                </div>
              </div>
              <div className="flex flex-col border-t  border-l border-gray-200 w-1/2 h-full">
                <div>
                  <div className="w-full py-5">
                    <h1 className="text-xl px-2 mb-2">Task</h1>
                    <p className="px-2">5/12 assignments have been completed</p>
                  </div>
                </div>
                <div className="flex-1">
                  <TaskCompletionChart />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex border">
          <div className="w-[65%] ">
            <div className="flex justify-between items-center p-4">
              <h4 className="text-lg font-semibold text-gray-800 font-semibold">Recent Exam Results</h4>
              <p className="text-sm text-purple-500 cursor-pointer font-bold">See All</p>
            </div>
            <StudentRecentGradeTable />
          </div>
          <div className=" border-l border-gray-300 w-[35%]">
            <div className=" flex flex-col border-b border-gray-200 py-5">
              <StudentDashFeeCard
                title="Total Unpaid Fees"
                amount={unpaidFees}
                unpaidFees={unpaidFees}
                buttonText="Pay Now"
              />
            </div>
            <div className="flex flex-col py-5">
              <StudentDashFeeCard
                title="Total Paid Fees"
                amount={paidFees}
                unpaidFees={paidFees}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentMainSection;
