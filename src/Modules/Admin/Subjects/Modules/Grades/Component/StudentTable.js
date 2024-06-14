import React from "react";
import TableHeader from "./TableHeader";

import studentsGrades from "../dummydata/dummystudents";
import TableRow from "./TableRow";


const StudentTable = () => {
  return (
    <div className="p-4 bg-white shadow-md">
      <table className="min-w-full">
        <TableHeader />
        <tbody>
          {studentsGrades.map((student) => (
            <TableRow key={student.id} student={student} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
