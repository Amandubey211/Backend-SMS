import React from "react";

const GraduateList = ({ students, selectedStudents, setSelectedStudents, onViewDetails, onDemoteStudents }) => {

  // Function to handle individual row selection
  const handleSelect = (studentId) => {
    setSelectedStudents((prevSelected) => {
      if (prevSelected.includes(studentId)) {
        return prevSelected.filter((id) => id !== studentId);
      } else {
        return [...prevSelected, studentId];
      }
    });
  };

  // Function to handle "Select All" checkbox
  const handleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]); // Deselect all if all are already selected
    } else {
      const allStudentIds = students.map((student) => student._id);
      setSelectedStudents(allStudentIds); // Select all
    }
  };

  // Check if all students are selected
  const isAllSelected = selectedStudents.length === students.length;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">All Graduates</h1>

        {selectedStudents.length > 0 && (
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md"
            onClick={() => onDemoteStudents(selectedStudents)}
          >
            {selectedStudents.length === 1 ? "Demote Student" : "Demote All Students"}
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-lg shadow-md">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-2 px-3 text-center align-middle w-10">
                <input
                  type="checkbox"
                  className="align-middle"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="py-2 px-3 text-left text-xs font-semibold text-gray-600">
                Profile
              </th>
              <th className="py-2 px-3 text-left text-xs font-semibold text-gray-600">
                Name
              </th>
              <th className="py-2 px-3 text-left text-xs font-semibold text-gray-600">
                QID
              </th>
              <th className="py-2 px-3 text-left text-xs font-semibold text-gray-600">
                Admission Number
              </th>
              <th className="py-2 px-3 text-left text-xs font-semibold text-gray-600">
                Graduation Year
              </th>
              <th className="py-2 px-3 text-left text-xs font-semibold text-gray-600">
                Email
              </th>
              <th className="py-2 px-3 text-left text-xs font-semibold text-gray-600">
                Contact
              </th>
              <th className="py-2 px-3 text-left text-xs font-semibold text-gray-600">
                Parent Contact
              </th>
              <th className="py-2 px-3 text-xs"></th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr
                key={student._id} // Use _id as the key since that's the ID from backend
                className="hover:bg-gray-50 transition-all duration-200 border-b"
              >
                <td className="py-2 px-3 text-center align-middle w-10">
                  <input
                    type="checkbox"
                    className="align-middle"
                    checked={selectedStudents.includes(student._id)}
                    onChange={() => handleSelect(student._id)}
                  />
                </td>
                <td className="py-2 px-3">
                  <img
                    src={student.profile}
                    alt={`${student.firstName} ${student.lastName}`}
                    className="w-8 h-8 rounded-full border-2 border-gray-300"
                  />
                </td>
                <td className="py-2 px-3 text-xs whitespace-nowrap">
                  {student.firstName} {student.lastName}
                </td>
                <td className="py-2 px-3 text-xs whitespace-nowrap">
                  {student.Q_Id}
                </td>
                <td className="py-2 px-3 text-xs whitespace-nowrap">
                  {student.admissionNumber}
                </td>
                <td className="py-2 px-3 text-xs whitespace-nowrap">
                  {student.academicYear?.year}
                </td>
                <td className="py-2 px-3 text-xs truncate max-w-xs">
                  {student.email}
                </td>
                <td className="py-2 px-3 text-xs whitespace-nowrap">
                  {student.contactNumber}
                </td>
                <td className="py-2 px-3 text-xs whitespace-nowrap">
                  {student.guardianContactNumber}
                </td>
                <td className="py-2 px-3">
                  <button
                    onClick={() => onViewDetails(student)}
                    className="px-2 py-1 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 hover:shadow-md transition-all duration-200 text-xs"
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
