import React from "react";
import AssignmentDetail from "../../../Component/AssignmentDetail";
import { FiCalendar } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

/**
 * Displays assignment meta-information and (optionally) submission details.
 *
 * Props
 * ─────
 * • isSubmitted - Boolean telling the card to switch to “Submission Details”.
 */
const AssignmentDetailCard = ({ isSubmitted }) => {
  const { t } = useTranslation("admModule");

  // ───── Pull data from Redux ─────
  const { assignmentData, submissionData } = useSelector(
    (store) => store?.student?.studentAssignment
  );

  /* ──────────────────────────────────────────────────────────────────
   * Assignment-level fields
   * ────────────────────────────────────────────────────────────────── */
  const points = assignmentData?.points ?? t("N/A");

  // If the teacher enabled attempt-limits, we expect both flags to be present.
  // Otherwise treat as unlimited.
  const allowNumberOfAttempts =
    assignmentData?.allowedAttempts && assignmentData?.allowNumberOfAttempts
      ? assignmentData.allowNumberOfAttempts
      : t("Unlimited");

  const SubmissionType = assignmentData?.submissionType ?? t("N/A");

  const dueDate = assignmentData?.dueDate
    ? new Date(assignmentData.dueDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : t("N/A");

  const submittingBy = assignmentData?.submittingBy || t("Everyone");

  /* ──────────────────────────────────────────────────────────────────
   * Submission-level fields (update automatically with Redux changes)
   * ────────────────────────────────────────────────────────────────── */
  const currentAttempt = submissionData?.attempt || 0;

  // If attempts are limited, calculate remaining; otherwise show “Unlimited”.
  const remainingAttempts =
    typeof allowNumberOfAttempts === "number"
      ? Math.max(allowNumberOfAttempts - currentAttempt, 0)
      : allowNumberOfAttempts;

  const submittedAt = submissionData?.submittedAt
    ? new Date(submissionData.submittedAt)
    : null;

  const formattedSubmissionDate = submittedAt
    ? `${submittedAt.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })} (${submittedAt.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })})`
    : t("N/A");

  /* ────────────────────────────────────────────────────────────────── */

  return (
    <div className="max-w-sm p-6" aria-label={t("Assignment Card")}>
      <h3 className="mb-4 text-lg font-semibold text-gray-700">
        {isSubmitted ? t("Submission Details") : t("Assignment Details")}
      </h3>

      {/* Show submission block only after the student submits */}
      {isSubmitted && (
        <div className="border p-4 mb-4 rounded-md">
          <p className="flex items-center text-sm mb-2 font-medium text-gray-600">
            {t("Submitted Assignment")}
          </p>
          <p className="flex items-center text-sm text-gray-900">
            <FiCalendar className="mr-2 text-lg" />
            {formattedSubmissionDate}
          </p>
        </div>
      )}

      {/* Core metadata */}
      <AssignmentDetail label={t("Assignment Points")} value={points} />

      <AssignmentDetail label={t("Submission Type")} value={SubmissionType} />

      <AssignmentDetail
        label={t("Remaining Attempts")}
        value={remainingAttempts.toString()}
        extra={typeof allowNumberOfAttempts === "number" ? t("Times") : ""}
      />

      <AssignmentDetail
        label={t("Allowed Attempts")}
        value={
          typeof allowNumberOfAttempts === "number"
            ? allowNumberOfAttempts.toString().padStart(2, "0")
            : allowNumberOfAttempts
        }
        extra={typeof allowNumberOfAttempts === "number" ? t("Times") : ""}
      />

      <AssignmentDetail label={t("Due Date")} value={dueDate} />
      <AssignmentDetail label={t("Assigned To")} value={submittingBy} />
    </div>
  );
};

export default AssignmentDetailCard;
