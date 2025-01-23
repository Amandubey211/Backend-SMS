import React, { useState, useEffect, useCallback } from "react";
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

const SubmissionDetails = ({ details = {}, student, initialGrade }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [grade, setGrade] = useState(initialGrade || 0);
  const [attemptDate, setAttemptDate] = useState("");
  const [status, setStatus] = useState("Missing");
  const { type, sgid } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation("admModule");

  const loading = useSelector((state) =>
    type === "Assignment"
      ? state.admin.speedgrades.gradeAssignmentLoading
      : state.admin.speedgrades.gradeQuizLoading
  );

  const { dueDate, points, totalPoints, comments } =
    details?.assignmentId || details?.quizId || {};

  // **Fixed Line: Use Nullish Coalescing Operator to Prevent Destructuring from Null**
  const { content = "", media = [] } = details ?? {}; // Updated line

  const maxPoints = type === "Quiz" ? totalPoints : points;

  const wordCount = content ? content?.split(/\s+/)?.length : 0;
  const today = new Date();
  const due = dueDate ? new Date(dueDate) : today; // Fallback for undefined `dueDate`
  const daysDifference = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  const daysLeft = daysDifference >= 0;
  const daysLabel = daysLeft
    ? `${daysDifference} ${t("days left")}`
    : `${Math.abs(daysDifference)} ${t("days late")}`;
  const daysLabelClass = daysLeft
    ? "text-green-500 bg-green-100"
    : "text-red-500 bg-red-100";

  const commentCount = comments ? comments?.length : 0;

  useEffect(() => {
    setGrade(initialGrade);
    setAttemptDate(
      details?.submittedAt
        ? new Date(details.submittedAt).toISOString().split("T")[0]
        : ""
    );
    setStatus(details?.status || t("Missing"));
  }, [details, initialGrade, t]);

  const handleGradeChange = (e) => {
    const inputGrade = e.target.value;

    if (inputGrade === "") {
      setGrade("");
    } else {
      const parsedGrade = parseFloat(inputGrade);

      if (!isNaN(parsedGrade) && parsedGrade <= maxPoints) {
        setGrade(parsedGrade);
      } else if (parsedGrade > maxPoints) {
        toast.error(t("Grade cannot exceed {{maxPoints}}", { maxPoints }));
        setGrade(maxPoints);
      }
    }
  };

  const handleSubmitGrade = useCallback(async () => {
    if (!student) {
      toast.error(t("No student selected"));
      return;
    }

    const gradeData = {
      studentId: student._id,
      grade,
      attemptDate,
      status,
    };

    if (type === "Assignment") {
      gradeData.assignmentId = sgid;
    } else if (type === "Quiz") {
      gradeData.quizId = sgid;
      gradeData.score = grade;
    }

    try {
      const result =
        type === "Assignment"
          ? await dispatch(assignAssignmentGrade(gradeData)).unwrap()
          : await dispatch(assignQuizGrade(gradeData)).unwrap();

      if (result) {
        toast.success(t("Grade submitted successfully"));
      }
    } catch (error) {
      toast.error(t("Failed to submit grade"));
    }
  }, [dispatch, student, grade, attemptDate, status, type, sgid, t]);

  const renderWordCount = () => {
    if (wordCount === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-gray-500 my-4">
          <CiTextAlignJustify className="text-4xl" aria-hidden="true" />
          <p className="mt-2 text-sm">{t("No Text submitted")}</p>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-2 mb-3">
          <RiFileWord2Line className="text-blue-500" />
          <span className="font-medium text-sm">{t("Word Count")}:</span>
          <span className="text-green-500">
            {wordCount} {t("Words")}
          </span>
        </div>
      );
    }
  };

  const renderFiles = () => {
    if (!media || media?.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-gray-500 mt-7">
          <FaFileAlt className="text-xl" aria-hidden="true" />
          <p className="mt-1 text-sm">{t("No files uploaded")}</p>
        </div>
      );
    } else {
      return (
        <>
          <h1 className="font-semibold text-gray-500 bg-gray-50 py-1">
            {t("Uploaded Files")}
          </h1>

          <ul className="space-y-2 text-sm">
            {media?.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-white p-2 border rounded-md shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-2">
                  {file.type?.startsWith("image/") ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-6 h-6 object-cover rounded"
                    />
                  ) : file.type === "application/pdf" ? (
                    <FaFilePdf className="text-red-500 w-6 h-6" />
                  ) : (
                    <FaFileAlt className="text-gray-500 w-6 h-6" />
                  )}
                  <a
                    href={file.url}
                    className="text-green-500 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("File")} {index + 1}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </>
      );
    }
  };

  // If no student is selected, display a placeholder
  if (!student) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center text-gray-400 h-full">
        <MdOutlineAssignmentLate className="text-6xl mb-4 text-gray-500" />
        <p className="text-lg font-semibold">
          {t("Submission details will appear here")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow flex flex-col">
        <div className="flex p-2 justify-between items-center mb-1">
          <h3 className="text-lg font-semibold">{t("Submission")}</h3>
          <span
            className={`text-sm font-medium px-2 py-0.5 rounded-full ${daysLabelClass}`}
          >
            {daysLabel}
          </span>
        </div>

        <div className="space-y-4 px-3">
          <div className="flex items-center space-x-2">
            <IoCalendarOutline className="text-green-500 h-4 w-4" />
            <span className="text-sm text-green-500">
              {t("Due Date")}:{" "}
              <span>
                {dueDate ? new Date(dueDate).toLocaleDateString() : t("N/A")}
              </span>
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("Attempt Date")}
            </label>
            <input
              type="date"
              className="mt-1 block w-full border border-gray-300 bg-white rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              value={attemptDate}
              onChange={(e) => setAttemptDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">
              {t("Grade")}{" "}
              <span className="text-xs font-normal text-pink-500 italic">
                ({t("Out of")} {type === "Quiz" ? totalPoints : points || 0})
              </span>
            </label>
            <input
              type="number"
              value={grade}
              onChange={handleGradeChange}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">
              {t("Status")}
            </label>
            <div className="flex items-center space-x-4 mt-1">
              <div className="flex items-center">
                <input
                  id="status-submit"
                  name="status"
                  type="radio"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                  checked={status === t("Submit")}
                  onChange={() => setStatus(t("Submit"))}
                />
                <label
                  htmlFor="status-submit"
                  className="ml-2 block text-sm text-green-500"
                >
                  {t("Submit")}
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="status-excused"
                  name="status"
                  type="radio"
                  className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300"
                  checked={status === t("Excused")}
                  onChange={() => setStatus(t("Excused"))}
                />
                <label
                  htmlFor="status-excused"
                  className="ml-2 block text-sm text-yellow-400"
                >
                  {t("Excused")}
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="status-missing"
                  name="status"
                  type="radio"
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                  checked={status === t("Missing")}
                  onChange={() => setStatus(t("Missing"))}
                />
                <label
                  htmlFor="status-missing"
                  className="ml-2 block text-sm text-red-700"
                >
                  {t("Missing")}
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <h3 className="text-lg bg-gray-50 py-1 ps-3 font-semibold">
            {t("Submission Details")}
          </h3>
          <div className="space-y-2 px-3 p-2">
            {renderWordCount()}
            {renderFiles()}
          </div>
        </div>
      </div>

      {details?.quizId?.quizType !== "Practice" && (
        <div className="p-4 border-t border-gray-200">
          <button
            className="w-full py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-md shadow-md hover:from-purple-500 hover:to-pink-500 focus:outline-none"
            onClick={handleSubmitGrade}
            disabled={loading}
          >
            {loading ? t("Submitting...") : t("Submit Grade →")}
          </button>
        </div>
      )}
    </div>
  );
};

export default SubmissionDetails;
