// import React, { useEffect, useState } from "react";
// import DashCard from "./Dashcard.js";
// // import TotalAttendanceGraph from "./Graphs/TotalAttendanceGraph.js";
// import { cardData } from "./DashboardData/CardData.js";

// import AllSubjects from "./DashBoardComponents/allSubjects/AllSubjects.js";
// import AttendanceChart from "./DashBoardComponents/Charts/AttendanceChart.js";
// import StudentGradePieChart from "./DashBoardComponents/Charts/StudentGradePieChart.js";
// import TaskCompletionChart from "./DashBoardComponents/Charts/TaskCompletionChart.js";
// import StudentRecentGrade from "./DashBoardComponents/StudentRecentGrade.js";
// // import StudentRecentGradeTable from "./DashBoardComponents/StudentRecentGradeTable.js";
// import StudentDashFeeCard from "./DashBoardComponents/StudentDashFeeCard.js";
// import AttendanceDashboard from "./DashBoardComponents/Charts/AttendanceDashboard.js";
// import axios from "axios";
// import { baseUrl } from "../../../config/Common.js";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

// const StudentMainSection = () => {
//   // const{studentId}=useSelector((state)=>state.common)
//   const navigate = useNavigate();

//   const [cardData, setCardData] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [paidFees, setPaidFees] = useState(0);
//   const [unpaidFees, setUnpaidFees] = useState(0);
//   const { selectedClass, studentId, selectedSection, selectedSubject } =
//     useSelector((state) => state.Common);

//   const fetchDashboardDetails = async () => {
//     // const { selectedClass, studentId,selectedSection, selectedSubject } = useSelector((state) => state.Common);

//     const token = localStorage.getItem("student:token");
//     try {
//       // const response = await axios.get(`${baseUrl}/api/studentDashboard/dashboard/student`,
//       const response = await axios.get(
//         `${baseUrl}/api/studentDashboard/${studentId}/realDashboard`,
//         {
//           headers: {
//             Authentication: token,
//           },
//         }
//       ); // Replace with your API endpoint
//       const { data } = response.data;
//       console.log("response in dashboard", response);
//       // console.log("response in dashboard",data)
//       const formattedData = [
//         {
//           label: "Upcoming Exam",
//           value: data.upcomingExam,
//           bgColor: "bg-green-100",
//           textColor: "text-black-500",
//           icon: "📝",
//         },
//         {
//           label: "Due Fees",
//           value: data.dueFees,
//           bgColor: "bg-red-100",
//           textColor: "text-black-500",
//           icon: "💸",
//         },
//         {
//           label: "Event",
//           value: data.events,
//           bgColor: "bg-blue-100",
//           textColor: "text-black-500",
//           icon: "📅",
//         },
//         {
//           label: "Notice",
//           value: data.notices,
//           bgColor: "bg-yellow-100",
//           textColor: "text-black-500",
//           icon: "🔔",
//         },
//       ];

//       setCardData(formattedData);
//       setSubjects(data.subjects);
//       setPaidFees(data.totalPaidFees);
//       setUnpaidFees(data.dueFees);
//     } catch (error) {
//       console.error("Error fetching dashboard details:", error);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardDetails();
//   }, []);

//   return (
//     <>
//       <div className=" flex flex-col border-b border-gray-200">
//         <div>
//           <div className="border-b border-gray-200 flex flex-wrap justify-center gap-3 py-4 ">
//             {cardData?.map((item, index) =>

//             {
//               console.log("border-b border-gray-200 flex flex-wrap justify-center gap-3 py-4 ",item)
//               return  (
//               <DashCard key={index} {...item} />
//             )
//             }
//             )}
//           </div>
//         </div>
//         <div className="flex flex-1   w-full">
//           <div className="w-[30%]">
//             {/* left slider */}
//             <div className="p-5">
//               <div className="flex justify-between items-center mb-2">
//                 <h2 className="text-lg font-semibold text-gray-800 font-semibold">
//                   My Subject
//                 </h2>
//                 <p className="text-sm text-purple-500 cursor-pointer font-bold">
//                   See all
//                 </p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">
//                   A total of {subjects.length} Courses are in Progress
//                 </p>
//               </div>
//             </div>
//             <AllSubjects subjects={subjects} />
//           </div>
//           {/* right side  */}
//           <div className="w-[70%] flex flex-col flex-wrap border-l border-r">
//             <div className="w-full">
//               <div className="flex justify-center items-center w-full py-5 ">
//                 {/* <AttendanceChart /> */}
//                 <AttendanceDashboard />
//               </div>
//             </div>
//             <div className="flex flex-row items-center w-full justify-around">
//               <div className="flex flex-col border-t  border-gray-200 w-1/2 h-full">
//                 <div>
//                   <div className="border-b border-gray-300 w-full py-5">
//                     <h1 className="text-xl px-2">Student Grade</h1>
//                   </div>
//                   <div className="flex justify-between px-2 py-5 w-full">
//                     <p>Total Point: 90%</p>
//                     <select className="select-exam-type">
//                       <option value="exam-type">Exam Type</option>
//                       <option value="practical-exam">Practical Exam</option>
//                     </select>
//                   </div>
//                 </div>
//                 <div className="flex-1">
//                   <StudentGradePieChart />
//                 </div>
//               </div>
//               <div className="flex flex-col border-t  border-l border-gray-200 w-1/2 h-full">
//                 <div>
//                   <div className="w-full py-5">
//                     <h1 className="text-xl px-2 mb-2">Task</h1>
//                     <p className="px-2">5/12 assignments have been completed</p>
//                   </div>
//                 </div>
//                 <div className="flex-1">
//                   <TaskCompletionChart />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="flex border">
//           <div className="w-[65%] ">
//             <div className="flex justify-between items-center p-4">
//               <h4 className="text-lg font-semibold text-gray-800 font-semibold">
//                 Recent Exam Results
//               </h4>
//               <p
//                 onClick={() => {
//                   navigate(
//                     `/student_class/${selectedClass}/${selectedSection}/grades`
//                   );
//                 }}
//                 className="text-sm text-purple-500 cursor-pointer font-bold"
//               >
//                 See All
//               </p>
//             </div>
//             <StudentRecentGrade />
//             {/* <StudentRecentGradeTable /> */}
//           </div>
//           <div className=" border-l border-gray-300 w-[35%]">
//             <div className=" flex flex-col border-b border-gray-200 py-5">
//               <StudentDashFeeCard
//                 title="Total Unpaid Fees"
//                 amount={unpaidFees}
//                 unpaidFees={unpaidFees}
//                 buttonText="Pay Now"
//               />
//             </div>
//             <div className="flex flex-col py-5">
//               <StudentDashFeeCard
//                 title="Total Paid Fees"
//                 amount={paidFees}
//                 unpaidFees={paidFees}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default StudentMainSection;

import React, { useEffect, useState } from "react";
import DashCard from "./Dashcard.js";
import AllSubjects from "./DashBoardComponents/allSubjects/AllSubjects.js";
import AttendanceDashboard from "./DashBoardComponents/Charts/AttendanceDashboard.js";
import StudentGradePieChart from "./DashBoardComponents/Charts/StudentGradePieChart.js";
import TaskCompletionChart from "./DashBoardComponents/Charts/TaskCompletionChart.js";
import StudentRecentGrade from "./DashBoardComponents/StudentRecentGrade.js";
import StudentDashFeeCard from "./DashBoardComponents/StudentDashFeeCard.js";
import axios from "axios";
import { baseUrl } from "../../../config/Common.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const StudentMainSection = () => {
  const navigate = useNavigate();
  const [cardData, setCardData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [paidFees, setPaidFees] = useState(0);
  const [unpaidFees, setUnpaidFees] = useState(0);
  const { selectedClass, studentId, selectedSection } = useSelector(
    (state) => state.Common
  );

  const fetchDashboardDetails = async () => {
    const token = localStorage.getItem("student:token");

    try {
      // Make both API requests simultaneously
      const [dashboardResponse, realDashboardResponse] = await Promise.all([
        axios.get(`${baseUrl}/api/studentDashboard/dashboard/student`, {
          headers: {
            Authentication: token,
          },
        }),
        axios.get(
          `${baseUrl}/api/studentDashboard/${studentId}/realDashboard`,
          {
            headers: {
              Authentication: token,
            },
          }
        ),
      ]);

      const dashboardData = dashboardResponse.data;
      const realDashboardData = realDashboardResponse.data;
      console.log("dashboardData", dashboardData);
      console.log("realDashboardData", realDashboardData);
      const formattedData = [
        {
          label: "Upcoming Exam",
          value: dashboardData.data.upcomingExam,
          bgColor: "bg-green-100",
          textColor: "text-black-500",
          icon: "📝",
        },
        {
          label: "Due Fees",
          value: dashboardData.data.dueFees,
          bgColor: "bg-red-100",
          textColor: "text-black-500",
          icon: "💸",
        },
        {
          label: "Event",
          value: dashboardData.data.events,
          bgColor: "bg-blue-100",
          textColor: "text-black-500",
          icon: "📅",
        },
        {
          label: "Notice",
          value: dashboardData.data.notices,
          bgColor: "bg-yellow-100",
          textColor: "text-black-500",
          icon: "🔔",
        },
        {
          label: "Total Teachers",
          value: realDashboardData.totalTeachers,
          bgColor: "bg-purple-100",
          textColor: "text-black-500",
          icon: "👩‍🏫",
        },
        {
          label: "Total Classmates",
          value: realDashboardData.totalClassmates,
          bgColor: "bg-orange-100",
          textColor: "text-black-500",
          icon: "👨‍🎓",
        },
      ];

      setCardData(formattedData);
      setSubjects(realDashboardData.subjects);
      setPaidFees(realDashboardData.totalPaidFees);
      setUnpaidFees(realDashboardData.dueFees);
    } catch (error) {
      console.error("Error fetching dashboard details:", error);
    }
  };

  useEffect(() => {
    fetchDashboardDetails();
  }, []);

  return (
    <div className="flex flex-col border-b border-gray-200">
      <div className="border-b border-gray-200 flex flex-wrap justify-center gap-3 py-4">
        {cardData?.map((item, index) => (
          <DashCard key={index} {...item} />
        ))}
      </div>
      <div className="flex flex-1 w-full">
        <div className="w-[30%]">
          <div className="p-5">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-800">
                My Subject
              </h2>
              <p className="text-sm text-purple-500 cursor-pointer font-bold">
                See all
              </p>
            </div>
            <p className="text-sm text-gray-500">
              A total of {subjects.length} Courses are in Progress
            </p>
          </div>
          <AllSubjects subjects={subjects} />
        </div>
        <div className="w-[70%] flex flex-col flex-wrap border-l border-r">
          <div className="w-full py-5">
            <AttendanceDashboard />
          </div>
          <div className="flex flex-row items-center w-full justify-around">
            <div className="flex flex-col border-t border-gray-200 w-1/2">
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
              <div className="flex-1">
                <StudentGradePieChart />
              </div>
            </div>
            <div className="flex flex-col border-t border-l border-gray-200 w-1/2">
              <div className="w-full py-5">
                <h1 className="text-xl px-2 mb-2">Task</h1>
                <p className="px-2">5/12 assignments have been completed</p>
              </div>
              <div className="flex-1">
                <TaskCompletionChart />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex border">
        <div className="w-[65%]">
          <div className="flex justify-between items-center p-4">
            <h4 className="text-lg font-semibold text-gray-800">
              Recent Exam Results
            </h4>
            <p
              onClick={() => {
                navigate(
                  `/student_class/${selectedClass}/${selectedSection}/grades`
                );
              }}
              className="text-sm text-purple-500 cursor-pointer font-bold"
            >
              See All
            </p>
          </div>
          <StudentRecentGrade />
        </div>
        <div className="border-l border-gray-300 w-[35%]">
          <div className="flex flex-col border-b border-gray-200 py-5">
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
  );
};

export default StudentMainSection;
