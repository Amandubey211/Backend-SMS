import React, { useEffect } from "react";
import AttendanceSummary from "./AttendanceSummary";
import CalendarHeader from "./Calender";
import StudentDashLayout from "../../../../../../Components/Student/StudentDashLayout";
import useNavHeading from "../../../../../../Hooks/CommonHooks/useNavHeading ";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentDate } from "../../../../../../Store/Slices/Student/MyClass/Class/Attendance/stdAttendanceSlice";
import { stdAttendance } from "../../../../../../Store/Slices/Student/MyClass/Class/Attendance/stdAttendance.action";
import { GoAlertFill } from "react-icons/go";
import Spinner from "../../../../../../Components/Common/Spinner";

const AttendanceMain = () => {
  const { loading, error, attendanceData, summary, currentDate } = useSelector((store) => store?.student?.studentAttendance);
  const dispatch = useDispatch();
  useEffect(() => {
    const month = currentDate.month() + 1;
    const year = currentDate.year();
    // fetchAttendance(currentDate.month() + 1, currentDate.year());
    dispatch(stdAttendance({ month, year }))
  }, [dispatch, currentDate]);

  const onPanelChange = (value) => {
    dispatch(setCurrentDate(value));
  };

  return (
    <StudentDashLayout>
      <div className="container mx-auto py-4">
        <AttendanceSummary />
        <div className="border-b border-t border-gray-200 my-4 p-4">
          {loading ?
            <div className="w-full flex flex-col items-center justify-center py-20">
              <Spinner />
            </div>
            : error ?
              <div className="w-full flex flex-col items-center justify-center py-20">
                <GoAlertFill className="inline-block w-12 h-12 mb-3" />
                <p className="text-lg font-semibold">{error}</p>
              </div> :
              <CalendarHeader
                attendanceData={attendanceData}
                onPanelChange={onPanelChange}
                currentDate={currentDate}
              />
              }
        </div>
      </div>
    </StudentDashLayout>
  );
};

export default AttendanceMain;
