import React, { useState, useEffect } from "react";
import CustomCalendar from "./Components/Calendar";
import Filters from "./Components/Filters";
import AttendanceTable from "./Components/AttendanceTable";
import Statistics from "./Components/Stats";
import Header from "./Components/Header";
import useMarkAttendance from "../../../../Hooks/AuthHooks/Staff/Admin/Attendance/useMarkAttendance";
import useGetAttendanceByClassSectionGroupAndDate from "../../../../Hooks/AuthHooks/Staff/Admin/Attendance/useGetAttendanceByClassSectionGroupAndDate";
import { useParams } from "react-router-dom";
import Spinner from "../../../../Components/Common/Spinner";
import NoDataFound from "../../../../Components/Common/NoDataFound";

const MainSection = () => {
  const [filters, setFilters] = useState({
    sectionId: "",
    groupId: "",
  });
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date()); // State for selected date

  const {
    markAttendance,
    loading: markingLoading,
    error: markingError,
  } = useMarkAttendance();
  const {
    fetchAttendance,
    loading: fetchingLoading,
    error: fetchingError,
    attendanceData,
  } = useGetAttendanceByClassSectionGroupAndDate();
  const { cid } = useParams();

  useEffect(() => {
    if (cid || filters.sectionId || filters.groupId) {
      fetchAttendance(cid, filters.sectionId, filters.groupId, 6, "2024");
    }
  }, [filters.sectionId, filters.groupId, fetchAttendance, cid]);

  const handleFilterChange = (name, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const formatDate = (date) => {
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
    return adjustedDate.toISOString().split("T")[0];
  };

  const handleMarkAttendance = async (attendanceData) => {
    await markAttendance(attendanceData);
  };

  const handleSubmitAttendance = () => {
    const attendanceData = {
      classId: cid,
      teacherId: "66715f2cdfb15fc5c53c0b8a", // Replace with actual teacher ID
      sectionId: filters.sectionId,
      groupId: filters.groupId,
      date: formatDate(selectedDate), // Use formatted date
      studentEntry: students
        .map((student) => ({
          studentId: student.id,
          status: student.present
            ? "present"
            : student.absent
            ? "absent"
            : student.leave
            ? "leave"
            : null,
        }))
        .filter((entry) => entry.status !== null),
    };

    handleMarkAttendance(attendanceData);
    // console.log(attendanceData.date)
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* This section should take 70% of the space */}
      <div className="w-8/12 p-4 bg-white border-r flex flex-col">
        <Header onSubmit={handleSubmitAttendance} loading={markingLoading} />
        <div className="flex-grow">
          <Filters filters={filters} onFilterChange={handleFilterChange} />
          {fetchingLoading ? (
            <Spinner />
          ) : fetchingError ? (
            <NoDataFound title="Attendence" />
          ) : (
            <AttendanceTable
              filters={filters}
              attendanceData={attendanceData}
              // loading={markingLoading}
              students={students}
              setStudents={setStudents}
            />
          )}
        </div>
      </div>
      {/* This section should take 30% of the space */}
      <div className="w-4/12 p-4 bg-white flex flex-col">
        <div className="flex justify-center items-center">
          <button
            className="px-6 py-2 mb-2 w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:bg-gradient-to-r hover:from-pink-700 hover:to-purple-700 text-white rounded-md shadow-lg"
            onClick={handleSubmitAttendance}
          >
            {markingLoading ? "Marking.." : "Submit Attendance"}
          </button>
        </div>
        <div className="flex justify-center">
          <CustomCalendar
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />{" "}
        </div>
        <div className="flex-grow p-3 mt-1 w-full">
          <Statistics />
        </div>
      </div>
    </div>
  );
};

export default MainSection;
