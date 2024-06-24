import React from 'react';

const students = [
  {
    id: 1,
    name: 'Kathryn Murphy',
    class: 10,
    studentId: 2458,
    section: 2,
    group: 'Science',
    imageUrl: 'path_to_kathryn_image', // Replace with actual image path
  },
  {
    id: 2,
    name: 'Guy Hawkins',
    class: 10,
    studentId: 2458,
    section: 2,
    group: 'Accounting',
    imageUrl: 'path_to_guy_image', // Replace with actual image path
  },
  {
    id: 3,
    name: 'Guy Hawkins',
    class: 10,
    studentId: 2458,
    section: 2,
    group: 'Accounting',
    imageUrl: 'path_to_guy_image', // Replace with actual image path
  },
];

const StudentCard = ({ student }) => {
  return (
    <div className="border rounded-lg p-4 mb-4">
  <div className="flex items-center mb-4">
    <img
      src={student.imageUrl}
      alt={student.name}
      className="w-16 h-16 rounded-full mr-4"
    />
    <div>
      <h2 className="text-xl font-semibold">{student.name}</h2>
    </div>
  </div>
  <div className="text-gray-700 text-center">
    <div className="flex justify-center space-x-4">
      <p>Class: {student.class}</p>
      <p>Id: {student.studentId}</p>
      <p>Section: {student.section}</p>
    </div>
    <p className="mt-2">
      <span className="font-bold">Group: </span>
      <span className="text-green-500">{student.group}</span>
    </p>
  </div>
</div>

  );
};

const StudentParentCard = () => {
  return (
    <div className="p-6">
      {students.map((student) => (
        <StudentCard key={student.id} student={student} />
      ))}
    </div>
  );
};

export default StudentParentCard;
