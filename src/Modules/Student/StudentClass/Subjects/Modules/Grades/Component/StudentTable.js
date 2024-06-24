import React from "react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import { FaExclamationTriangle } from "react-icons/fa";

const StudentTable = ({ students, onRowClick }) => {
  return (
    <div className="p-4 bg-white">
      {students.length > 0 ? (
        <table className="min-w-full">
          <TableHeader />
          <tbody>
            {students.map((student) => (
              <TableRow key={student.id} student={student} onRowClick={() => onRowClick(student)} />
            ))}
          </tbody>
        </table>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500">
          <FaExclamationTriangle className="w-12 h-12 mb-3" />
          <p className="text-lg font-semibold">No data found</p>
        </div>
      )}
    </div>
  );
};

export default StudentTable;
