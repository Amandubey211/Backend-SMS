import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../../config/Common";



export const stdAttendance = createAsyncThunk(
    'attendance/stdAttendance',
    async ({month,year}, { rejectWithValue }) => {
        const token = localStorage.getItem("student:token");
        if (!token) {
            return rejectWithValue("Authentication failed!");
        }

        try {
            const res = await axios.get(
                `${baseUrl}/api/studentDashboard/myAttendance`,
                {
                  params: { month, year },
                  headers: {
                    Authentication: token,
                  },
                }
              );
              const data=res?.data?.report;
              console.log("Attendance in action:-->",data)
            //   const { report, summary } = res?.data?.report;
            //   const attendanceMap = report?.reduce((acc, entry) => {
            //     acc[entry?.date] = entry.status;
            //     return acc;
            //   }, {});

            //   setAttendanceData(attendanceMap);
            //   setSummary(summary);

            return data;
        } catch (error) {
            console.log("Error in student attendance", error);
            return rejectWithValue((error?.response?.data?.message || error?.message || "Something Went Wrong!"))
        }
    }
)