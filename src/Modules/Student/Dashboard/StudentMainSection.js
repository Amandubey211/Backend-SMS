import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineBook } from "react-icons/ai";
import { IoNewspaperOutline } from "react-icons/io5";
import { PiMoneyWavyDuotone, PiMoneyWavy } from "react-icons/pi";
import { GiSchoolBag } from "react-icons/gi";

import DashCard from "./Dashcard.js";
import AllSubjects from "./DashBoardComponents/allSubjects/AllSubjects.js";
import AttendanceDashboard from "./DashBoardComponents/Charts/AttendanceDashboard.js";
import StudentGradePieChart from "./DashBoardComponents/Charts/StudentGradePieChart.js";
import TaskCompletionChart from "./DashBoardComponents/Charts/TaskCompletionChart.js";
import StudentDashFeeCard from "./DashBoardComponents/StudentDashFeeCard.js";
import Spinner from "../../../Components/Common/Spinner";

import {
  fetchDashboardDetails,
  fetchSubjects,
  fetchTasks,
  fetchStudentGrades,
} from "../../../Store/Slices/Student/Dashboard/studentDashboard.action.js"; // Import the action creators

const StudentMainSection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Extract state from Redux store
  const {
    cardData,
    dashboardAttendance,
    paidFees,
    unpaidFees,
    attendanceError,
    subjects,
    subjectError,
    loading,
    gradeData,
    error,
    tasks,
  } = useSelector((state) => state.student.studentDashboard); // Accessing studentDashboard state

  const { selectedClass, selectedSection } = useSelector(
    (state) => state?.common?.user?.classInfo // Assuming classInfo is from another slice
  );

  // Dispatch actions to fetch all required data
  useEffect(() => {
    dispatch(fetchDashboardDetails()); // Fetch dashboard details
    dispatch(fetchSubjects());         // Fetch subjects
    dispatch(fetchTasks());            // Fetch tasks
    dispatch(fetchStudentGrades());    // Fetch student grades
  }, [dispatch]); // Only run on component mount

  return (
    <div className="flex flex-col border-b border-gray-200">
      <div className="border-b border-gray-200 flex flex-wrap justify-center gap-3 py-4">
        {(cardData?.length
          ? cardData
          : [
              {
                label: "Upcoming Exam",
                value: 0,
                icon: "📝",
                bgColor: "bg-green-100",
                textColor: "text-green-600",
              },
              {
                label: "Due Fees",
                value: 0,
                icon: "💸",
                bgColor: "bg-red-100",
                textColor: "text-red-600",
              },
              {
                label: "Event",
                value: 0,
                icon: "📅",
                bgColor: "bg-blue-100",
                textColor: "text-blue-600",
              },
              {
                label: "Notice",
                value: 0,
                icon: "🔔",
                bgColor: "bg-yellow-100",
                textColor: "text-yellow-600",
              },
            ]
        ).map((item, index) => (
          <DashCard key={index} {...item} />
        ))}
      </div>

      <div className="flex flex-1 w-full">
        <div className="w-[30%] border-r border-gray-200">
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
                <span className="mt-4 text-lg font-semibold text-center">
                  {subjectError}
                </span>
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
                <span className="mt-4 text-lg font-semibold text-center">
                  No Data Found
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="w-[70%] flex flex-col flex-wrap border-l border-r">
          <div className="w-full">
            <AttendanceDashboard
              attendanceSummary={dashboardAttendance}
              error={attendanceError} // Pass the error state here
            />
          </div>

          <div className="flex flex-row w-full justify-around">
            <div className="flex flex-col border-r border-gray-200 w-1/2">
              <div className="border-gray-300 w-full pt-5 pb-3 ps-2 pl-4">
                <h1 className="text-xl ml-2 font-semibold text-gray-600">
                  Student Grade
                </h1>
              </div>
              <div className="flex justify-between px-3 w-full ps-4">
                <p>Total Point: 90%</p>
                <select className="select-exam-type border border-gray-300 rounded-md px-3 py-2 hover:shadow-md focus:outline-none focus:ring focus:ring-gray-300">
                  <option value="exam-type">Exam Type</option>
                  <option value="practical-exam">Practical Exam</option>
                </select>
              </div>

              <div className="flex-1">
                {error ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <GiSchoolBag size={50} />
                    <p className="mt-4 text-lg font-semibold">
                      Failed to load student grades.
                    </p>
                  </div>
                ) : gradeData ? (
                  <StudentGradePieChart gradesData={gradeData} />
                ) : (
                  <Spinner />
                )}
              </div>
            </div>
            <div className="flex flex-col border-l border-gray-200 w-1/2">
              <div className="w-full py-5 ps-3">
                <h1 className="text-xl font-semibold text-gray-600 px-2 mb-2">
                  Task
                </h1>
                <p className="px-2">5/12 assignments have been completed</p>
              </div>
              <div className="flex-1">
                <TaskCompletionChart tasks={tasks} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex border">
        <div className="w-[65%]">
          <div className="flex justify-between items-center p-4">
            <h4 className="text-xl font-semibold text-gray-600">
              Recent Exam Results
            </h4>
            <p
              onClick={() => {
                if (selectedClass && selectedSection) {
                  navigate(
                    `/student_class/${selectedClass}/${selectedSection}/grades`
                  );
                } else {
                  console.error(
                    "Unable to navigate to grades. Class or Section is missing."
                  );
                }
              }}
              className="text-sm text-purple-500 cursor-pointer font-bold"
            >
              See All
            </p>
          </div>
          <div className="text-gray-500 flex flex-col items-center mt-9">
            <IoNewspaperOutline size={70} />
            <span className="mt-4 text-lg font-semibold text-center">
              No Exam Results for Now
            </span>
          </div>
        </div>
        <div className="border-l border-gray-300 w-[35%]">
          {unpaidFees === 0 ? (
            <div className="text-gray-500 flex flex-col items-center mt-4 mb-6">
              <PiMoneyWavy size={80} />
              <span className="mt-4 text-lg font-semibold text-center">
                No unpaid fees at the moment
              </span>
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
              <span className="mt-4 text-lg font-semibold text-center mb-8">
                No paid fees available
              </span>
            </div>
          ) : (
            <div className="flex flex-col py-5">
              <StudentDashFeeCard
                title="Total Paid Fees"
                amount={paidFees}
                unpaidFees={paidFees} // Should be `paidFees`
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentMainSection;
