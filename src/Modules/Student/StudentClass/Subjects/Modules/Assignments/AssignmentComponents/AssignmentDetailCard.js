import React, { useState } from "react";
import AssignmentDetail from "../../../Component/AssignmentDetail";
import { FiCalendar } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const AssignmentDetailCard = ({ isSubmitted }) => {
  const { t } = useTranslation("admModule");

  const { assignmentData, submissionData } = useSelector(
    (store) => store?.student?.studentAssignment
  );

  const points = assignmentData?.points || t("N/A");
  const allowNumberOfAttempts =
    assignmentData?.allowedAttempts && assignmentData?.allowNumberOfAttempts
      ? assignmentData.allowNumberOfAttempts
      : t("Unlimited");

  // Updated dueDate formatting
  const dueDate = assignmentData?.dueDate
    ? new Date(assignmentData.dueDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : t("N/A");

  const submittingBy = assignmentData?.submittingBy || t("Everyone");
  const SubmissionType = assignmentData?.submissionType || "N/A";

  const submittedAt = submissionData?.submittedAt
    ? new Date(submissionData.submittedAt)
    : null;
  const [currentAttempt, setCurrentAttempt] = useState(
    submissionData?.attempt || 0
  );

  const formattedDate = submittedAt
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

  return (
    <div className="max-w-sm p-6 " aria-label={t("Assignment Card")}>
      <h3 className="mb-4 text-lg font-semibold text-gray-700">
        {isSubmitted ? t("Submission Details") : t("Assignment Details")}
      </h3>

      {isSubmitted && (
        <div className="border p-4 mb-4 rounded-md">
          <p className="flex items-center text-sm mb-2">
            <span className="font-medium text-gray-600">
              {t("Submitted Assignment")}
            </span>
          </p>
          <p className="flex items-center text-sm text-gray-900">
            <FiCalendar className="mr-2 text-lg" />
            <span className="font-medium text-gray-900">{formattedDate}</span>
          </p>
        </div>
      )}

      <AssignmentDetail
        label={t("Assignment Points")}
        value={points.toString()}
      />

      <AssignmentDetail
        label="Submission Type"
        value={SubmissionType?.toString()}
      />

      <AssignmentDetail
        label={t("Remaining Attempts")}
        value={
          typeof allowNumberOfAttempts === "number"
            ? `${allowNumberOfAttempts - (currentAttempt ?? 0)}`
            : allowNumberOfAttempts
        }
        extra={t("Times")}
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
      <AssignmentDetail label={t("Submitted By")} value={submittingBy} />
    </div>
  );
};

export default AssignmentDetailCard;
