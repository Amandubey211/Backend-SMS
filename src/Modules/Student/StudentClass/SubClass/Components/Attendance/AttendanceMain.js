// AttendanceMain.jsx

import React, { useEffect, useState } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";

import StudentDashLayout from "../../../../../../Components/Student/StudentDashLayout";
import AttendanceSummary from "./AttendanceSummary";
import CalendarHeader from "./Calender";
import Spinner from "../../../../../../Components/Common/Spinner";
import OfflineModal from "../../../../../../Components/Common/Offline";
import { stdAttendance } from "../../../../../../Store/Slices/Student/MyClass/Class/Attendance/stdAttendance.action";
import { setShowError } from "../../../../../../Store/Slices/Common/Alerts/alertsSlice";
import { getDistinctYears } from "../../../../../../Utils/academivYear";

const AttendanceMain = () => {
  const dispatch = useDispatch();

  // Redux data
  const { loading, error, attendanceData } = useSelector(
    (store) => store?.student?.studentAttendance
  );
  const { showError } = useSelector((store) => store?.common?.alertMsg);
  const { academicYears } = useSelector((store) => store.common.academicYear);

  // Extract distinct numeric years from the academic year array

  const yearList = getDistinctYears(academicYears); // e.g. [2024, 2025, 2026]
  console.log(yearList, "yearList");

  // 1) Decide an initial date:
  //    - Start with today's date (moment()),
  //    - If today's year is not in yearList, clamp to the nearest valid year in yearList.
  const today = moment();
  const currentYear = today.year();

  let initialDate = today;
  if (yearList.length > 0) {
    const minYear = yearList[0];
    const maxYear = yearList[yearList.length - 1];

    if (currentYear < minYear) {
      initialDate = today.clone().year(minYear);
    } else if (currentYear > maxYear) {
      initialDate = today.clone().year(maxYear);
    }
  }
  console.log(initialDate, "initialDate");

  const [selectedDate, setSelectedDate] = useState(initialDate);

  // 2) On mount or whenever selectedDate changes, fetch attendance
  useEffect(() => {
    const month = selectedDate.month() + 1;
    const year = selectedDate.year();
    dispatch(stdAttendance({ month, year }));
  }, [selectedDate, dispatch]);

  // 3) On user navigating the calendar (e.g., next month, next year),
  //    clamp the year to your valid range so it never goes 2031 if not allowed.
  const onPanelChange = (value) => {
    if (yearList.length === 0) {
      setSelectedDate(value);
      return;
    }

    const newYear = value.year();
    const minYear = yearList[0];
    const maxYear = yearList[yearList.length - 1];

    if (newYear < minYear) {
      setSelectedDate(value.clone().year(minYear));
    } else if (newYear > maxYear) {
      setSelectedDate(value.clone().year(maxYear));
    } else {
      setSelectedDate(value);
    }
  };

  const handleDismiss = () => {
    dispatch(setShowError(false));
  };

  return (
    <StudentDashLayout>
      <div className="container mx-auto py-4">
        <AttendanceSummary />
        <div className="border-b border-t border-gray-200 my-4 p-4">
          {loading ? (
            <div className="w-full flex flex-col items-center justify-center py-20">
              <Spinner />
            </div>
          ) : (
            <CalendarHeader
              attendanceData={attendanceData}
              onPanelChange={onPanelChange}
              value={selectedDate}
              yearList={yearList}
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
