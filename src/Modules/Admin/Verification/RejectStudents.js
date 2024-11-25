// src/Modules/Admin/Verification/RejectStudents.js

import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import UnVerifiedStudentCard from "./UnVerifiedStudentCard";
import { fetchRejectedStudents } from "../../../Store/Slices/Admin/Verification/VerificationThunks";
import Spinner from "../../../Components/Common/Spinner";
import { FaUserSlash } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const RejectStudents = () => {
  const { t } = useTranslation('admVerification');
  const dispatch = useDispatch();
  const {
    rejectedStudents,
    loadingRejected,
    searchQuery,
    lastFetchedRejected,
  } = useSelector((state) => state.admin.verification);

  useEffect(() => {
    const now = Date.now();
    const isDataStale =
      !lastFetchedRejected || now - lastFetchedRejected > CACHE_DURATION;

    if (rejectedStudents.length == 0 || isDataStale) {
      dispatch(fetchRejectedStudents());
    }
  }, [dispatch, rejectedStudents.length, lastFetchedRejected]);

  // Filter rejected students based on search query
  const filteredStudents = useMemo(() => {
    if (!searchQuery) return rejectedStudents;
    return rejectedStudents.filter((student) => {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      const email = student.email.toLowerCase();
      const query = searchQuery.toLowerCase();
      return email.includes(query) || fullName.includes(query);
    });
  }, [searchQuery, rejectedStudents]);

  if (loadingRejected) {
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
          {t("No Unverified Students found.")}
        </p>{" "}
        {/* Text below icon */}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredStudents.map((student) => (
        <UnVerifiedStudentCard key={student._id} studentId={student._id} />
      ))}
    </div>
  );
};

export default RejectStudents;
