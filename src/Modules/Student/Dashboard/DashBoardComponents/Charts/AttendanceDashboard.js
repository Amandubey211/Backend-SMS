import React, { useEffect, useState } from "react";
import AttendanceChart from "./AttendanceChart"; // Replace with your actual component import
import { baseUrl } from "../../../../../config/Common";
import Spinner from "../../../../../Components/Common/Spinner";
import { FaUserGraduate } from "react-icons/fa";

const AttendanceDashboard = () => {
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cache, setCache] = useState({});

  useEffect(() => {
    const fetchAttendanceSummary = async () => {
      try {
        const token = localStorage.getItem("student:token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        // Check if data is cached
        if (cache.attendanceSummary) {
          setAttendanceSummary(cache.attendanceSummary);
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${baseUrl}/api/studentDashboard/dashboard/student`,
          {
            headers: {
              Authentication: token,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        console.log("attendance summary data", data);
        setAttendanceSummary(data?.data?.attendanceSummary);
        setCache((prev) => ({ ...prev, attendanceSummary: data?.data?.attendanceSummary }));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching attendance summary:", error);
        setError("Unable to fetch attendance data");
        setLoading(false);
      }
    };

    fetchAttendanceSummary();
  }, [cache]);

  return (
    <div className="attendance-dashboard w-[100%] border-b p-5">
      <h1 className="text-xl font-semibold text-gray-600">Attendance</h1>
      {loading ? (
        <div className="flex items-center justify-center mt-4">
          <Spinner />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center text-gray-500 mt-4">
          <FaUserGraduate size={80} />
          <span className="mt-4 text-lg font-semibold">{error}</span>
        </div>
      ) : !attendanceSummary ? (
        <div className="flex flex-col items-center justify-center text-gray-500 mt-4">
          <FaUserGraduate size={80} />
          <span className="mt-4 text-lg font-semibold">No attendance data available</span>
        </div>
      ) : (
        <div className="justify-center text-center w-full">
          <AttendanceChart data={
            [
              "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
            ].map((month, index) => ({
              month,
              present: attendanceSummary?.present?.[index] || 0,
              absent: attendanceSummary?.absent?.[index] || 0,
              leave: attendanceSummary?.leave?.[index] || 0,
            }))
          } />
        </div>
      )}
    </div>
  );
};

export default AttendanceDashboard;