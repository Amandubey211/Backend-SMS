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
import { Link, useNavigate } from "react-router-dom";

const StudentMainSection = () => {
  const navigate = useNavigate();
  const [cardData, setCardData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [paidFees, setPaidFees] = useState(0);
  const [unpaidFees, setUnpaidFees] = useState(0);

  // Get necessary values from user slice instead of common slice
  const { selectedClass, selectedSection } = useSelector(
    (state) => state.common.user.classInfo // Updated to get from the user slice
  );
  // const { studentId } = useSelector((state) => state.common.user.userDetails); // Updated to get from userDetails

  const fetchDashboardDetails = async () => {
    const token = localStorage.getItem("student:token");

    try {
      const [dashboardResponse] = await Promise.all([
        axios.get(`${baseUrl}/api/studentDashboard/dashboard/student`, {
          headers: {
            Authentication: token,
          },
        }),
      ]);

      const dashboardData = dashboardResponse.data;

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
      ];

      setCardData(formattedData);
      setSubjects(dashboardData?.data?.subjects);
      setPaidFees(dashboardData?.data?.totalPaidFees);
      setUnpaidFees(dashboardData?.data?.dueFees);
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
                <Link to="/student_class">See all</Link>
              </p>
            </div>
            <p className="text-sm text-gray-500">
              A total of {subjects?.length} Courses are in Progress
            </p>
          </div>
          <AllSubjects subjects={subjects} />
        </div>
        <div className="w-[70%] flex flex-col flex-wrap border-l border-r">
          <div className="w-full ">
            <AttendanceDashboard />
          </div>
          <div className="flex  flex-row items-center w-full justify-around">
            <div className="flex flex-col border-gray-200 w-1/2">
              <div className=" border-gray-300 w-full pt-5 pb-3 ps-2">
                <h1 className="text-xl px-2">Student Grade</h1>
              </div>
              <div className="flex justify-between px-3 w-full ps-4">
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
            <div className="flex flex-col  border-l border-gray-200 w-1/2">
              <div className="w-full py-5 ps-3 ">
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
