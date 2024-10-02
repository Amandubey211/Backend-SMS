import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCheckCircle, FaTimesCircle, FaCircle } from "react-icons/fa";
import { updateStudentAttendanceStatus } from "../../../../../Store/Slices/Admin/Class/Attendence/attendanceSlice";
import toast from "react-hot-toast"; // Importing the toast

const AttendanceTable = () => {
  const dispatch = useDispatch();
  const { attendanceData, filters } = useSelector(
    (state) => state.admin.attendance
  ); // Filters from Redux

  const handleAttendanceChange = (studentId, status) => {
    // Check if sectionId is selected when clicking Present, Absent, or Leave
    if (!filters.sectionId) {
      toast.error("Please select a section first."); // Displaying the toast message
      return;
    }

    // If sectionId is valid, update the student's attendance status
    dispatch(updateStudentAttendanceStatus({ studentId, status }));
  };

  return (
    <div className="overflow-x-auto w-full">
      <div className="overflow-y-scroll h-96 no-scrollbar">
        <table className="min-w-full bg-white rounded-lg">
          <thead className="sticky top-0 bg-white">
            <tr className="py-2 bg-gray-50">
              <th className="py-2 border-b border-gray-300">SL</th>
              <th className="py-2 border-b border-gray-300">Student ID</th>
              <th className="py-2 pl-10 border-b border-gray-300 flex justify-start">
                Name
              </th>
              <th className="py-2 border-b border-gray-300">Present</th>
              <th className="py-2 border-b border-gray-300">Absent</th>
              <th className="py-2 border-b border-gray-300">Leave</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.length > 0 ? (
              attendanceData.map((student, index) => (
                <tr
                  key={student.studentId}
                  className="text-center border-b h-12"
                >
                  <td className="py-2 border-gray-300">{index + 1}</td>
                  <td className="py-2 border-gray-300">
                    {student.admissionNumber}
                  </td>
                  <td className="py-2 border-gray-300 flex items-center justify-start ps-6">
                    <img
                      src={student.profile}
                      alt="profile"
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    {student.name}
                  </td>
                  <td className="py-2 border-gray-300">
                    <button
                      onClick={() =>
                        handleAttendanceChange(student.studentId, "present")
                      }
                      className="p-2 rounded"
                    >
                      <FaCheckCircle
                        className={`text-green-500 ${
                          student.attendanceStatus === "present"
                            ? "opacity-100"
                            : "opacity-30"
                        }`}
                        size={20}
                      />
                    </button>
                  </td>
                  <td className="py-2 border-gray-300">
                    <button
                      onClick={() =>
                        handleAttendanceChange(student.studentId, "absent")
                      }
                      className="p-2 rounded"
                    >
                      <FaTimesCircle
                        className={`text-red-500 ${
                          student.attendanceStatus === "absent"
                            ? "opacity-100"
                            : "opacity-30"
                        }`}
                        size={20}
                      />
                    </button>
                  </td>
                  <td className="py-2 border-gray-300">
                    <button
                      onClick={() =>
                        handleAttendanceChange(student.studentId, "leave")
                      }
                      className="p-2 rounded-full"
                    >
                      <FaCircle
                        className={`text-yellow-500 ${
                          student.attendanceStatus === "leave"
                            ? "opacity-100"
                            : "opacity-30"
                        }`}
                        size={20}
                      />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="text-center text-2xl py-10 text-gray-400"
                  colSpan={6}
                >
                  No Student Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;
