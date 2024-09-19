import React, { useState, useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { navData } from "./Data/NavData";
import AttendanceNavCard from "./AttendanceNavCard";
import { fetchAttendanceStats } from "../../../../Store/Slices/Admin/Class/Attendence/attendanceThunks";

const NavSection = ({ onFilterChange }) => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const dispatch = useDispatch();
  const { cid } = useParams();

  // Fetch attendance stats from Redux
  const attendanceStat = useSelector(
    (state) => state.admin.attendance.stats || {} // Safely initialize to empty object
  );

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    onFilterChange(filter);
  };

  // Map attendanceStat data to navData structure safely
  const dataMapping = {
    "Total Students": "totalStudents",
    "Present Today": "totalPresent",
    "Absent Today": "totalAbsent",
    "Leave Today": "totalLeave",
  };

  const mappedData = navData.map((item) => {
    const key = dataMapping[item.label.trim()];
    return {
      ...item,
      value: attendanceStat?.[key] || 0, // Safely access data with optional chaining
    };
  });

  useEffect(() => {
    if (cid) {
      dispatch(fetchAttendanceStats(cid)); // Dispatch action to fetch attendance stats
    }
  }, [cid, dispatch]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3 ">
        <h2 className="text-xl font-semibold text-gradient text-purple-600">
          Student Attendance
        </h2>
        <NavLink
          to={`/class/${cid}/take_attendance`}
          className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md shadow-lg"
        >
          Take Attendance
        </NavLink>
      </div>

      <div className="flex space-x-4">
        {mappedData?.map((item) => (
          <AttendanceNavCard
            key={item.label}
            label={item.label}
            value={item.value} // Safely accessing value
            bgColor={item.bgColor}
            textColor={item.textColor}
            icon={item.icon}
            iconBackground={item.iconBackground}
            onClick={() => handleFilterChange(item.label.toLowerCase())}
          />
        ))}
      </div>
    </div>
  );
};

export default NavSection;
