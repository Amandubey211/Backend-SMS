import React from "react";

const TableRow = ({ student, onRowClick }) => {
  return (
    <tr className="border-b hover:bg-gray-50 ">
      <td className="p-3 flex items-center cursor-pointer" onClick={onRowClick}>
        <img
          src={student.avatar}
          alt={student.name}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <div className="font-medium">{student.name}</div>
          <div className="text-green-600">{student.section}</div>
        </div>
      </td>
      <td className="p-3">{student.group}</td>
      <td className="p-3 text-center">
        <div className="border text-pink-600 py-1 rounded-md">
          {student.assignment}
        </div>
      </td>
      <td className="p-3 text-center">
        <div className="border text-green-600 py-1 rounded-md">
          {student.quizzes}
        </div>
      </td>
      <td className="p-3 text-center">
        <div className="border py-1  rounded-md">{student.attendance}</div>
      </td>
      <td className="p-3 text-pink-600">{student.score}</td>
    </tr>
  );
};

export default TableRow;
