import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { navData } from "../../Components/Data/NavData";
import AttendanceNavCard from "../../Components/AttendanceNavCard";
import { useParams } from "react-router-dom";
import { fetchAttendanceStats } from "../../../../../Store/Slices/Admin/Class/Attendence/attendanceThunks";
import { Skeleton, Empty } from "antd"; // Importing Ant Design components
import Spinner from "../../../../../Components/Common/Spinner";

const Statistics = () => {
  const { stats, loading, error } = useSelector(
    (state) => state.admin.attendance
  ); // Get attendance stats, loading, and error from Redux
  const dispatch = useDispatch();
  const { cid } = useParams(); // Get class ID from route params
  // Define the mapping between the API response keys and the labels in navData
  const dataMapping = {
    "Total Students": "totalStudents",
    "Present Today": "presentCount",
    "Absent Today": "absentCount",
    "Leave Today": "leaveCount",
  };

  // Map the stats data from Redux and combine it with the navData structure
  const mappedData = navData?.map((item) => ({
    ...item,
    value: stats[dataMapping[item.label.trim()]] || 0, // Map values from the attendanceStat object
    label: item.label.trim(), // Translate labels using i18n
  }));

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
        <Empty description="Statistics not available" />
        {/* Use Ant Design's Empty component to show the error state */}
      </div>
    );
  }

  // If there's no data available, show the Empty component
  if (!mappedData || mappedData.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <Empty description="No attendance data available" />
        {/* Display a message with an empty state using Ant Design's Empty */}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2 w-full">
      {/* Ensure the cards are displayed in a stable layout */}
      {mappedData?.map((item) => (
        <AttendanceNavCard
          cardHeight="h-20"
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
