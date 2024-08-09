import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";

import { useSelector } from "react-redux";
import useAssignClassToStudent from "../../../../Hooks/AuthHooks/Staff/useAssignClassToStudent";
import useGetAllClasses from "../../../../Hooks/AuthHooks/Staff/Admin/Class/useGetAllClasses";
import useVerifyStudentDocument from "../../../../Hooks/AuthHooks/Staff/Admin/Students/useVerifyStudentDocument";

const VerificationForm = ({ email, studentId }) => {
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState("");
  const [addmissionNumber, setAddmissionNumber] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [presentClassId, setpresentClassId] = useState("");
  const { loading, verifyDocument } = useVerifyStudentDocument();
  const { fetchClasses } = useGetAllClasses();

  const { cid } = useParams();
  const classList = useSelector((store) => store.Class.classList);
  useEffect(() => {
    fetchClasses(cid);
  }, []);

  const handleVerifyStudent = async (e) => {
    e.preventDefault();
    const isVerifiedDocuments = verificationStatus;
    const verificationDetails = {
      email,
      studentId,
      addmissionNumber,
      rejectionReason,
      isVerifiedDocuments,
      presentClassId,
    };
    // const assignedDetails = {
    //   studentId,
    //   presentClassId,
    // };
    await verifyDocument(verificationDetails);
  };

  return (
    <form onSubmit={handleVerifyStudent} className="flex w-full h-full">
      <div className="bg-white p-2 rounded-lg w-full max-w-3xl">
        <NavLink
          onClick={() => navigate(-1)}
          className="text-sm text-gray-500 hover:text-gray-700 mb-4 items-center flex gap-2"
        >
          <div className="rounded-full border text-xl w-6 h-6 flex justify-center items-center">
            &larr;
          </div>
          <span>Back</span>
        </NavLink>
        <h3 className="text-3xl py-4 font-semibold">Verify Student</h3>
        <div className="mb-4">
          <label
            className="text-gray-600 font-medium"
            htmlFor="verificationStatus"
          >
            Verification Status
          </label>
          <select
            id="verificationStatus"
            value={verificationStatus}
            onChange={(e) => setVerificationStatus(e.target.value)}
            className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select verification status</option>
            <option value="verified">Verified</option>
            <option value="reject">Rejected</option>
          </select>
        </div>
        {verificationStatus === "reject" ? (
          <div className="mb-4">
            <label
              className="text-gray-600 font-medium"
              htmlFor="rejectionReason"
            >
              Reason for Rejection
            </label>
            <textarea
              id="rejectionReason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              placeholder="Provide reason for rejection"
              className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label
                className="text-gray-600 font-medium"
                htmlFor="admissionNumber"
              >
                Admission Number
              </label>
              <input
                type="text"
                id="admissionNumber"
                value={addmissionNumber}
                onChange={(e) => setAddmissionNumber(e.target.value)}
                placeholder="Admission Number"
                className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label
                className="text-gray-600 font-medium"
                htmlFor="assignedClass"
              >
                Assign Class to Student
              </label>
              <select
                id="assignedClass"
                value={presentClassId}
                onChange={(e) => setpresentClassId(e.target.value)}
                className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select class</option>
                {classList?.map((classItem, index) => (
                  <option key={index} value={classItem?._id} className="py-2">
                    {classItem.className}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
        <button
          type="submit"
          className={`w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading
            ? "Processing..."
            : verificationStatus === "reject"
            ? "Reject Student"
            : "Verify Student"}
        </button>
      </div>
    </form>
  );
};

export default VerificationForm;
