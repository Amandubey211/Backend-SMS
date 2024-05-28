import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const VerificationForm = ({ email, studentId }) => {
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState("");
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const handleVerifyStudent = async (e) => {
    e.preventDefault();
    try {
      // const response = await axios.post("/api/verifyStudentInfo", {
      //   email,
      //   studentId,
      //   isVerifiedDocuments: verificationStatus,
      //   addmissionNumber: admissionNumber,
      //   rejectionReason:
      //     verificationStatus === "rejected" ? rejectionReason : "",
      // });
      // alert(response.data.msg);
      console.log(email, studentId, verificationStatus, rejectionReason);

      toast.success(verificationStatus);
    } catch (error) {
      console.error("Error verifying student:", error);
      toast.error("Error verifying student");
    }
  };

  return (
    <form onSubmit={handleVerifyStudent} className="flex w-full h-full">
      <div className="bg-white p-8 rounded-lg w-full max-w-3xl ">
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
            <option value="rejected">Rejected</option>
          </select>
        </div>
        {verificationStatus === "rejected" ? (
          <div>
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
          </div>
        ) : (
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
              value={admissionNumber}
              onChange={(e) => setAdmissionNumber(e.target.value)}
              placeholder="Admission Number"
              className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
        >
          {verificationStatus === "rejected"
            ? "Reject Student"
            : "Verify Student"}
        </button>
      </div>
    </form>
  );
};

export default VerificationForm;
