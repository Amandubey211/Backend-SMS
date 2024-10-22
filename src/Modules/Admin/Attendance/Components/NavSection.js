import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, NavLink } from "react-router-dom";
import { fetchAttendanceStats } from "../../../../Store/Slices/Admin/Class/Attendence/attendanceThunks";
import AttendanceNavCard from "./AttendanceNavCard";
import { navData } from "./Data/NavData";

const NavSection = () => {
  const dispatch = useDispatch();
  const { cid } = useParams();

  const attendanceStat = useSelector(
    (state) => state.admin.attendance.stats || {}
  );

  // Mapping the correct stat keys to navData
  const dataMapping = {
    "Total Students": "totalStudents",
    "Present Today": "totalPresent",
    "Absent Today": "totalAbsent",
    "Leave Today": "totalLeave",
  };

  // Directly map `navData` and use `attendanceStat` values.
  const mappedData = navData.map((item) => ({
    ...item,
    value: attendanceStat[dataMapping[item.label.trim()]] || 0, // Map values from the attendanceStat object
  }));

  useEffect(() => {
    if (cid) {
      dispatch(fetchAttendanceStats(cid));
    }
  }, [cid, dispatch]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
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
        {mappedData.map((item) => (
          <AttendanceNavCard
            key={item.label}
            label={item.label}
            value={item.value}
            bgColor={item.bgColor}
            icon={item.icon}
            iconBackground={item.iconColor}
            textColor={item.textColor}
          />
        ))}
      </div>
    </div>
  );
};

export default NavSection;
