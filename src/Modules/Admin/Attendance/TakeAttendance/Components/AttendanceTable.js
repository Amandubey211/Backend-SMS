import React, { useEffect, useState } from "react";
import { FaCheckSquare } from "react-icons/fa";
import { FaSquareXmark, FaRegCircleDot } from "react-icons/fa6";
import useGetAttendanceByClassSectionGroupAndDate from "../../../../../Hooks/AuthHooks/Staff/Admin/Attendance/useGetAttendanceByClassSectionGroupAndDate";
import { useParams } from "react-router-dom";

const AttendanceTable = ({
  filters,
  students,
  setStudents,
}) => {
  const { cid } = useParams();
  const { attendanceData, fetchAttendanceByClass } = useGetAttendanceByClassSectionGroupAndDate();

  useEffect(() => {
    fetchAttendanceByClass(cid, '2-2-2024');
  }, [cid, fetchAttendanceByClass]);

  useEffect(() => {
    if (attendanceData?.attendanceList) {
      setStudents(attendanceData.attendanceList);
    }
  }, [attendanceData, setStudents]);

  const handleAttendanceChange = (studentId, type) => {
    const updatedStudents = students.map((student) => {
      if (student.studentId === studentId) {
        return {
          ...student,
          attendanceStatus: type,
        };
      }
      return student;
    });
    setStudents(updatedStudents);
  };

  return (
    <div className="overflow-x-auto w-full">
      <div className="overflow-y-scroll h-96 no-scrollbar">
        <table className="min-w-full bg-white rounded-lg">
          <thead className="sticky top-0 bg-white">
            <tr className="py-2 bg-gray-50">
              <th className="py-2 border-b border-gray-300">SL</th>
              <th className="py-2 border-b border-gray-300">Student ID</th>
              <th className="py-2 pl-10 border-b border-gray-300 flex justify-start">Name</th>
              <th className="py-2 border-b border-gray-300">Present</th>
              <th className="py-2 border-b border-gray-300">Absent</th>
              <th className="py-2 border-b border-gray-300">Leave</th>
            </tr>
          </thead>
          <tbody className="h-full overflow-y-scroll">
            {students.map((student, index) => (
              <tr key={student.studentId} className="text-center border-b h-12">
                <td className="py-2 border-gray-300">{index + 1}</td>
                <td className="py-2 border-gray-300">
                  {student.admissionNumber}
                </td>
                <td className="py-2 border-gray-300 flex items-center justify-start ps-6">
                  <img
                    src={student.profile}
                    alt=""
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  {student.name}
                </td>
                <td className="py-2 border-gray-300">
                  <button
                    onClick={() => handleAttendanceChange(student.studentId, "present")}
                    className="p-2 rounded"
                  >
                    <FaCheckSquare
                      className={`text-green-500 ${student.attendanceStatus === "present" ? "opacity-100" : "opacity-50"}`}
                      size={20}
                    />
                  </button>
                </td>
                <td className="py-2">
                  <button
                    onClick={() => handleAttendanceChange(student.studentId, "absent")}
                    className="p-2 rounded"
                  >
                    <FaSquareXmark
                      className={`text-red-500 ${student.attendanceStatus === "absent" ? "opacity-100" : "opacity-50"}`}
                      size={20}
                    />
                  </button>
                </td>
                <td className="py-2">
                  <button
                    onClick={() => handleAttendanceChange(student.studentId, "leave")}
                    className="p-2 rounded-full"
                  >
                    <FaRegCircleDot
                      className={`text-yellow-500 ${student.attendanceStatus === "leave" ? "opacity-100" : "opacity-50"}`}
                      size={20}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;
