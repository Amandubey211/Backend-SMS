import React, { useState } from "react";
import { navData } from "./Data/NavData";
import AttendanceNavCard from "./AttendanceNavCard";
import toast from "react-hot-toast";
import { NavLink, useParams } from "react-router-dom";

const NavSection = ({ onFilterChange }) => {
  const [selectedFilter, setSelectedFilter] = useState("all");
const {cid} = useParams()
  const handleFilterChange = (filter) => {
    toast.success(filter)
    setSelectedFilter(filter);
    onFilterChange(filter);
  };
  console.log(selectedFilter);
  return (
    <div>
      <div className="flex items-center justify-between mb-3 ">
        <h2 className="text-xl font-semibold text-gradient text-purple-600">
          Student Attendance
        </h2>
        <NavLink to={`/class/${cid}/take_attendance`} className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md shadow-lg">
          Take Attendance
        </NavLink>
      </div>

      <div className="flex space-x-4">
        {navData.map((item) => (
          <AttendanceNavCard
            key={item.label}
            label={item.label}
            value={item.value}
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
