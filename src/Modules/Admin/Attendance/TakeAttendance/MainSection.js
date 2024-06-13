import React from "react";

import CustomCalendar from "./Components/Calendar";
import Filters from "./Components/Filter";
import AttendanceTable from "./Components/AttendanceTable";
import Statistics from "./Components/Stats";
import Header from "./Components/Header";

const MainSection = () => {
  return (
    <div className="flex min-h-screen p-4 space-x-4">
      {/* This section should take 70% of the space */}
      <div className="w-7/10 p-2 bg-white border-r">
        <Header />
        <div>
          <Filters />
          <AttendanceTable />
        </div>
      </div>

      {/* This section should take 30% of the space */}
      <div className="w-3/10 p-1 bg-white ">
        <CustomCalendar />
        <div className="p-3 mt-5">
          <Statistics />
        </div>
      </div>
    </div>
  );
};

export default MainSection;
