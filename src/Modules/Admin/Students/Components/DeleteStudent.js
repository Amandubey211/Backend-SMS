import React from 'react';
import { useSelector } from 'react-redux';

const DeleteStudent = ({ studentId, groupId }) => {
  console.log("grouId--", groupId);
  return (
    <div>
      <button
        className="px-4 py-2 bg-red-500 text-white rounded-md"
        aria-label="Remove student from group"
      >
        Remove Student
      </button>
    </div>
  );
};

export default DeleteStudent;
