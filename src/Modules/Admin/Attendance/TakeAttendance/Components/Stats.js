import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { navData } from "../../Components/Data/NavData";
import AttendanceNavCard from "../../Components/AttendanceNavCard";
import { useParams } from "react-router-dom";
import { fetchAttendanceStats } from "../../../../../Store/Slices/Admin/Class/Attendence/attendanceThunks";
import Spinner from "../../../../../Components/Common/Spinner";
import NoDataFound from "../../../../../Components/Common/NoDataFound";

const Statistics = () => {
  const { stats, loading, error } = useSelector(
    (state) => state.admin.attendance
  ); // Get attendance stats, loading, and error from Redux
  const dispatch = useDispatch();
  const { cid } = useParams(); // Get class ID from route params

  // Define the mapping between the API response keys and the labels in navData
  const dataMapping = {
    totalStudents: "Total Students",
    totalPresent: "Present Today",
    totalAbsent: "Absent Today",
    totalLeave: "Leave Today",
  };

  // Map the stats data from Redux and combine it with the navData structure
  const mappedData = navData?.map((item) => {
    const key = Object.keys(dataMapping).find(
      (key) => dataMapping[key] === item.label
    );
    return {
      ...item,
      value: stats[key] || 0, // Use stat value or default to 0
    };
  });

  // Fetch attendance stats when component mounts or class ID changes
  useEffect(() => {
    if (cid) {
      dispatch(fetchAttendanceStats(cid));
    }
  }, [cid, dispatch]);

  // Display loading spinner when fetching stats
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner /> {/* A spinner to indicate loading */}
      </div>
    );
  }

  // Handle error state gracefully
  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <NoDataFound title="Statistics not available" />{" "}
        {/* Show error message */}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2 w-full">
      {" "}
      {/* Ensure the cards are displayed in a stable layout */}
      {mappedData?.map((item) => (
        <AttendanceNavCard
          key={item.label}
          label={item.label}
          value={item.value}
          bgColor={item.bgColor}
          textColor={item.textColor}
          icon={item.icon}
        />
      ))}
    </div>
  );
};

export default Statistics;
