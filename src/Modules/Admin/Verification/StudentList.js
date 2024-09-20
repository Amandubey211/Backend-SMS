import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import TopNavigation from "./TopNavigation";
import RejectStudents from "./RejectStudents";
import UnVerifiedStudentCard from "./UnVerifiedStudentCard";
import { fetchUnverifiedStudents } from "../../../Store/Slices/Admin/Verification/VerificationThunks";
import Spinner from "../../../Components/Common/Spinner";

// Main StudentList Component
const StudentList = () => {
  const dispatch = useDispatch();
  const { unVerifiedStudents, loading } = useSelector(
    (state) => state.admin.verification
  );

  const [activeTab, setActiveTab] = useState("unverified");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch unverified students on mount
  useEffect(() => {
    dispatch(fetchUnverifiedStudents());
  }, [dispatch]);

  // Memoized filtered students based on search query
  const filteredStudents = useMemo(() => {
    if (!searchQuery) return unVerifiedStudents;
    return unVerifiedStudents.filter((student) => {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      const email = student.email.toLowerCase();
      const query = searchQuery.toLowerCase();
      return email.includes(query) || fullName.includes(query);
    });
  }, [searchQuery, unVerifiedStudents]);

  // Colors for student cards
  const colors = [
    "bg-yellow-300",
    "bg-blue-300",
    "bg-green-300",
    "bg-red-300",
    "bg-purple-300",
    "bg-pink-300",
  ];
  const getColor = (index) => colors[index % colors.length];

  return (
    <div className="container mx-auto p-5">
      {/* Top navigation for tabs */}
      <TopNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Show loading spinner */}
      {loading ? (
        <div className="text-center">
          <Spinner />
        </div>
      ) : (
        <>
          {activeTab === "unverified" ? (
            <div className="animate-fadeIn">
              {filteredStudents.length === 0 ? (
                <p className="text-center text-gray-500">
                  No Unverified Students found.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStudents.map((student, index) => (
                    <UnVerifiedStudentCard
                      key={student._id}
                      student={student}
                      color={getColor(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <RejectStudents />
          )}
        </>
      )}
    </div>
  );
};

export default React.memo(StudentList);
