import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineBook } from "react-icons/ai";
import { IoNewspaperOutline } from "react-icons/io5";
import { CiMoneyBill } from "react-icons/ci";
import DashCard from "./Dashcard.js";
import AllSubjects from "./DashBoardComponents/allSubjects/AllSubjects.js";
import AttendanceDashboard from "./DashBoardComponents/Charts/AttendanceDashboard.js";
import TaskCompletionChart from "./DashBoardComponents/Charts/TaskCompletionChart.js";
import StudentDashFeeCard from "./DashBoardComponents/StudentDashFeeCard.js";
import Spinner from "../../../Components/Common/Spinner";
import DashboardNoticeBoard from "./DashBoardComponents/Charts/dashboardNoticeBoard.js";
import {
  fetchDashboardDetails,
  fetchSubjects,
  fetchTasks,
  fetchStudentGrades,
  fetchExamResults,
} from "../../../Store/Slices/Student/Dashboard/studentDashboard.action.js";
import { fetchStudentSubjectProgress } from "../../../Store/Slices/Admin/Users/Students/student.action.js";
import ExamResults from "./DashboardData/ExamResults.js";

const StudentMainSection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    cardData,
    dashboardAttendance,
    paidFees,
    unpaidFees,
    attendanceError,
    subjects,
    subjectError,
    loading,
    tasks,
    examResults: results,
  } = useSelector((state) => state.student.studentDashboard);
  const { selectedClass, selectedSection } = useSelector(
    (state) => state?.common?.user?.classInfo
  );
  const { userDetails } = useSelector((state) => state?.common?.user);
  const { studentSubjectProgress } = useSelector(
    (store) => store.admin.all_students
  );

  useEffect(() => {
    dispatch(fetchStudentSubjectProgress(userDetails?.userId));
    dispatch(fetchDashboardDetails());
    dispatch(fetchSubjects());
    dispatch(fetchTasks());
    dispatch(fetchStudentGrades());
    dispatch(fetchTasks());
    dispatch(fetchExamResults());
  }, [dispatch]);

  console.log("exam Resuts", results);

  return (
    <div className="flex flex-col border-b border-gray-200">
      {/* Cards Section */}
      <div className="border-b border-gray-200 flex flex-wrap justify-center gap-3 py-4  px-7">
        {(cardData?.length
          ? cardData
          : [
              {
                label: "Upcoming Exam",
                value: 0,
                icon: "📝",
                bgColor: "bg-green-100",
                textColor: "text-green-600",
                url: "/student_dash",
              },
              {
                label: "Due Fees",
                value: 0,
                icon: <CiMoneyBill />,
                bgColor: "bg-red-100",
                textColor: "text-red-600",
                url: "/student_finance",
              },
              {
                label: "Event",
                value: 0,
                icon: "📅",
                bgColor: "bg-blue-100",
                textColor: "text-blue-600",
                url: "/",
              },
              {
                label: "Notice",
                value: 3,
                icon: "🔔",
                bgColor: "bg-yellow-100",
                textColor: "text-yellow-600",
                url: "/",
              },
            ]
        )?.map((item, index) => (
          <DashCard key={index} {...item} />
        ))}
      </div>

      {/* Subjects and Attendance Section */}
      <div className="flex flex-1 w-full h-full relative">
        <div className="absolute left-1/3 transform -translate-x-1/2 top-0 bottom-0 border-l border-gray-300"></div>
        <div className="w-[32%] flex items-center justify-center pl-4 pt-4 pb-4">
          <div className="w-full h-full">
            <div className="pl-4 py-4 pr-4 ">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold text-gray-600">
                  My Subject
                </h2>

                <span
                  className="bg-gradient-to-r from-[#C83B62] to-[#7F35CD]  bg-clip-text text-transparent font-normal cursor-pointer"
                  onClick={() => navigate("/student_class")}
                >
                  See All
                </span>
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
                    A total of {subjects?.length} Courses are in Progress
                  </p>
                  <AllSubjects subjects={studentSubjectProgress} />
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
        </div>
        <div className="w-[68%] flex items-center justify-center p-4">
          <div className="w-full h-full">
            <AttendanceDashboard
              attendanceSummary={dashboardAttendance}
              error={attendanceError}
            />
          </div>
        </div>
      </div>

      {/* Parent Wrapper for Left and Right Sections */}
      <div className="flex flex-row w-full h-full border-t border-gray-300">
        {/* Left Column: Notice Board and Recent Exam Results */}
        <div className="w-[70%] flex flex-col border-r border-gray-300">
          {/* Notice Board */}
          <div className="flex items-center justify-center px-4">
            <div className="w-full h-full">
              <DashboardNoticeBoard descriptionLength={58} />
            </div>
          </div>

          {/* Recent Exam Results */}
          {results?.length > 0 ? (
            <div className="flex items-center justify-center p-4 border-t border-gray-300">
              <div className="w-full h-full">
                <div className="flex justify-between items-center px-4">
                  <h4 className="text-xl font-semibold text-gray-600">
                    Recent Exam Results
                  </h4>

                  <span
                    className="bg-gradient-to-r from-[#C83B62] to-[#7F35CD]  bg-clip-text text-transparent font-normal cursor-pointer"
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
                  >
                    See All
                  </span>
                </div>
                <ExamResults />
              </div>
            </div>
          ) : (
            <div className="text-gray-500 flex flex-col justify-center items-center m-7 ">
              <IoNewspaperOutline size={50} />
              <span className=" text-lg font-semibold text-center">
                No Exam Results for Now
              </span>
            </div>
            // <></>
          )}
        </div>

        {/* Right Column: Task Completion and Fees Section */}
        <div className="w-[40%] flex flex-col">
          {/* Task Completion */}
          <div className="flex items-center justify-center pt-4">
            <div className="w-full h-full m-4">
              <h1 className="text-xl font-semibold text-gray-600 mb-4">Task</h1>
              <TaskCompletionChart />
            </div>
          </div>

          {/* Fees Section */}
          <div className="flex items-center justify-center p-4 border-t border-gray-300">
            <div className="w-full h-full">
              <div className="flex flex-col border-b border-gray-200 p-5">
                <StudentDashFeeCard
                  title="Total Unpaid Fees"
                  amount={unpaidFees || 0}
                  unpaidFees={unpaidFees || 0}
                  buttonText="Pay Now"
                />
              </div>
              <div className="flex flex-col py-5">
                <StudentDashFeeCard
                  title="Total Paid Fees"
                  amount={paidFees || 0}
                  unpaidFees={paidFees || 0}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentMainSection;
