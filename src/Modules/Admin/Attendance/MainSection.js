import React, { useEffect } from "react";
import NavSection from "./Components/NavSection";
import FilterAttendanceBar from "./Components/FilterAttendanceBar";
import AttendanceTable from "./Components/AttendanceTable";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton, Empty } from "antd";
import { fetchStudentsMonthAttendanceList } from "../../../Store/Slices/Admin/Class/Attendence/attendanceThunks";
import ProtectedSection from "../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../config/permission";

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
      {error ? (
        <Empty description="No attendance data found" />
      ) : (
        <ProtectedSection
          requiredPermission={PERMISSIONS.STUDENT_MONTHLY_ATTENDANCE_LIST}
          title={"Student Attendence"}
        >
          <AttendanceTable />
        </ProtectedSection>
      )}
    </div>
  );
};

export default MainSection;
