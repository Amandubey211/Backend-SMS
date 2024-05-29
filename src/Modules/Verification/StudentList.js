import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import useGetUnVerifiedStudents from "../../Hooks/AuthHooks/Teacher/useGetunVerifiedStudents";
import { useSelector } from "react-redux";

const StudentList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const students = useSelector((store) => store.Admin.unVerifiedStudents);
  const { loading, getUnverifiedStudents } = useGetUnVerifiedStudents();

  useEffect(() => {
    getUnverifiedStudents();
  }, []);

  useEffect(() => {
    const filtered = students.filter(
      (student) =>
        !searchQuery ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchQuery, students]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const colors = [
    "bg-yellow-300",
    "bg-blue-300",
    "bg-green-300",
    "bg-red-300",
    "bg-purple-300",
    "bg-pink-300",
  ];

  const getColor = (index) => {
    return colors[index % colors.length];
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">Unverified Students</h1>
        <div className="relative flex items-center max-w-xs w-full mr-4">
          <input
            type="text"
            placeholder="Search here"
            value={searchQuery}
            onChange={handleSearchChange}
            className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 w-full"
          />
          <button className="absolute right-3">
            <CiSearch className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>
      {loading ? (
        <div className="text-center">
          <p>Loading...</p>
        </div>
      ) : (
        <>
          {filteredStudents.length === 0 && (
            <p className="text-center text-gray-500">No results found.</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student, index) => (
              <div
                key={student._id}
                className={`${getColor(
                  index
                )} p-6 rounded-lg shadow-md text-white relative`}
              >
                <NavLink
                  to={`/verify_students/${student._id}`}
                  className="absolute top-4 right-4 bg-white text-gray-800 font-semibold py-1 px-3 rounded-full shadow-md hover:bg-gray-200 transition-colors"
                >
                  Verify Student
                </NavLink>
                <div className="mb-4">
                  <h2 className="text-lg font-semibold">
                    {student?.firstName}
                  </h2>
                  <p className="text-sm">{student.email}</p>
                  <div className="flex items-center mt-2 text-sm">
                    <p>Contact: {student.contactNumber}</p>
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
                    <img
                      src="https://avatars.githubusercontent.com/u/109097090?v=4"
                      alt="Student"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">QID: {student?.Q_Id}</p>
                    <p className="text-sm">SID: {student._id}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default StudentList;
