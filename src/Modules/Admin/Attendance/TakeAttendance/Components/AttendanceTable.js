import React, { useEffect } from "react";
import { FaCheckSquare } from "react-icons/fa";
import { FaSquareXmark, FaRegCircleDot } from "react-icons/fa6";

const AttendanceTable = ({
  filters,
  attendanceData,
  students,
  setStudents,
}) => {
  useEffect(() => {
    if (
      attendanceData &&
      attendanceData.studentProfiles &&
      attendanceData.studentProfiles.length
    ) {
      const studentMap = attendanceData.studentProfiles.reduce(
        (map, student) => {
          map[student.studentId] = {
            id: student.studentId,
            present: false,
            absent: false,
            leave: false,
            ...student,
          };
          return map;
        },
        {}
      );

      setStudents(Object.values(studentMap));
    }
  }, [attendanceData, setStudents]);

  const handleAttendanceChange = (index, type) => {
    const updatedStudents = students.map((student, idx) => {
      if (idx === index) {
        return {
          ...student,
          present: type === "present" ? !student.present : false,
          absent: type === "absent" ? !student.absent : false,
          leave: type === "leave" ? !student.leave : false,
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
              <th className="py-2 border-b border-gray-300">Name</th>
              <th className="py-2 border-b border-gray-300">Present</th>
              <th className="py-2 border-b border-gray-300">Absent</th>
              <th className="py-2 border-b border-gray-300">Leave</th>
            </tr>
          </thead>
          <tbody className="h-full overflow-y-scroll">
            {students.map((student, index) => (
              <tr key={index} className="text-center border-b h-12">
                <td className="py-2 border-gray-300">{index + 1}</td>
                <td className="py-2 border-gray-300">
                  {student.admissionNumber}
                </td>
                <td className="py-2 border-gray-300 flex items-center justify-start ps-6">
                  <img
                    src={student.profileUrl}
                    alt=""
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  {student.firstName} {student.lastName}
                </td>
                <td className="py-2 border-gray-300">
                  <button
                    onClick={() => handleAttendanceChange(index, "present")}
                    className="p-2 rounded"
                  >
                    <FaCheckSquare
                      className={`text-green-500 ${
                        student.present ? "opacity-100" : "opacity-10"
                      }`}
                      size={20}
                    />
                  </button>
                </td>
                <td className="py-2">
                  <button
                    onClick={() => handleAttendanceChange(index, "absent")}
                    className="p-2 rounded"
                  >
                    <FaSquareXmark
                      className={`text-red-500 ${
                        student.absent ? "opacity-100" : "opacity-10"
                      }`}
                      size={20}
                    />
                  </button>
                </td>
                <td className="py-2">
                  <button
                    onClick={() => handleAttendanceChange(index, "leave")}
                    className="p-2 rounded-full"
                  >
                    <FaRegCircleDot
                      className={`text-yellow-500 ${
                        student.leave ? "opacity-100" : "opacity-10"
                      }`}
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
