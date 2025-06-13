import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import StudentDashLayout from "../../../../../../Components/Student/StudentDashLayout";
import AttendanceSummary from "./AttendanceSummary";
import CalendarHeader from "./Calender";
import Spinner from "../../../../../../Components/Common/Spinner";
import OfflineModal from "../../../../../../Components/Common/Offline";
import { stdAttendance } from "../../../../../../Store/Slices/Student/MyClass/Class/Attendance/stdAttendance.action";
import { setShowError } from "../../../../../../Store/Slices/Common/Alerts/alertsSlice";

const AttendanceMain = () => {
  const dispatch = useDispatch();

  // Redux data
  const { loading, error, attendanceData } = useSelector(
    (store) => store?.student?.studentAttendance
  );
  const { showError } = useSelector((store) => store?.common?.alertMsg);

  // Set initial month and year to the current month (June 2025, since today is June 13, 2025)
  const today = new Date(); // Use native Date object
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth()); // 5 (June, 0-11)
  const [selectedYear, setSelectedYear] = useState(today.getFullYear()); // 2025
  const currentYear = today.getFullYear();
  const yearList = [currentYear - 1, currentYear, currentYear + 1];


  // Fetch attendance when selectedMonth or selectedYear changes
  useEffect(() => {
    const month = selectedMonth + 1; // 1-12 for API (e.g., 6 for June)
    const year = selectedYear; // Use selectedYear directly
    dispatch(stdAttendance({ month, year }));
  }, [selectedMonth, selectedYear, dispatch]);

  // Handle month change from Select (do not affect year)
  const onMonthChange = (newMonth) => {
    setSelectedMonth(newMonth);
  };

  // Handle year change from Select
  const onYearChange = (newYear) => {
    // Clamp year to yearList
    const minYear = yearList[0];
    const maxYear = yearList[yearList.length - 1];
    let clampedYear = newYear;
    if (newYear < minYear) {
      clampedYear = minYear;
    } else if (newYear > maxYear) {
      clampedYear = maxYear;
    }
    setSelectedYear(clampedYear);
  };

  const handleDismiss = () => {
    dispatch(setShowError(false));
  };

  

  return (
    <StudentDashLayout>
      <div className="container mx-auto py-4">
        <AttendanceSummary />
        <div className=" border-t border-gray-200 my-4 p-4">
          {loading ? (
            <div className="w-full flex flex-col items-center justify-center py-20">
              <Spinner />
            </div>
          ) : (
            <CalendarHeader
              attendanceData={attendanceData}
              onMonthChange={onMonthChange}
              onYearChange={onYearChange}
              yearList={yearList}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
            />
          )}
        </div>
      </div>
      {!loading && showError && (
        <OfflineModal error={error} onDismiss={handleDismiss} />
      )}
    </StudentDashLayout>
  );
};

export default AttendanceMain;