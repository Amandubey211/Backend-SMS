import React from "react";

const TableHeader = () => {
  return (
    <thead>
      <tr className="bg-gray-100">
        <th className="p-3 text-left">Name & Section</th>
        <th className="p-3 text-left">Group</th>
        <th className="p-3 text-left">Assignment</th>
        <th className="p-3 text-left">Quizzes</th>
        <th className="p-3 text-left">Attendance</th>
        <th className="p-3 text-left">Score</th>
      </tr>
    </thead>
  );
};

export default TableHeader;
