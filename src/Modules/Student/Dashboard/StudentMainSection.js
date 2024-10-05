import React, { useEffect, useState } from "react";
import DashCard from "./Dashcard.js";
import AllSubjects from "./DashBoardComponents/allSubjects/AllSubjects.js";
import AttendanceDashboard from "./DashBoardComponents/Charts/AttendanceDashboard.js";
import StudentGradePieChart from "./DashBoardComponents/Charts/StudentGradePieChart.js";
import TaskCompletionChart from "./DashBoardComponents/Charts/TaskCompletionChart.js";
import StudentRecentGrade from "./DashBoardComponents/StudentRecentGrade.js";
import StudentDashFeeCard from "./DashBoardComponents/StudentDashFeeCard.js";
import axios from "axios";
import Spinner from "../../../Components/Common/Spinner";
import { baseUrl } from "../../../config/Common.js";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineBook } from "react-icons/ai";
import { IoNewspaperOutline } from "react-icons/io5";
import { PiMoneyWavyDuotone, PiMoneyWavy } from "react-icons/pi";

const StudentMainSection = () => {
  const navigate = useNavigate();
  const [cardData, setCardData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [paidFees, setPaidFees] = useState(0);
  const [unpaidFees, setUnpaidFees] = useState(0);
  const [error, setError] = useState(null);
  const [taskError, setTaskError] = useState(null);
  const [subjectError, setSubjectError] = useState(null);
  const [feesError, setFeesError] = useState(null);
  const [cache, setCache] = useState({});
  const [loading, setLoading] = useState(true); // Added loading state for data fetching

  const { selectedClass, selectedSection } = useSelector(
    (state) => state?.common?.user?.classInfo // Updated to get from the user slice with optional chaining
  );

  const formatDashboardData = (dashboardData) => {
    return [
      {
        label: "Upcoming Exam",
        value: dashboardData?.data?.upcomingExam,
        bgColor: "bg-green-100",
        textColor: "text-black-500",
        icon: "📝",
      },
      {
        label: "Due Fees",
        value: dashboardData?.data?.dueFees,
        bgColor: "bg-red-100",
        textColor: "text-black-500",
        icon: "💸",
      },
      {
        label: "Event",
        value: dashboardData?.data?.events,
        bgColor: "bg-blue-100",
        textColor: "text-black-500",
        icon: "📅",
      },
      {
        label: "Notice",
        value: dashboardData?.data?.notices,
        bgColor: "bg-yellow-100",
        textColor: "text-black-500",
        icon: "🔔",
      },
    ];
  };

  const fetchDashboardDetails = async () => {
    const token = localStorage.getItem("student:token");

    if (cache.dashboardData) {
      const { dashboardData } = cache;
      setCardData(formatDashboardData(dashboardData));
      setPaidFees(dashboardData?.data?.totalPaidFees);
      setUnpaidFees(dashboardData?.data?.dueFees);
      return;
    }

    try {
      const [dashboardResponse] = await Promise.all([
        axios.get(`${baseUrl}/api/studentDashboard/dashboard/student`, {
          headers: {
            Authentication: token,
          },
        }),
      ]);

      const dashboardData = dashboardResponse?.data;
      setCache((prev) => ({ ...prev, dashboardData }));
      setCardData(formatDashboardData(dashboardData));
      setPaidFees(dashboardData?.data?.totalPaidFees);
      setUnpaidFees(dashboardData?.data?.dueFees);
    } catch (error) {
      console.error("Error fetching dashboard details:", error);
      setError("Failed to load dashboard details. Please try again later.");
    }
  };

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("student:token");
      const response = await axios.get(`${baseUrl}/api/studentDashboard/tasks`, {
        headers: {
          Authentication: token,
        },
      });

      console.log(response.data.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTaskError("No task data available.");
    }
  };

  const fetchSubjects = async () => {
    setLoading(true); // Set loading to true when starting the fetch
    try {
      const token = localStorage.getItem("student:token");
      const persistUserString = localStorage.getItem('persist:user');
      const persistUserObject = JSON.parse(persistUserString);
      const userDetails = JSON.parse(persistUserObject.userDetails);
      const userId = userDetails.userId;

      const response = await axios.get(`${baseUrl}/api/studentDashboard/subjects/${userId}`, {
        headers: {
          Authentication: token,
        },
      });

      setSubjects(response?.data?.subjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      setSubjectError("No subjects found.");
    } finally {
      setLoading(false); // Ensure loading is set to false after fetch
    }
  };



  const fetchStudentGrades = async () => {
    const token = localStorage.getItem("student:token");
  
    const classId = localStorage.getItem("classId");
  
    const persistUserString = localStorage.getItem("persist:user");
    const persistUserObject = JSON.parse(persistUserString);
    const userDetails = JSON.parse(persistUserObject.userDetails);
    const studentId = userDetails.userId;
  
    if (!studentId || !classId) {
      console.error("Invalid student or class ID.");
      return;
    }
  
    try {
      const response = await axios.get(
        `${baseUrl}/admin/grades/student/${studentId}/class/${classId}`,
        {
          headers: {
            Authentication: token,
          },
        }
      );
      return response.data.grades; // Return the grades data for further use
    } catch (error) {
      console.error("Error fetching student grades:", error);
      throw new Error("Failed to load student grades. Please try again later.");
    }
  };
  

  useEffect(() => {
    fetchDashboardDetails();
    fetchSubjects();
    fetchTasks();
    fetchStudentGrades();
  }, []);

  return (
    <div className="flex flex-col border-b border-gray-200">
      <div className="border-b border-gray-200 flex flex-wrap justify-center gap-3 py-4">
        {(cardData?.length ? cardData : [
          { label: "Upcoming Exam", value: 0, icon: "📝", bgColor: "bg-green-100", textColor: "text-green-600" },
          { label: "Due Fees", value: 0, icon: "💸", bgColor: "bg-red-100", textColor: "text-red-600" },
          { label: "Event", value: 0, icon: "📅", bgColor: "bg-blue-100", textColor: "text-blue-600" },
          { label: "Notice", value: 0, icon: "🔔", bgColor: "bg-yellow-100", textColor: "text-yellow-600" }
        ]).map((item, index) => (
          <DashCard key={index} {...item} />
        ))}
      </div>

      <div className="flex flex-1 w-full">
        <div className="w-[30%]">
          <div className="p-5">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-gray-600">My Subject</h2>
              <p className="text-sm text-purple-500 cursor-pointer font-bold">
                <Link to="/student_class">See all</Link>
              </p>
            </div>
            {loading ? (
              <div className="flex justify-center items-center py-5">
                <Spinner />
              </div>
            ) : subjectError ? (
              <div className="text-gray-500 flex flex-col items-center mt-7 mb-5">
                <AiOutlineBook size={50} />
                <span className="mt-4 text-lg font-semibold text-center">{subjectError}</span>
              </div>
            ) : subjects?.length > 0 ? (
              <div>
                <p className="text-sm text-gray-500">
                  A total of {subjects.length} Courses are in Progress
                </p>
                <AllSubjects subjects={subjects} />
              </div>
            ) : (
              <div className="text-gray-500 flex flex-col items-center mt-7 mb-5">
                <AiOutlineBook size={50} />
                <span className="mt-4 text-lg font-semibold text-center">No Data Found</span>
              </div>
            )}
          </div>
        </div>
        <div className="w-[70%] flex flex-col flex-wrap border-l border-r">
          <div className="w-full">
            <AttendanceDashboard />
          </div>
          <div className="flex flex-row items-center w-full justify-around">
            <div className="flex flex-col border-gray-200 w-1/2">
              <div className="border-gray-300 w-full pt-5 pb-3 ps-2 pl-4">
                <h1 className="text-xl ml-2 font-semibold text-gray-600">Student Grade</h1>
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
            <div className="flex flex-col border-l border-gray-200 w-1/2">
              <div className="w-full py-5 ps-3">
                <h1 className="text-xl font-semibold text-gray-600 px-2 mb-2">Task</h1>
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
            <h4 className="text-xl font-semibold text-gray-600">Recent Exam Results</h4>
            <p
              onClick={() => {
                if (selectedClass && selectedSection) {
                  navigate(`/student_class/${selectedClass}/${selectedSection}/grades`);
                } else {
                  setError("Unable to navigate to grades. Class or Section is missing.");
                }
              }}
              className="text-sm text-purple-500 cursor-pointer font-bold"
            >
              See All
            </p>
          </div>
          <div className="text-gray-500 flex flex-col items-center mt-9">
            <IoNewspaperOutline size={70} />
            <span className="mt-4 text-lg font-semibold text-center">No Exam Results for Now</span>
          </div>
        </div>
        <div className="border-l border-gray-300 w-[35%]">
          {unpaidFees === 0 ? (
            <div className="text-gray-500 flex flex-col items-center mt-4 mb-6">
              <PiMoneyWavy size={80} />
              <span className="mt-4 text-lg font-semibold text-center">No unpaid fees at the moment</span>
            </div>
          ) : (
            <div className="flex flex-col border-b border-gray-200 py-5">
              <StudentDashFeeCard
                title="Total Unpaid Fees"
                amount={unpaidFees}
                unpaidFees={unpaidFees}
                buttonText="Pay Now"
              />
            </div>
          )}
          <hr />
          {paidFees === 0 ? (
            <div className="text-gray-500 flex flex-col items-center mt-7">
              <PiMoneyWavyDuotone size={80} />
              <span className="mt-4 text-lg font-semibold text-center mb-8">No paid fees available</span>
            </div>
          ) : (
            <div className="flex flex-col py-5">
              <StudentDashFeeCard
                title="Total Paid Fees"
                amount={paidFees}
                unpaidFees={paidFees}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentMainSection;