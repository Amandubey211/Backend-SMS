import React, { useEffect, useState } from "react";
import CalendarHeader from "../../../../../Student/StudentClass/SubClass/Components/Attendance/Calender";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { FaCheckCircle, FaDoorOpen, FaTimesCircle } from "react-icons/fa";
import { fetchStudentAttendance } from "../../../../../../Store/Slices/Admin/Users/Students/student.action";
import Spinner from "../../../../../../Components/Common/Spinner";
import { useTranslation } from "react-i18next";
import ProtectedSection from "../../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../../config/permission";

const StudentAttendance = ({ student }) => {
  const { t } = useTranslation("admAccounts");
  // Set initial date to May 2025 to match the data
  const [selectedMonth, setSelectedMonth] = useState(5); // May (0-11, so 4)
  const [selectedYear, setSelectedYear] = useState(moment().year()); // Current year (2025)

  const { StudentAttendance, StudentAttendanceSummary, loading } = useSelector(
    (store) => store.admin.all_students
  );
  const dispatch = useDispatch();

  // Generate yearList dynamically: previous year, current year, next year
  const currentYear = moment().year();
  const yearList = [currentYear - 1, currentYear, currentYear + 1];

  const onMonthChange = (newMonth) => {
    setSelectedMonth(newMonth);
  };

  const onYearChange = (newYear) => {
    setSelectedYear(newYear);
  };

  useEffect(() => {
    if (student?._id) {
      dispatch(
        fetchStudentAttendance({
          month: selectedMonth + 1, // moment months are 0-11, API expects 1-12
          year: selectedYear,
          studentId: student?._id,
        })
      );
    }
  }, [dispatch, selectedMonth, selectedYear, student]);

  // Create a moment object for the Calendar component to use
  const calendarValue = moment(`${selectedYear}-${selectedMonth + 1}-01`, "YYYY-M-DD");

  return loading ? (
    <div className="flex w-full h-[90vh] flex-col items-center justify-center">
      <Spinner />
    </div>
  ) : (
    <ProtectedSection
      requiredPermission={PERMISSIONS.GET_STUDENT_ATTENDENCE}
      title={"Attendance"}
    >
      <div className="container mx-auto py-4">
        {/* Attendance Summary */}
        <div className="flex justify-around px-4 space-x-4">
          <div className="flex items-center bg-green-100 p-4 pl-10 rounded-lg w-1/3">
            <div className="bg-white rounded-full p-4">
              <FaCheckCircle className="text-3xl text-green-500" />
            </div>
            <div className="flex flex-col items-start ml-4">
              <span className="text-3xl text-gray-700">
                {StudentAttendanceSummary?.presentCount || 0}
              </span>
              <span className="mt-1 text-green-600">{t("Total Present")}</span>
            </div>
          </div>
          <div class="flex items-center bg-red-100 p-4 rounded-lg w-1/3">
            <div class="bg-white rounded-full p-4">
              <FaTimesCircle class="text-3xl text-red-500" />
            </div>
            <div class="flex flex-col items-start ml-4">
              <span class="text-3xl text-gray-700">
                {StudentAttendanceSummary?.absentCount || 0}
              </span>
              <span class="mt-1 text-red-600">{t("Total Absent")}</span>
            </div>
          </div>
          <div class="flex items-center bg-purple-100 p-4 rounded-lg w-1/3">
            <div class="bg-white rounded-full p-4">
              <FaDoorOpen class="text-3xl text-purple-500" />
            </div>
            <div class="flex flex-col items-start ml-4">
              <span class="text-3xl text-gray-700">
                {StudentAttendanceSummary?.leaveCount || 0}
              </span>
              <span class="mt-1 text-purple-600">{t("Total Leave")}</span>
            </div>
          </div>
        </div>
        {/* Calendar Component */}
        <div class="border-b border-t border-gray-200 my-4 p-4">
          <CalendarHeader
            attendanceData={StudentAttendance || {}}
            onMonthChange={onMonthChange}
            onYearChange={onYearChange}
            yearList={yearList}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
        </div>
      </div>
    </ProtectedSection>
  );
};

export default StudentAttendance;