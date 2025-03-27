// StudentList.js
import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { LuUser } from "react-icons/lu";
import { GiImperialCrown } from "react-icons/gi";
import profileIcon from "../../../../Assets/DashboardAssets/profileIcon.png";

const StudentList = ({ onSeeGradeClick }) => {
  const { studentsList } = useSelector((store) => store.admin.students);
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredStudents = studentsList?.filter((student) =>
    `${student.firstName} ${student.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full p-1 bg-white"
    >
      <div className="flex items-center justify-between mb-4 p-2">
        <h2 className="text-lg font-semibold ps-4">
          Students{" "}
          <span className="text-gray-500">
            ({filteredStudents?.length || 0})
          </span>
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search students"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      {filteredStudents?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-center text-gray-500">
          <LuUser className="text-8xl mb-1 text-pink-400" />
          <p>No students found in this section.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredStudents?.map((student, index) => (
            <motion.div
              key={student._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center flex-shrink-0 w-1/4">
                <img
                  src={student?.profile || profileIcon}
                  alt={student?.firstName}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div className="flex flex-col">
                  <div className="text-sm font-medium truncate">
                    {student?.firstName} {student?.lastName}
                  </div>
                  {student.isGroupLeader && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium text-gradient truncate">
                        Group Leader
                      </span>
                      <span className="text-yellow-500">
                        <GiImperialCrown />
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col w-1/4 truncate text-sm">
                <span className="truncate">{student?.email}</span>
                <span className="truncate">{student?.contactNumber}</span>
              </div>
              <div className="flex flex-col w-1/4 truncate text-sm">
                <span className="truncate">
                  {student?.guardianRelationToStudent}
                </span>
                <span className="truncate">
                  {student?.guardianContactNumber}
                </span>
              </div>
              <div className="flex-shrink-0 w-1/8">
                <button
                  onClick={() => onSeeGradeClick(student)}
                  className="px-3 py-1 text-green-500 font-semibold text-sm border border-green-500 rounded-md hover:bg-green-50 transition-colors"
                >
                  See Grade
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default StudentList;
