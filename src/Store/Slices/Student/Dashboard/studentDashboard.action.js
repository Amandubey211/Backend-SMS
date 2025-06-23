import { createAsyncThunk } from "@reduxjs/toolkit";
import { CiMoneyBill } from "react-icons/ci";
import { setErrorMsg, setShowError } from "../../Common/Alerts/alertsSlice";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { getData } from "../../../../services/apiEndpoints";
import { getAY } from "../../../../Utils/academivYear";
import { FaMoneyBillWave } from "react-icons/fa";
import {
  MdAttachMoney,
  MdEvent,
  MdNotifications,
  MdOutlineSchool,
} from "react-icons/md";

// Helper function to format dashboard data
const formatDashboardData = (dashboardData) => {
  return [
    // {
    //   label: "Upcoming Exams",
    //   value: dashboardData?.upcomingExam,
    //   bgColor: "bg-purple-100",
    //   textColor: "text-black-500",
    //   pentagonColor: "bg-purple-500", // Pentagon color matching bgColor
    //   icon: <MdOutlineSchool className="text-xl text-white" />, // Exam Icon
    //   url: "/student_dash",
    // },
    {
      label: "Unpaid",
      value: dashboardData?.dueFees,
      bgColor: "bg-red-100",
      textColor: "text-black-500",
      pentagonColor: "bg-red-500",
      icon: <MdAttachMoney className="text-xl text-white" />, // Money Icon
      url: "/student_finance",
    },
    {
      label: "Upcoming Events",
      value: dashboardData?.events,
      bgColor: "bg-blue-100",
      textColor: "text-black-500",
      pentagonColor: "bg-blue-500",
      icon: <MdEvent className="text-xl text-white" />, // Calendar Event Icon
      url: "/student/noticeboard/events",
    },
    {
      label: "Upcoming Notices",
      value: dashboardData?.notices,
      bgColor: "bg-orange-100",
      textColor: "text-black-500",
      pentagonColor: "bg-orange-500",
      icon: <MdNotifications className="text-xl text-white" />, // Notification Bell Icon
      url: "/student/noticeboard/announcements",
    },
  ];
};

// Fetch Card Details
export const fetchDashboardDetails = createAsyncThunk(
  "studentDashboard/fetchDashboardDetails",
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const data = await getData(`/admin/dashboard/student?say=${say}`);

      const { attendanceSummary } = data?.data;

      // const notices = student?.studentAnnouncement?.noticeData?.length || 0;
      return {
        cardData: formatDashboardData(data?.data),
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
    if (!userId) {
      dispatch(setShowError(true));
      dispatch(setErrorMsg("Invalid student or class ID."));
      return rejectWithValue("Invalid student or class ID.");
    }

    try {
      const say = getAY();
      dispatch(setShowError(false));
      const data = await getData(
        `/admin/students/subjects/${userId}?say=${say}`
      );
      // console.log("escsasa->",data)
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
    const userId = await userDetails?.userId;
    if (!userId) {
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
  async (_, { rejectWithValue, dispatch, getState }) => {
    // const persistUserString = localStorage.getItem("persist:user");
    // const persistUserObject = JSON.parse(persistUserString);
    // const userDetails = JSON.parse(persistUserObject?.userDetails);
    // const userId = userDetails?.userId;
    const { userDetails } = getState((store) => store.common.user);
    const classId = userDetails?.classId;
    const userId = userDetails?.userId;

    if (!userId || !classId) {
      dispatch(setShowError(true));
      dispatch(setErrorMsg("Invalid student or class ID."));
      return rejectWithValue("Invalid student or class ID.");
    }
    try {
      const semesterId = getState().common.user.classInfo.selectedSemester.id;
      const say = getAY();
      dispatch(setShowError(false));
      const data = await getData(
        `/admin/grades/student/${userId}/class/${classId}?say=${say}&semesterId=${semesterId}`
      );
      return data;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const fetchExamResults = createAsyncThunk(
  "studentDashboard/fetchExamResults",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      // Retrieve required parameters from localStorage or other sources
      const persistUserString = localStorage.getItem("persist:user");
      const persistUserObject = JSON.parse(persistUserString);
      const userDetails = JSON.parse(persistUserObject?.userDetails);

      const studentId = userDetails?.userId;
      const schoolId = userDetails?.schoolId;
      const say = getAY(); // Selected Academic Year

      if (!studentId || !schoolId || !say) {
        dispatch(setShowError(true));
        dispatch(
          setErrorMsg("Missing required parameters for fetching exam results.")
        );
        return rejectWithValue(
          "Invalid studentId, schoolId, or academic year."
        );
      }

      // Construct the API endpoint with query parameters
      const apiEndpoint = `/admin/getQuizResult?say=${say}&studentId=${studentId}&schoolId=${schoolId}`;

      // Fetch data from the API
      const data = await getData(apiEndpoint);
      return data?.data; // Assuming the response contains a "data" field
    } catch (error) {
      console.error("Error fetching exam results:", error);
      handleError(error, dispatch, rejectWithValue);
    }
  }
);
