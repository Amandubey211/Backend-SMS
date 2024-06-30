import React from "react";
import { navData } from "../../Components/Data/NavData";
import AttendanceNavCard from "../../Components/AttendanceNavCard";

const Statistics = () => {
  return (
    <div className="space-y-2 w-full">
      {navData.filter((item)=>item.label != "Leave Today").map((item) => (
        <AttendanceNavCard
          key={item.label}
          label={item.label}
          value={item.value}
          bgColor={item.bgColor}
          textColor={item.textColor}
          icon={item.icon}
          iconBackground={item.iconBackground}
          // onClick={() => handleFilterChange(item.label.toLowerCase())}
        />
      ))}
    </div>
  );
};

export default Statistics;
