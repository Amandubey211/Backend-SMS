import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import UnVerifiedStudentCard from "./UnVerifiedStudentCard";
import useGetRejectedStudents from "../../../Hooks/AuthHooks/Staff/Admin/Students/useGetRejectedStudents";

const RejectStudents = ({ getColor, searchQuery }) => {
  const [filteredStudents, setFilteredStudents] = useState([]);
  const { getRejectedStudents } = useGetRejectedStudents();
  const students = useSelector((store) => store.Admin.rejectedStudents);
  console.log(students);

  useEffect(() => {
    getRejectedStudents();
  }, []);

  useEffect(() => {
    const filtered = students.filter(
      (student) =>
        !searchQuery ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchQuery, students]);

  return (
    <div className="animate-fadeIn">
      {filteredStudents?.length === 0 && (
        <p className="text-center text-gray-500">No Rejected Student found.</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents?.map((student, index) => (
          <UnVerifiedStudentCard
            key={student._id}
            student={student}
            color={getColor(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default RejectStudents;
