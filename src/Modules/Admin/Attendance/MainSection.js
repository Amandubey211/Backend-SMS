import React, { useState } from "react";
import NavSection from "./Components/NavSection";
import FilterAttendanceBar from "./Components/FilterAttendanceBar ";
import AttendanceTable from "./Components/AttendanceTable";

const MainSection = () => {
  const [filter, setFilter] = useState("all");

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  return (
    <div className="p-4">
      <NavSection onFilterChange={handleFilterChange} />
      <FilterAttendanceBar />
      <AttendanceTable filter={filter} />
    </div>
  );
};

export default MainSection;
