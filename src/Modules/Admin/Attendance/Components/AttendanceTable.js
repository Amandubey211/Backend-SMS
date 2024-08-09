import React from "react";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import { FaCircle, FaExclamationCircle } from "react-icons/fa";
import profileIcon from '../../../../Assets/DashboardAssets/profileIcon.png'

const AttendanceTable = ({ filter, attendanceData, filters }) => {
  const { month } = filters;

  const getDaysInMonth = (month) => {
    return new Date(new Date().getFullYear(), month, 0).getDate();
  };

  // const transformData = (attendanceData) => {
  //   const daysInMonth = getDaysInMonth(month);
  //   const students = {};

  //   if (attendanceData) {
  //     attendanceData.forEach((record) => {
  //       record.attendanceStatus?.forEach((dateRecord) => {
  //         dateRecord.date?.forEach((entry) => {
  //           const studentId = entry.studentId;
  //           if (!students[studentId]) {
  //             const studentProfile = data.studentProfiles?.find(
  //               (profile) => profile.studentId === studentId
  //             );
  //             students[studentId] = {
  //               ...studentProfile,
  //               attendance: Array(daysInMonth).fill("-"), // Default to "-" if no record exists
  //               total: { present: 0, absent: 0, late: 0, leave: 0 }, // Initialize total attendance counters
  //             };
  //           }
  //           const date = new Date(dateRecord.date).getDate() - 1;
  //           const statusIcon = getStatusIcon(entry.status);
  //           students[studentId].attendance[date] = statusIcon;
  //           students[studentId].total[entry.status]++;
  //         });
  //       });
  //     });
  //   }

  //   return Object.values(students);
  // };


  const transformData = (attendanceData) => {
    const daysInMonth = getDaysInMonth(month);
    const students = {};

    attendanceData.forEach((record) => {
      const { studentId, name, admissionNumber, profile, attendanceStatus } = record;

      if (!students[studentId]) {
        students[studentId] = {
          studentId,
          name,
          admissionNumber,
          profile,
          attendance: Array(daysInMonth).fill("-"), // Default to "-"
          total: { present: 0, absent: 0, late: 0, leave: 0 }, // Initialize counters
        };
      }

      attendanceStatus.forEach(({ date, status }) => {
        const day = new Date(date).getDate() - 1; // Get the day of the month (0-indexed)
        students[studentId].attendance[day] = getStatusIcon(status);
        students[studentId].total[status]++;
      });
    });

    return Object.values(students);
  };



  const getStatusIcon = (status) => {
    switch (status) {
      case "leave":
        return <FaCircle className="text-yellow-300" />;
      case "absent":
        return <IoCloseCircle className="text-red-500" />;
      case "late":
        return <FaExclamationCircle className="text-orange-500" />;
      case "present":
        return <IoCheckmarkCircle className="text-green-500" />;
      default:
        return "-";
    }
  };

  const filteredStudents = transformData(attendanceData);
  console.log("filteredStudents", filteredStudents);

  return (
    <div className="overflow-x-auto">
      {filteredStudents.length > 0 ? (
        <table className="min-w-full bg-white table-fixed">
          <thead>
            <tr>
              <th className="w-1/4 px-2 py-3 bg-gray-50 text-left font-semibold text-sm leading-4 text-gray-600 uppercase tracking-wider">
                Student ID / Name
              </th>
              {[...Array(getDaysInMonth(month)).keys()].map((day) => (
                <th
                  key={day}
                  className="w-1/31 py-3 bg-gray-50 font-normal text-center text-sm leading-4 text-gray-600 uppercase tracking-wider"
                  style={{ width: "2%" }}
                >
                  {day + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredStudents?.map((student) => (
              <tr key={student.studentId}>
                <td className="w-1/4 px-2 py-2 whitespace-no-wrap border-gray-300 border-b">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={
                          student.profile || profileIcon
                        }
                        alt={`${student.firstName} ${student.lastName}`}
                      />
                    </div>
                    <div className="ml-2">
                      <div className="text-sm leading-5 font-medium text-gray-500">
                        {student.name}
                      </div>
                      <div className="text-sm leading-5 text-gray-500">
                        {student.admissionNumber}
                      </div>
                    </div>
                  </div>
                </td>
                {student?.attendance?.map((status, index) => (
                  <td
                    key={index}
                    className="whitespace-no-wrap border-gray-300 border-b text-center"
                    style={{ width: "2%" }}
                  >
                    <div className="flex justify-center items-center">
                      {status}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center py-10">
          <h2 className="text-2xl font-semibold text-gray-600">
            No attendance records found for the selected filters.
          </h2>
        </div>
      )}
    </div>
  );
};

export default AttendanceTable;
