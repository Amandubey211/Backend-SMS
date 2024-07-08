import React from "react";
import { attendanceData } from "./Data/AttendenceData";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";

const AttendanceTable = ({ filter }) => {
  const filterAttendance = (students, filter) => {
    if (filter === "Present Today 0000") {
        console.log("Present Today")
      return students.filter((student) =>
        student.attendance.every((status) => status.type === IoCheckmarkCircle)
      );
    } else if (filter === "Absent Today") {
        console.log("Absent Today 000")
      return students.filter((student) =>
        student.attendance.every((status) => status.type === IoCloseCircle)
      );
    } else {
      return students;
    }
  };

  const filteredStudents = filterAttendance(attendanceData, filter);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-2 py-3   bg-gray-50 text-left  font-semibold text-sm leading-4 text-gray-600 uppercase tracking-wider">
              Student ID / Name
            </th>
            {[...Array(31).keys()].map((day) => (
              <th
                key={day}
                className="py-3 bg-gray-50 font-semibold text-center text-sm leading-4 text-gray-600 uppercase tracking-wider"
              >
                {day + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student.id}>
              <td className="px-6 py-2 whitespace-no-wrap border-gray-300">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={`https://i.pravatar.cc/150?img=${Math.floor(
                        Math.random() * 70
                      )}`}
                      alt=""
                    />
                  </div>
                  <div className="ml-1">
                    <div className="text-sm leading-5 font-medium text-gray-500">
                      {student.name}
                    </div>
                    <div className="text-sm leading-5 text-gray-500">
                      {student.id}
                    </div>
                  </div>
                </div>
              </td>
              {student.attendance.map((status, index) => (
                <td
                  key={index}
                  className="whitespace-no-wrap border-gray-300 text-center"
                >
                  {status}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
