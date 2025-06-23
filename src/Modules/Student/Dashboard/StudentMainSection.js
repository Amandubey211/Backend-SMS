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
import StudentEvents from "./DashBoardComponents/eventScheduler/StudentEvents.js";
import { FaMoneyBillWave, FaMoneyCheckAlt } from "react-icons/fa";
import FeeCard from "../Finance/FeeCard.js";
import {
  MdAttachMoney,
  MdEvent,
  MdNotifications,
  MdOutlineSchool,
} from "react-icons/md";
import { fetchOneStudentFee } from "../../../Store/Slices/Finance/StudentFees/studentFeesThunks.js";

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
  const { totalAllAmount, paidAllAmount, categories } = useSelector(
    (state) => state.admin.studentFees
  );
  useEffect(() => {
    dispatch(fetchStudentSubjectProgress(userDetails?.userId));
    dispatch(fetchOneStudentFee({ studentId: userDetails?.userId }));
    dispatch(fetchDashboardDetails());
    dispatch(fetchSubjects());
    dispatch(fetchTasks());
    dispatch(fetchStudentGrades());
    dispatch(fetchTasks());
    dispatch(fetchExamResults());
  }, [dispatch, userDetails?.userId]);

  const handlePayNow = () => {
    navigate("/student_finance");
  };

  return (
    <div className="flex flex-row w-full h-auto pb-4 ">
      {/* Left Section */}
      <div className="w-[65%] px-4">
        <div className="flex flex-wrap justify-around  py-3 w-full">

          {(cardData?.length
            ? cardData
            : [
                // {
                //   label: "Upcoming Exams",
                //   value: 0,
                //   bgColor: "bg-purple-100",
                //   textColor: "text-black-500",
                //   pentagonColor: "bg-purple-500", // Pentagon color matching bgColor
                //   icon: <MdOutlineSchool className="text-xl text-white" />,
                //   url: "/student_dash",
                // },
                {
                  label: "Unpaid",
                  value: 0,
                  bgColor: "bg-red-100",
                  textColor: "text-black-500",
                  pentagonColor: "bg-red-500",
                  icon: <MdAttachMoney className="text-xl text-white" />,
                  url: "/student_finance",
                },
                {
                  label: "Upcoming Events",
                  value: 0,
                  bgColor: "bg-blue-100",
                  textColor: "text-black-500",
                  pentagonColor: "bg-blue-500",
                  icon: <MdEvent className="text-xl text-white" />,
                  url: "/student/noticeboard/events",
                },
                {
                  label: "Upcoming Notices",
                  value: 0,
                  bgColor: "bg-orange-100",
                  textColor: "text-black-500",
                  pentagonColor: "bg-orange-500",
                  icon: <MdNotifications className="text-xl text-white" />,
                  url: "/student/noticeboard/announcements",
                },
              ]
          )?.map((item, index) => (
          {cardData?.map((item, index) => (
            <DashCard key={index} {...item} />
          ))}
        </div>

        {/* Subjects and Task */}
        <div className="flex  h-[500px] gap-4">
          {/* Subject Section */}
          <div className="w-[60%] flex items-start justify-start pb-4  h-full">
            <div className="w-full h-full">
              {/* Card container with full height and flex layout */}
              <div className="px-4 pt-4  rounded-md bg-white border hover:shadow-sm h-full flex flex-col">
                <div className="flex justify-between items-center mb-1">
                  <h2 className="text-lg font-semibold text-black">
                    My Subject
                  </h2>
                  <span
                    className="bg-gradient-to-r from-[#C83B62] to-[#7F35CD] bg-clip-text text-transparent font-normal cursor-pointer"
                    onClick={() => navigate("/student_class")}
                  >
                    View All
                  </span>
                </div>
                {loading ? (
                  <div className="flex justify-center items-center py-5 h-full mt-7 mb-5">
                    <Spinner />
                  </div>
                ) : subjectError ? (
                  <div className="text-gray-500 h-full flex flex-col items-center mt-7 mb-5">
                    <AiOutlineBook size={50} />
                    <span className="mt-4 text-lg font-semibold text-center">
                      {subjectError}
                    </span>
                  </div>
                ) : subjects?.length > 0 ? (
                  // Flex container that fills available height even if there's only one subject
                  <div className="flex flex-col h-full">
                    <p className="text-sm text-gray-500">
                      A total of {subjects?.length} Courses are in Progress
                    </p>
                    <div className="h-[80%]">
                      <AllSubjects subjects={studentSubjectProgress} />
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 flex flex-col items-center h-full mt-7 mb-5">
                    <AiOutlineBook size={50} />
                    <span className="mt-4 text-lg font-semibold text-center">
                      No Data Found
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Task Section */}
          <div className="flex flex-col  gap-1 w-[40%] ">
            <div className="w-full  h-[250px] p-4 bg-white border rounded-md hover:shadow-sm mb-2">
              <h1 className="text-lg font-semibold text-black">My Task</h1>
              <TaskCompletionChart />
            </div>
            <div className="flex w-full h-[250px] justify-between p-2 bg-white rounded-md border hover:shadow-sm mb-4">
              <StudentDashFeeCard
                title="Total Unpaid Fees"
                amount={(totalAllAmount - paidAllAmount).toFixed(2) || 0}
                buttonText="View More"
                buttonAction={handlePayNow}
              />
            </div>
          </div>
        </div>
        <div className="  h-[400px]">
          <div className="flex items-start justify-start w-[100%] border rounded-md bg-white hover:shadow-sm h-full">
            <AttendanceDashboard
              attendanceSummary={dashboardAttendance}
              error={attendanceError}
            />
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-col w-[35%] mr-4">
        {/* Event Section */}
        <div className="w-full px-4 py-3 h-[510px] bg-white rounded-md mt-3 border hover:shadow-sm">
          <StudentEvents />
        </div>
        {/* Notice Board */}
        <div className="flex w-full bg-white  h-full items-start justify-start px-4 pb-2 mt-3 rounded-md border hover:shadow-sm">
          <div className="w-full h-full">
            <DashboardNoticeBoard descriptionLength={58} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentMainSection;
