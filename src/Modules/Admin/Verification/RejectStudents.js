import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import UnVerifiedStudentCard from "./UnVerifiedStudentCard";
import { fetchRejectedStudents } from "../../../Store/Slices/Admin/Verification/VerificationThunks";
import Spinner from "../../../Components/Common/Spinner";

const RejectStudents = () => {
  const dispatch = useDispatch();
  const { rejectedStudents, loading } = useSelector(
    (state) => state.admin.verification
  );

  useEffect(() => {
    if (rejectedStudents.length === 0) {
      dispatch(fetchRejectedStudents());
    }
  }, [dispatch, rejectedStudents.length]);

  if (loading) {
    return (
      <div className="text-center">
        <Spinner />
      </div>
    );
  }

  if (rejectedStudents.length === 0) {
    return (
      <p className="text-center text-gray-500">No Rejected Students found.</p>
    );
  }

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {rejectedStudents.map((student, index) => (
        <UnVerifiedStudentCard
          key={student._id}
          student={student}
          color={getColor(index)}
        />
      ))}
    </div>
  );
};

export default React.memo(RejectStudents);
