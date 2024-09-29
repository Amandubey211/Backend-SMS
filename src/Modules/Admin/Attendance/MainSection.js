import React, { useEffect, useState } from "react";
import NavSection from "./Components/NavSection";
import FilterAttendanceBar from "./Components/FilterAttendanceBar";
import AttendanceTable from "./Components/AttendanceTable";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../Components/Common/Spinner";
import NoDataFound from "../../../Components/Common/NoDataFound";
import { months } from "./Components/Data/AttendenceData";
import {
  fetchAttendance,
  fetchAttendanceByClassSectionGroupDate,
} from "../../../Store/Slices/Admin/Class/Attendence/attendanceThunks";

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
  const dispatch = useDispatch();

  // Access attendance data, statistics, loading, and error from Redux
  const { attendanceData, attendanceStat, loading, error } = useSelector(
    (state) => state.admin.attendance
  );

  const handleFilterChange = (name, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (cid && filters.month) {
      console.log("sdfsdfsdfsdf");
      const year = "2024";
      dispatch(
        fetchAttendanceByClassSectionGroupDate({
          classId: cid,
          sectionId: filters.sectionId,
          groupId: filters.groupId,
          month: filters.month,
          year,
        })
      );
    }
  }, [cid, filters, dispatch]);

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
