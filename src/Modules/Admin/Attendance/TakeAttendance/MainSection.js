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
import { setSelectedDate } from "../../../../Store/Slices/Admin/Class/Attendence/attendanceSlice";
import toast from "react-hot-toast";

const MainSection = () => {
  const dispatch = useDispatch();
  const { cid } = useParams();

  const { attendanceData, loading, error, filters, selectedDate } = useSelector(
    (state) => state.admin.attendance
  );

  const [isSectionInvalid, setIsSectionInvalid] = useState(false);

  const handleMarkAttendance = async () => {
    console.log("--", attendanceData);

    // Validate sectionId before dispatching the markAttendance action
    if (!filters.sectionId) {
      toast.error("Please select a section first.");
      setIsSectionInvalid(true);
      return;
    }

    setIsSectionInvalid(false); // Reset invalid state if section is valid

    // Filter and map attendance data
    const attendanceToMark = attendanceData
      ?.filter((student) => student?.attendanceStatus !== "not marked")
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
          <Filters isSectionInvalid={isSectionInvalid} />
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

      {/* Adjust the layout here */}
      <div className="w-4/12 p-4 bg-white flex flex-col space-y-4">
        {/* Keep enough vertical space for the stats below */}
        <Header onSubmit={handleMarkAttendance} loading={loading} />
        <div className="flex justify-center">
          <CustomCalendar
            selectedDate={selectedDate}
            setSelectedDate={(date) => dispatch(setSelectedDate(date))}
          />
        </div>

        <div className="flex-grow overflow-auto p-3  w-full">
          <Statistics />
        </div>
      </div>
    </div>
  );
};

export default MainSection;
