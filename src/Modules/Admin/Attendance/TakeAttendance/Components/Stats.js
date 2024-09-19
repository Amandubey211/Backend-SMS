import React from "react";
import { useSelector } from "react-redux";
import { navData } from "../../Components/Data/NavData";
import AttendanceNavCard from "../../Components/AttendanceNavCard";

const Statistics = () => {
  const stats = useSelector((state) => state.admin.attendance.stats);

  const dataMapping = {
    "Total Students": "totalStudents",
    "Present Today": "presentCount",
    "Absent Today": "absentCount",
    "Leave Today": "leaveCount",
  };

  const mappedData = navData.map((item) => {
    const key = dataMapping[item.label.trim()];
    return {
      ...item,
      value: stats[key] || 0,
    };
  });

  return (
    <div className="space-y-2 w-full">
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
