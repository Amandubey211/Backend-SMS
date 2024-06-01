// src/components/StudentList.js

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import useGetUnVerifiedStudents from "../../../Hooks/AuthHooks/Teacher/useGetunVerifiedStudents";
import TopNavigation from "./TopNavigation";
import RejectStudents from "./RejectStudents";
import UnVerifiedStudentCard from "./UnVerifiedStudentCard";
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
    <div className="container mx-auto p-5">
      <TopNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
      />
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
            <RejectStudents
              filteredStudents={filteredStudents}
              setFilteredStudents={setFilteredStudents}
              getColor={getColor}
              searchQuery={searchQuery}
            />
          )}
        </>
      )}
    </div>
  );
};

export default StudentList;
