// src/Modules/Admin/Verification/UnverifiedStudents.js

import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import UnVerifiedStudentCard from "./UnVerifiedStudentCard";
import { fetchUnverifiedStudents } from "../../../Store/Slices/Admin/Verification/VerificationThunks";
import Spinner from "../../../Components/Common/Spinner";
import { FaUserSlash } from "react-icons/fa"; // Import a suitable icon
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const UnverifiedStudents = () => {
  const dispatch = useDispatch();
  const {
    unVerifiedStudents,
    loadingUnverified,
    searchQuery,
    lastFetchedUnverified,
  } = useSelector((state) => state.admin.verification);

  // Fetch unverified students on mount or if data is stale
  useEffect(() => {
    const now = Date.now();
    const isDataStale =
      !lastFetchedUnverified || now - lastFetchedUnverified > CACHE_DURATION;

    if (unVerifiedStudents.length === 0 || isDataStale) {
      dispatch(fetchUnverifiedStudents());
    }
  }, [dispatch, unVerifiedStudents.length, lastFetchedUnverified]);

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

  if (loadingUnverified) {
    return (
      <div className="text-center">
        <Spinner />
      </div>
    );
  }

  if (filteredStudents.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <FaUserSlash className="text-6xl text-gray-400 mb-4" /> {/* Big Icon */}
        <p className="text-center text-gray-500 text-xl">
          No Unverified Students found.
        </p>{" "}
        {/* Text below icon */}
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <UnVerifiedStudentCard key={student._id} studentId={student._id} />
        ))}
      </div>
    </div>
  );
};

export default UnverifiedStudents;
