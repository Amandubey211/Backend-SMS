import React, { useState, useEffect, useMemo, useCallback } from "react";
import { AiOutlineFileText } from "react-icons/ai";
import { CiTextAlignJustify } from "react-icons/ci";
import { FaFileAlt, FaFilePdf } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import { RiFileWord2Line } from "react-icons/ri";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { assignAssignmentGrade } from "../../../../../../Store/Slices/Admin/Class/SpeedGrade/AssignmentSpeedGradeThunks";
import { assignQuizGrade } from "../../../../../../Store/Slices/Admin/Class/SpeedGrade/QuizSpeedGradeThunks";
import { useTranslation } from "react-i18next";
import { MdOutlineAssignmentLate } from "react-icons/md";

const SubmissionDetails = ({ details = {}, student, initialGrade = 0 }) => {
  const { t } = useTranslation("admModule");
  const dispatch = useDispatch();
  const { type, sgid } = useParams();

  const loading = useSelector((s) =>
    type === "Assignment"
      ? s.admin.speedgrades.gradeAssignmentLoading
      : s.admin.speedgrades.gradeQuizLoading
  );

  const base = details?.assignmentId || details?.quizId || {};
  const { dueDate, points, totalPoints } = base;
  const { content = "", media = [] } = details ?? {};

  const [grade, setGrade] = useState(initialGrade);
  const [attemptDate, setAttemptDate] = useState(
    details?.submittedAt
      ? new Date(details.submittedAt).toISOString().split("T")[0]
      : ""
  );
  const [status, setStatus] = useState(details?.status || t("Missing"));

  useEffect(() => {
    setGrade(initialGrade);
  }, [initialGrade]);

  const totalScore = Math.min(Number(grade) || 0);
  const maxPoints = type === "Quiz" ? totalPoints : points;

  const onGradeChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setGrade("");
      return;
    }
    const num = Math.min(Math.max(+value, 0), maxPoints);
    setGrade(num);
  };

  const submitGrade = useCallback(async () => {
    if (!student) return toast.error(t("No student selected"));

    const body = {
      studentId: student._id,
      attemptDate,
      status,
      grade: totalScore,
    };
    if (type === "Quiz") {
      body.quizId = sgid;
      body.score = totalScore;
    } else body.assignmentId = sgid;

    try {
      await (type === "Quiz"
        ? dispatch(assignQuizGrade(body)).unwrap()
        : dispatch(assignAssignmentGrade(body)).unwrap());
    } catch {
      toast.error(t("Failed to submit grade"));
    }
  }, [student, attemptDate, status, totalScore, type, sgid, dispatch, t]);

  const wordCount = content ? content.split(/\s+/).length : 0;
  const daysDiff = (() => {
    const d = dueDate ? new Date(dueDate) : new Date();
    return Math.ceil((d - new Date()) / 86_400_000);
  })();
  const daysLabel =
    daysDiff >= 0
      ? `${daysDiff} ${t("days left")}`
      : `${Math.abs(daysDiff)} ${t("days late")}`;
  const daysLabelClass =
    daysDiff >= 0 ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100";

  const renderWordCount = () =>
    wordCount ? (
      <div className="flex items-center gap-2">
        <RiFileWord2Line className="text-blue-500" />
        <span className="font-medium text-sm">{t("Word Count")}:</span>
        <span className="text-green-600">
          {wordCount} {t("Words")}
        </span>
      </div>
    ) : (
      <div className="flex flex-col items-center text-gray-500 my-4">
        <CiTextAlignJustify className="text-4xl" />
        <p className="mt-2 text-sm">{t("No Text submitted")}</p>
      </div>
    );

  const renderFiles = () => {
    if (!media.length)
      return (
        <div className="flex flex-col items-center text-gray-500 mt-7">
          <FaFileAlt className="text-xl" />
          <p className="text-sm mt-1">{t("No files uploaded")}</p>
        </div>
      );

    return (
      <>
        <h1 className="font-semibold text-gray-500 bg-gray-50 py-1">
          {t("Uploaded Files")}
        </h1>
        <ul className="space-y-2 text-sm">
          {media.map((f, i) => (
            <li
              key={i}
              className="flex justify-between items-center bg-white p-2 border rounded-md shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-2">
                {f.type?.startsWith("image/") ? (
                  <img
                    src={f.url}
                    alt=""
                    className="w-6 h-6 object-cover rounded"
                  />
                ) : f.type === "application/pdf" ? (
                  <FaFilePdf className="text-red-500 w-6 h-6" />
                ) : (
                  <FaFileAlt className="text-gray-500 w-6 h-6" />
                )}
                <a
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500 hover:underline"
                >
                  {t("File")} {i + 1}
                </a>
              </div>
            </li>
          ))}
        </ul>
      </>
    );
  };

  if (!student)
    return (
      <div className="flex-grow flex flex-col items-center justify-center text-gray-400 h-full">
        <MdOutlineAssignmentLate className="text-6xl mb-4" />
        <p className="text-lg font-semibold">
          {t("Submission details will appear here")}
        </p>
      </div>
    );

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-2">
        <h3 className="text-lg font-semibold">{t("Submission")}</h3>
        <span className={`text-sm px-2 py-0.5 rounded-full ${daysLabelClass}`}>
          {daysLabel}
        </span>
      </div>

      <div className="mx-3 mb-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">
          {type === "Quiz" ? t("Quiz Summary") : t("Assignment Summary")}
        </h4>
        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          <div className="col-span-3 border-b pb-2">
            <p className="text-gray-600">{t("Total Points")}</p>
            <p className="font-bold">{maxPoints}</p>
          </div>
          <div className="col-span-3 pt-2">
            <p className="text-gray-600">{t("Grade")}</p>
            <input
              type="number"
              value={grade}
              onChange={onGradeChange}
              min={0}
              max={maxPoints}
              className="w-full text-center font-bold border rounded px-3 py-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              {Math.round((totalScore / maxPoints) * 100)}%
            </p>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto space-y-4 px-3">
        <div className="flex items-center gap-2 text-sm">
          <IoCalendarOutline className="text-green-500" />
          <span>
            {t("Due Date")}:{" "}
            {dueDate ? new Date(dueDate).toLocaleDateString() : t("N/A")}
          </span>
        </div>

        <div>
          <label className="block text-sm font-medium">
            {t("Attempt Date")}
          </label>
          <input
            type="date"
            value={attemptDate}
            onChange={(e) => setAttemptDate(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">{t("Status")}</label>
          <div className="flex gap-4 mt-1">
            {["Submit", "Excused", "Missing"].map((key) => (
              <label key={key} className="flex items-center gap-1 text-sm">
                <input
                  type="radio"
                  name="status"
                  checked={status === t(key)}
                  onChange={() => setStatus(t(key))}
                  className={`h-4 w-4 ${
                    key === "Submit"
                      ? "text-green-600"
                      : key === "Excused"
                      ? "text-yellow-500"
                      : "text-red-600"
                  } border-gray-300`}
                />
                <span
                  className={
                    key === "Submit"
                      ? "text-green-500"
                      : key === "Excused"
                      ? "text-yellow-500"
                      : "text-red-600"
                  }
                >
                  {t(key)}
                </span>
              </label>
            ))}
          </div>
        </div>

        {renderWordCount()}
        {renderFiles()}
      </div>

      {(type === "Quiz" || type === "Assignment") && (
        <div className="p-4 border-t">
          <button
            onClick={submitGrade}
            disabled={loading}
            className="w-full py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md shadow-md hover:from-purple-500 hover:to-pink-500"
          >
            {loading ? t("Submitting...") : t("Submit Grade →")}
          </button>
        </div>
      )}
    </div>
  );
};

export default SubmissionDetails;
