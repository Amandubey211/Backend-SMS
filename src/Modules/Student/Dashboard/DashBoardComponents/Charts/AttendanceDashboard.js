import React, { useState, useEffect } from "react";
import AttendanceChart from "./AttendanceChart"; // Replace with your actual component import
import Spinner from "../../../../../Components/Common/Spinner";
import { FaUserGraduate } from "react-icons/fa";

const AttendanceDashboard = ({ attendanceSummary, error }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (attendanceSummary || error) {
      setLoading(false);
    }
  }, [attendanceSummary, error]);

  return (
    <div className="attendance-dashboard w-[95%] h-full  mx-4 rounded-md">
      <h1 className="text-lg font-semibold  text-black mt-3">Attendance</h1>

      {loading ? (
        <div className="flex items-center justify-center mt-4">
          <Spinner />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 mt-4">
          <FaUserGraduate size={80} />
          <span className="mt-4 text-lg font-semibold">{error}</span>{" "}
        </div>
      ) : !attendanceSummary ||
        (!attendanceSummary.present?.some((day) => day > 0) &&
          !attendanceSummary.absent?.some((day) => day > 0) &&
          !attendanceSummary.leave?.some((day) => day > 0)) ? (
        <div className="flex flex-col h-full items-center justify-center text-gray-500 mt-4">
          <FaUserGraduate size={80} />
          <span className="mt-4 text-lg font-semibold">
            No attendance data available
          </span>
        </div>
      ) : (
        <div className="justify-center text-center w-full h-[330px] my-4 ">
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
            ]?.map((month, index) => ({
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
