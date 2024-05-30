import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import useGetUnVerifiedStudents from "../../Hooks/AuthHooks/Teacher/useGetunVerifiedStudents";
import { useSelector } from "react-redux";
import UnVerifiedStudentCard from "./UnVerifiedStudentCard"; // Import the StudentCard component

const StudentList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [activeTab, setActiveTab] = useState("unverified");
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
        <div className="flex gap-2 items-center">
          <h1
            className={`text-xl font-semibold p-1 border rounded-2xl px-4 cursor-pointer transition-all duration-300 ${
              activeTab === "unverified"
                ? "text-purple-500  bg-purple-100"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("unverified")}
          >
            Unverified Students
          </h1>
          <h1
            className={`text-xl font-semibold p-1 border rounded-2xl px-4 cursor-pointer transition-all duration-300 ${
              activeTab === "rejected"
                ? "text-purple-500 bg-purple-100"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("rejected")}
          >
            Rejected Students
          </h1>
        </div>

        <div className="relative flex items-center max-w-xs w-full mr-4">
          <input
            type="text"
            placeholder="Search here"
            value={searchQuery}
            onChange={handleSearchChange}
            className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 w-full transition-all duration-300"
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
          {activeTab === "unverified" ? (
            <div className="animate-fadeIn">
              {filteredStudents.length === 0 && (
                <p className="text-center text-gray-500">
                  No Unverified Student found.
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudents.map((student, index) => (
                  <UnVerifiedStudentCard
                    key={student._id}
                    student={student}
                    color={getColor(index)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="animate-fadeIn">
              {filteredStudents.length === 0 && (
                <p className="text-center text-gray-500">
                  No Rejected Student found.
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudents.map((student, index) => (
                  <UnVerifiedStudentCard
                    key={student._id}
                    student={student}
                    color={getColor(index)}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StudentList;
