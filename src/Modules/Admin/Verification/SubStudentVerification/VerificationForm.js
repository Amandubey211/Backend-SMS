import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllClasses } from "../../../../Store/Slices/Admin/Class/actions/classThunk";
import { verifyStudent } from "../../../../Store/Slices/Admin/Verification/VerificationThunks";
import { useTranslation } from "react-i18next"; // Import useTranslation hook

const VerificationForm = ({ email, studentId }) => {
  const { t } = useTranslation("admVerification"); // Initialize useTranslation hook
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [verificationStatus, setVerificationStatus] = useState("");
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [presentClassId, setPresentClassId] = useState("");
  const classList = useSelector((store) => store.admin.class.classes);
  const { loadingVerificationStudent } = useSelector(
    (store) => store.admin.verification
  );

  useEffect(() => {
    if (!classList?.length) {
      dispatch(fetchAllClasses());
    }
  }, [classList?.length, dispatch]);

  const handleVerifyStudent = async (e) => {
    e.preventDefault();

    const verificationDetails = {
      email,
      studentId,
      admissionNumber,
      rejectionReason,
      isVerifiedDocuments: verificationStatus,
      presentClassId,
    };

    // Dispatch verify student thunk (which handles the verification, class assignment, and credentials sending)
    await dispatch(verifyStudent(verificationDetails));

    // Navigate back after the process
    navigate(-1);
  };

  return (
    <form
      onSubmit={handleVerifyStudent}
      className="bg-white p-2 rounded-lg max-w-sm transform transition duration-300 ease-in-out"
    >
      {/* Form Title */}
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        {t("Verify Student")}
      </h3>

      {/* Verification Status Dropdown */}
      <div className="mb-4">
        <label
          htmlFor="verificationStatus"
          className="block text-xs font-medium text-gray-700 mb-1"
        >
          {t("Verification Status")}
        </label>
        <select
          id="verificationStatus"
          value={verificationStatus}
          onChange={(e) => setVerificationStatus(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all duration-200 text-sm"
        >
          <option value="">{t("Select verification status")}</option>
          <option value="verified">{t("Verified")}</option>
          <option value="rejected">{t("Rejected")}</option>
        </select>
      </div>

      {/* Conditional Inputs for Rejected and Verified */}
      {verificationStatus === "rejected" && (
        <div className="mb-4">
          <label
            htmlFor="rejectionReason"
            className="block text-xs font-medium text-gray-700 mb-1"
          >
            {t("Reason for Rejection")}
          </label>
          <textarea
            id="rejectionReason"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={3}
            placeholder={t("Provide reason for rejection")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-400 focus:outline-none transition-all duration-200 text-sm"
          />
        </div>
      )}

      {verificationStatus === "verified" && (
        <>
          <div className="mb-4">
            <label
              htmlFor="admissionNumber"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              {t("Admission Number")}
            </label>
            <input
              type="text"
              id="admissionNumber"
              value={admissionNumber}
              onChange={(e) => setAdmissionNumber(e.target.value)}
              placeholder={t("Admission Number")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 text-sm"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="presentClassId"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              {t("Assign Class")}
            </label>
            <select
              id="presentClassId"
              value={presentClassId}
              onChange={(e) => setPresentClassId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 text-sm"
            >
              <option value="">{t("Select class")}</option>
              {classList?.map((classItem, index) => (
                <option key={index} value={classItem._id}>
                  {classItem.className}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className={`w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 rounded-md shadow-lg hover:from-pink-600 hover:to-purple-600 transition-transform transform duration-300 ease-in-out text-sm ${
          verificationStatus === "" || loadingVerificationStudent
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
        disabled={!verificationStatus || loadingVerificationStudent}
      >
        {loadingVerificationStudent
          ? t("Processing...")
          : verificationStatus === "rejected"
          ? t("Reject Student")
          : t("Verify Student")}
      </button>
    </form>
  );
};

export default VerificationForm;
