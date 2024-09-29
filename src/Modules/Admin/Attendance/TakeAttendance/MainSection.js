import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomCalendar from "./Components/Calendar";
import Filters from "./Components/Filters";
import AttendanceTable from "./Components/AttendanceTable";
import Statistics from "./Components/Stats";
import Header from "./Components/Header";

import { useParams } from "react-router-dom";
import Spinner from "../../../../Components/Common/Spinner";
import NoDataFound from "../../../../Components/Common/NoDataFound";
import {
  fetchAttendanceByClassSectionGroupDate,
  markAttendance,
} from "../../../../Store/Slices/Admin/Class/Attendence/attendanceThunks";

const MainSection = () => {
  const [filters, setFilters] = useState({
    sectionId: "",
    groupId: "",
  });

  const [selectedDate, setSelectedDate] = useState(new Date());

  const dispatch = useDispatch();
  const { cid } = useParams();

  const { attendanceData, loading, error } = useSelector(
    (state) => state.admin.attendance
  );

  const handleFilterChange = (name, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleMarkAttendance = async () => {
    const attendanceToMark = attendanceData
      .filter((student) => student.attendanceStatus !== "not marked")
      .map((student) => ({
        studentId: student.studentId,
        status: student.attendanceStatus,
      }));

    dispatch(
      markAttendance({
        classId: cid,
        sectionId: filters.sectionId,
        date: selectedDate,
        studentEntry: attendanceToMark,
      })
    );
  };

  useEffect(() => {
    if (cid) {
      dispatch(
        fetchAttendanceByClassSectionGroupDate({
          classId: cid,
          sectionId: filters.sectionId,
          groupId: filters.groupId,
          date: selectedDate,
        })
      );
    }
  }, [dispatch, cid, filters.sectionId, filters.groupId, selectedDate]);

  return (
    <div className="flex min-h-screen w-full">
      <div className="w-8/12 p-4 bg-white border-r flex flex-col">
        <div className="flex-grow">
          <Filters filters={filters} onFilterChange={handleFilterChange} />
          {loading ? (
            <div className="h-96 flex justify-center items-center">
              <Spinner />
            </div>
          ) : error ? (
            <NoDataFound title="Attendance" />
          ) : (
            <AttendanceTable students={attendanceData} />
          )}
        </div>
      </div>
      <div className="w-4/12 p-4 bg-white flex flex-col">
        <Header onSubmit={handleMarkAttendance} />

        <div className="flex justify-center">
          <CustomCalendar
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </div>
        <div className="flex-grow p-3 mt-1 w-full">
          <Statistics attendanceData={attendanceData} />
        </div>
      </div>
    </div>
  );
};

export default MainSection;
