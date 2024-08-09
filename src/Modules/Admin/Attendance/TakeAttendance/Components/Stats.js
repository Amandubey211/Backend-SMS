import React from "react";
import { navData } from "../../Components/Data/NavData";
import AttendanceNavCard from "../../Components/AttendanceNavCard";

const Statistics = ({ attendanceData }) => {
  // Map attendanceData to navData structure
  const dataMapping = {
    "Total Students": "totalStudents",
    "Present Today": "presentCount",
    "Absent Today": "absentCount",
    "Leave Today": "leaveCount",
  };
  console.log("attendanceData stats--", attendanceData);

  const mappedData = navData.map(item => {
    const key = dataMapping[item.label.trim()];
    return {
      ...item,
      value: attendanceData[key],
    };
  });

  return (
    <div className="space-y-2 w-full">
      {mappedData?.map(item => (
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
