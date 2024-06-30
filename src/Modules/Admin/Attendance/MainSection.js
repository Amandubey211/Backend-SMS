import React, { useEffect, useState } from "react";
import NavSection from "./Components/NavSection";
import FilterAttendanceBar from "./Components/FilterAttendanceBar";
import AttendanceTable from "./Components/AttendanceTable";
import { useParams } from "react-router-dom";
import useGetAttendanceByClassSectionGroupAndDate from "../../../Hooks/AuthHooks/Staff/Admin/Attendance/useGetAttendanceByClassSectionGroupAndDate";

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
  const { attendanceData, error, fetchAttendance, loading } =
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
        <div className="flex justify-center items-center w-full">
          <svg
            className="animate-spin h-8 w-8 text-blue-600"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 2.137.835 4.168 2.205 5.709l1.795-1.418z"
            ></path>
          </svg>
        </div>
      ) : error ? (
        // <div className="text-red-500">{error}</div>
        <div className="text-center py-10">
          <h2 className="text-2xl font-semibold text-gray-600">
            No attendance records found for the selected filters.
          </h2>
        </div>
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
