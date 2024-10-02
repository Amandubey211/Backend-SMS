import React, { useEffect } from "react";
import NavSection from "./Components/NavSection";
import FilterAttendanceBar from "./Components/FilterAttendanceBar";
import AttendanceTable from "./Components/AttendanceTable";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../Components/Common/Spinner";
import NoDataFound from "../../../Components/Common/NoDataFound";
import { fetchStudentsMonthAttendanceList } from "../../../Store/Slices/Admin/Class/Attendence/attendanceThunks";

const MainSection = () => {
  const dispatch = useDispatch();
  const { cid } = useParams(); // Get class ID from URL

  const { loading, error, filters } = useSelector(
    (state) => state.admin.attendance
  );

  useEffect(() => {
    if (cid && filters.month) {
      const year = new Date().getFullYear(); // Use the current year dynamically

      dispatch(
        fetchStudentsMonthAttendanceList({
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
      <NavSection />
      <FilterAttendanceBar />
      {loading ? (
        <Spinner />
      ) : error ? (
        <NoDataFound title="Attendance" />
      ) : (
        <AttendanceTable />
      )}
    </div>
  );
};

export default MainSection;
