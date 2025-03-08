import React, { useEffect } from "react";
import AttendanceSummary from "./AttendanceSummary";
import CalendarHeader from "./Calender";
import StudentDashLayout from "../../../../../../Components/Student/StudentDashLayout";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentDate } from "../../../../../../Store/Slices/Student/MyClass/Class/Attendance/stdAttendanceSlice";
import { stdAttendance } from "../../../../../../Store/Slices/Student/MyClass/Class/Attendance/stdAttendance.action";
import Spinner from "../../../../../../Components/Common/Spinner";
import OfflineModal from "../../../../../../Components/Common/Offline";
import { setShowError } from "../../../../../../Store/Slices/Common/Alerts/alertsSlice";

const AttendanceMain = () => {
  const { loading, error, attendanceData, currentDate } = useSelector(
    (store) => store?.student?.studentAttendance
  );
  const dispatch = useDispatch();
  const { showError } = useSelector((store) => store?.common?.alertMsg);

  const handleDismiss = () => {
    dispatch(setShowError(false));
  };
  useEffect(() => {
    const month = currentDate.month() + 1;
    const year = currentDate.year();
    // fetchAttendance(currentDate.month() + 1, currentDate.year());
    dispatch(stdAttendance({ month, year }));
  }, [dispatch, currentDate]);

  const onPanelChange = (value) => {
    console.log("onPanelChange", value);
    dispatch(setCurrentDate(value));
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
            // : (!loading || attendanceData?.length===0)?
            //   <div className="w-full flex flex-col items-center justify-center py-20">
            //   <NoDataFound/>
            //   </div>
            <CalendarHeader
              attendanceData={attendanceData}
              onPanelChange={onPanelChange}
              currentDate={currentDate}
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
