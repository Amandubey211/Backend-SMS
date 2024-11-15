import { createAsyncThunk } from "@reduxjs/toolkit";
import { CiMoneyBill } from "react-icons/ci";
import { setErrorMsg, setShowError } from "../../Common/Alerts/alertsSlice";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { getData } from "../../../../services/apiEndpoints";
import { getAY } from "../../../../Utils/academivYear";

// Fetch Card Details
export const fetchDashboardDetails = createAsyncThunk(
  "studentDashboard/fetchDashboardDetails",
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const data = await getData(
        `/api/studentDashboard/dashboard/student?say=${say}`
      );
      const { attendanceSummary } = data?.data;
      const { student } = await getState();
      const notices = student?.studentAnnouncement?.noticeData?.length || 0;
      return {
        cardData: formatDashboardData(data, notices),
        paidFees: data?.data?.totalPaidFees,
        unpaidFees: data?.data?.dueFees,
        attendanceSummary,
      };
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch Subjects
export const fetchSubjects = createAsyncThunk(
  "studentDashboard/fetchSubjects",
  async (_, { rejectWithValue, dispatch }) => {
    const persistUserString = localStorage.getItem("persist:user");
    const persistUserObject = JSON.parse(persistUserString);
    const userDetails = JSON.parse(persistUserObject?.userDetails);
    const userId = userDetails?.userId;
    if (!userId ) {
      dispatch(setShowError(true));
      dispatch(setErrorMsg("Invalid student or class ID."));
      return rejectWithValue("Invalid student or class ID.");
    }
 
    try {
    
      const say = getAY();
      dispatch(setShowError(false));
      const data =  await getData(`/api/studentDashboard/subjects/${userId}?say=${say}`);
      console.log("errorrrrrrr",data)
      return data?.subjects;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch Tasks
export const fetchTasks = createAsyncThunk(
  "studentDashboard/fetchTasks",
  async (_, { rejectWithValue, dispatch }) => {
    const persistUserString = localStorage.getItem("persist:user");
    const persistUserObject = JSON.parse(persistUserString);
    const userDetails = JSON.parse(persistUserObject?.userDetails);
    const userId = await  userDetails?.userId;
    if (!userId ) {
      dispatch(setShowError(true));
      dispatch(setErrorMsg("Invalid student or class ID."));
      return rejectWithValue("Invalid student or class ID.");
    }
   
    try {
    
      const say = getAY();
      dispatch(setShowError(false));
      const data = await getData(`/admin/task/student/${userId}?say=${say}`);
      return data?.completedTask;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch Student Grades 
export const fetchStudentGrades = createAsyncThunk(
  "studentDashboard/fetchStudentGrades",
  async (_, { rejectWithValue, dispatch }) => {
    const persistUserString = localStorage.getItem("persist:user");
    const persistUserObject = JSON.parse(persistUserString);
    const userDetails = JSON.parse(persistUserObject?.userDetails);
    const userId = userDetails?.userId;
    const classId = localStorage.getItem("classId");
    
    if (!userId || !classId) {
      dispatch(setShowError(true));
      dispatch(setErrorMsg("Invalid student or class ID."));
      return rejectWithValue("Invalid student or class ID.");
    }
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const data = await getData(
        `/admin/grades/student/${userId}/class/${classId}?say=${say}`
      );
      return data;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Helper function to format dashboard data
const formatDashboardData = (dashboardData, notices) => {
  return [
    {
      label: "Upcoming Exam",
      value: dashboardData?.data?.upcomingExam,
      bgColor: "bg-green-100",
      textColor: "text-black-500",
      icon: "📝",
      url: "/student_dash",
    },
    {
      label: "Due Fees",
      value: dashboardData?.data?.dueFees,
      bgColor: "bg-red-100",
      textColor: "text-black-500",
      icon: <CiMoneyBill />,
      url: "/student_finance",
    },
    {
      label: "Event",
      value: dashboardData?.data?.events,
      bgColor: "bg-blue-100",
      textColor: "text-black-500",
      icon: "📅",
      url: "/student/noticeboard/events",
    },
    {
      label: "Notice",
      value: notices,
      bgColor: "bg-yellow-100",
      textColor: "text-black-500",
      icon: "🔔",
      url: "/student/noticeboard/announcements",
    },
  ];
};
