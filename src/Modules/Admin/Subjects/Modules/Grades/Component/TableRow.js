import React from "react";
import profileIcon from "../../../../../../Assets/DashboardAssets/profileIcon.png";
const TableRow = ({ student, onRowClick }) => {
  return (
    <tr className="border-b hover:bg-gray-50 ">
      <td className="p-3 flex items-center cursor-pointer" onClick={onRowClick}>
        <img
          src={student?.studentProfile || profileIcon}
          alt={student.studentName}
          className="w-10 h-10 rounded-full mr-3 bg-gray-500"
        />
        <div>
          <div className="font-medium">{student.studentName}</div>
          <div className="text-green-600">{student.section || "Section 1"}</div>
        </div>
      </td>
      <td className="p-3">{student.group || "No Group"}</td>
      <td className="p-3 text-center">
        <div className="border text-pink-600 py-1 rounded-md">
           {student.completedAssignmentsScore}/ {student.totalAssignmentsPoints }
        </div>
      </td>
      <td className="p-3 text-center">
        <div className="border text-green-600 py-1 rounded-md">
          {student.completedQuizzes}/{student.totalQuizzes}
        </div>
      </td>
      <td className="p-3 text-center">
        <div className="border py-1  rounded-md">{student.attendance}</div>
      </td>
      <td className="p-3 text-pink-600 text-center">{student.score=='NaN'?0:student.score} %</td>
    </tr>
  );
};

export default TableRow;
