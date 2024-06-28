import React from 'react';

const DeleteStudent = ({ studentId }) => {
  return (
    <div>
      <h2>Delete Student</h2>
      <p>Student ID: {studentId}</p>
      {/* Additional delete student logic */}
    </div>
  );
};

export default DeleteStudent;
