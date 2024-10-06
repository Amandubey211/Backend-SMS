import React, { useState, useEffect } from "react";
import AttendanceChart from "./AttendanceChart"; // Replace with your actual component import
import Spinner from "../../../../../Components/Common/Spinner";
import { FaUserGraduate } from "react-icons/fa";

const AttendanceDashboard = ({ attendanceSummary, error }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    if (attendanceSummary || error) {
      setLoading(false);  // Stop loading if attendanceSummary exists or if there's an error
    }
  }, [attendanceSummary, error]);

  return (
    <div className="attendance-dashboard w-[100%] border-b p-5">
      <h1 className="text-xl font-semibold text-gray-600">Attendance</h1>
      
      {loading ? (
        <div className="flex items-center justify-center mt-4">
          <Spinner />  {/* Show spinner while loading */}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center text-gray-500 mt-4">
          <FaUserGraduate size={80} />
          <span className="mt-4 text-lg font-semibold">{error}</span>  {/* Show error message */}
        </div>
      ) : !attendanceSummary || (
        !attendanceSummary.present?.some(day => day > 0) && 
        !attendanceSummary.absent?.some(day => day > 0) && 
        !attendanceSummary.leave?.some(day => day > 0)
      ) ? (
        <div className="flex flex-col items-center justify-center text-gray-500 mt-4">
          <FaUserGraduate size={80} />
          <span className="mt-4 text-lg font-semibold">
            No attendance data available
          </span>
        </div>
      ) : (
        <div className="justify-center text-center w-full">
          <AttendanceChart
            data={[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ].map((month, index) => ({
              month,
              present: attendanceSummary?.present?.[index] || 0,
              absent: attendanceSummary?.absent?.[index] || 0,
              leave: attendanceSummary?.leave?.[index] || 0,
            }))}
          />
        </div>
      )}
    </div>
  );
};

export default AttendanceDashboard;
