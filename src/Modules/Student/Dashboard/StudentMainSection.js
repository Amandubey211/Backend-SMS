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
import NoticeBoard from "../../Admin/Dashboard/NoticeModule/NoticeBoard.js";
import DashboardNoticeBoard from "./DashBoardComponents/Charts/dashboardNoticeBoard.js";
import { CiMoneyBill } from "react-icons/ci";
import { fetchStudentSubjectProgress } from "../../../Store/Slices/Admin/Users/Students/student.action.js";

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
  } = useSelector((state) => state.student.studentDashboard); 
  const { selectedClass, selectedSection } = useSelector(
    (state) => state?.common?.user?.classInfo 
  );
  const { userDetails } = useSelector((state) => state?.common?.user);
  const {studentSubjectProgress} = useSelector((store) => store.admin.all_students);

  useEffect(() => {
    dispatch(fetchStudentSubjectProgress(userDetails?.userId));
    dispatch(fetchDashboardDetails()); 
    dispatch(fetchSubjects());        
    dispatch(fetchTasks());           
    dispatch(fetchStudentGrades());    
    dispatch(fetchTasks()); 
  }, [dispatch]);

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
                url:'/student_dash'
              },
              {
                label: "Due Fees",
                value: 0,
                icon: <CiMoneyBill />,
                bgColor: "bg-red-100",
                textColor: "text-red-600",
                url:'/student_finance'
              },
              {
                label: "Event",
                value: 0,
                icon: "📅",
                bgColor: "bg-blue-100",
                textColor: "text-blue-600",
                url:'/'
              },
              {
                label: "Notice",
                value: 0,
                icon: "🔔",
                bgColor: "bg-yellow-100",
                textColor: "text-yellow-600",
                url:'/'
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
        <div className="w-[70%] flex flex-col flex-wrap border-l border-r ">
          <div className="w-full">
            <AttendanceDashboard
              attendanceSummary={dashboardAttendance}
              error={attendanceError} // Pass the error state here
            />
          </div>
        </div>
        
      </div>
      <div className="flex flex-row w-[100%]  border-t">
          <div className="w-[70%]">
          <DashboardNoticeBoard descriptionLength={58} />
        </div>
            <div className="flex flex-col my-4 border-l border-gray-200 w-[30%]">
              <div className="w-full">
                <h1 className="text-xl font-semibold text-gray-600 px-2 mb-2">
                  Task
                </h1>
              </div>
              <div className="flex-1">
                <TaskCompletionChart />
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
              <span className="mt-4 text-2lx font-semibold text-center">
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
