import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import profileIcon from "../../../../Assets/DashboardAssets/profileIcon.png";
import Spinner from "../../../../Components/Common/Spinner";

const SectionStudentList = ({
  onSeeGradeClick,
  activeSectionId,
  activeSection,
}) => {
  const { studentsList, loading, error } = useSelector(
    (state) => state.admin.students
  );

  // If "Everyone," show all. Otherwise filter by presentSectionId
  let filteredStudents = studentsList || [];
  if (activeSection !== "Everyone" && activeSectionId) {
    filteredStudents = filteredStudents.filter(
      (s) => s.presentSectionId === activeSectionId
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Failed to load students. Please try again later.
      </div>
    );
  }

  if (!filteredStudents.length) {
    return (
      <div className="flex flex-col items-center justify-center h-72 text-center text-gray-500">
        <p>No students found.</p>
      </div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0.6, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-2"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold ps-4">
          Students in{" "}
          <span className="text-gradient">
            {activeSection === "Everyone" ? "All Sections" : activeSection}
          </span>{" "}
          ({filteredStudents.length})
        </h2>
      </div>

      <div className="space-y-2">
        {filteredStudents.map((student) => (
          <motion.div
            key={student._id}
            layout
            initial={{ scale: 0.95, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between p-4 border-b border-gray-200 rounded bg-white"
          >
            <div className="flex items-center flex-shrink-0 w-1/4">
              <img
                src={student?.profile || profileIcon}
                alt={student?.firstName || "First"}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div className="flex flex-col">
                <div className="text-sm font-medium truncate">
                  {student?.firstName} {student?.lastName || ""}
                </div>
                <div className="text-xs text-gray-500">
                  {student?.rollNumber || "Roll #"}
                </div>
              </div>
            </div>
            {/* Email / Contact */}
            <div className="flex flex-col w-1/4 truncate text-sm">
              <span className="truncate">{student?.email || "No email"}</span>
              <span className="truncate">
                {student?.contactNumber || "N/A"}
              </span>
            </div>
            {/* Guardian Info */}
            <div className="flex flex-col w-1/4 truncate text-sm">
              <span className="truncate">
                {student?.guardianRelationToStudent || "N/A"}
              </span>
              <span className="truncate">
                {student?.guardianContactNumber || "N/A"}
              </span>
            </div>
            {/* See Grade Button */}
            <div className="flex-shrink-0 w-1/8">
              <button
                onClick={() => onSeeGradeClick(student)}
                className="px-3 py-1 text-blue-500 font-semibold text-sm border border-blue-500 rounded-md"
              >
                See Grade
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SectionStudentList;
