import React from "react";

const GraduateList = ({ students, onViewDetails }) => {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">All Graduates</h1>
      <div className="overflow-hidden rounded-lg shadow-md">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Profile</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Name</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Class</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Section</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Group</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Graduation Year</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Email</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Contact</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Parent Contact</th>
              <th className="py-3 px-4 text-sm"></th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr
                key={student.id}
                className="hover:bg-gray-50 transition-all duration-200 border-b"
              >
                <td className="py-4 px-4">
                  <img
                    src={student.profile}
                    alt={student.name}
                    className="w-13 h-13 rounded-full border-2 border-gray-300 p-0.5"
                  />
                </td>
                <td className="py-4 px-4 text-sm whitespace-nowrap">{student.firstName} {student.lastName}</td>
                <td className="py-4 px-4 text-sm whitespace-nowrap">{student.className}</td>
                <td className="py-4 px-4 text-sm whitespace-nowrap">{student.sectionName}</td>
                <td className="py-4 px-4 text-sm whitespace-nowrap">{student.groupName}</td>
                <td className="py-4 px-4 text-sm whitespace-nowrap">{student.academicYear}</td>
                <td className="py-4 px-4 text-sm truncate max-w-xs">{student.email}</td>
                <td className="py-4 px-4 text-sm whitespace-nowrap">{student.contactNumber}</td>
                <td className="py-4 px-4 text-sm whitespace-nowrap">{student.guardianContactNumber}</td>
                <td className="py-4 px-4">
                  <button 
                    onClick={() => onViewDetails(student)} // Trigger sidebar
                    className="px-3 py-1 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 hover:shadow-md transition-all duration-200 text-sm"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GraduateList;
