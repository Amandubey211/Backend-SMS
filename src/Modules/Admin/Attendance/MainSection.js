import React, { useEffect, useState } from "react";
import NavSection from "./Components/NavSection";
import FilterAttendanceBar from "./Components/FilterAttendanceBar";
import AttendanceTable from "./Components/AttendanceTable";
import { useParams } from "react-router-dom";
import useGetAttendanceByClassSectionGroupAndDate from "../../../Hooks/AuthHooks/Staff/Admin/Attendance/useGetAttendanceByClassSectionGroupAndDate";
import Spinner from "../../../Components/Common/Spinner";
import NoDataFound from "../../../Components/Common/NoDataFound";

const months = [
  { name: "January", number: 1 },
  { name: "February", number: 2 }, // Assuming leap year for example
  { name: "March", number: 3 },
  { name: "April", number: 4 },
  { name: "May", number: 5 },
  { name: "June", number: 6 },
  { name: "July", number: 7 },
  { name: "August", number: 8 },
  { name: "September", number: 9 },
  { name: "October", number: 10 },
  { name: "November", number: 11 },
  { name: "December", number: 12 },
];

const MainSection = () => {
  const currentMonthIndex = new Date().getMonth();
  const currentMonthName = months[currentMonthIndex].number;

  const [filters, setFilters] = useState({
    sectionId: "",
    groupId: "",
    month: currentMonthName,
    filter: "",
  });

  const { cid } = useParams();
  const { attendanceData, attendanceStat, error, fetchAttendance, loading } =
    useGetAttendanceByClassSectionGroupAndDate();

  const handleFilterChange = (name, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  useEffect(() => {
    const selectedMonth = months.find((m) => m.name === filters.month);
    if (selectedMonth) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        month: selectedMonth.number,
      }));
    }
  }, [filters.month]);
console.log("attendance--",attendanceData);

  useEffect(() => {
    if (cid && filters.month) {
      const year = "2024";
      fetchAttendance(
        cid,
        filters.sectionId,
        filters.groupId,
        filters.month,
        year
      );
    }
  }, [cid, filters.month, filters.sectionId, filters.groupId, fetchAttendance]);

  return (
    <div className="p-4">
      <NavSection
        onFilterChange={(newFilter) => handleFilterChange("filter", newFilter)}
       
      />
      <FilterAttendanceBar
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      {loading ? (
        <Spinner />
      ) : error ? (
        <NoDataFound title="Attendence" />
      ) : (
        <AttendanceTable
          filter={filters.filter}
          attendanceData={attendanceData}
          filters={filters}
        />
      )}
    </div>
  );
};

export default MainSection;
