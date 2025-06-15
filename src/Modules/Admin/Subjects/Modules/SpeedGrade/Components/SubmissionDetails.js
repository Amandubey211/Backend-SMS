/* src/Modules/Admin/Subjects/Modules/SpeedGrade/Components/SubmissionDetails.jsx */
import React, {
  useState,
  useEffect,
  useMemo, // ← added
  useCallback,
} from "react";
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

/* ────────────────────────────────────────────────────────── */
/*                      SubmissionDetails                     */
/* ────────────────────────────────────────────────────────── */
const SubmissionDetails = ({ details = {}, student, initialGrade = 0 }) => {
  const { t } = useTranslation("admModule");
  const dispatch = useDispatch();
  const { type, sgid } = useParams();

  /* redux loading flag */
  const loading = useSelector((s) =>
    type === "Assignment"
      ? s.admin.speedgrades.gradeAssignmentLoading
      : s.admin.speedgrades.gradeQuizLoading
  );

  /* base meta */
  const base = details?.assignmentId || details?.quizId || {};
  const { dueDate, points, totalPoints } = base;
  const { content = "", media = [] } = details ?? {};

  /* auto-graded + text-graded (Quiz) */
  const { autoScore, maxTextPts } = useMemo(() => {
    if (type !== "Quiz" || !details?.quizId)
      return { autoScore: 0, maxTextPts: 0 };

    let auto = 0,
      txtMax = 0;
    (details.quizId.questions || []).forEach((q) => {
      if (q.type === "text") txtMax += q.questionPoint;
      else {
        const ans = details.answers?.find((a) => a.questionId === q._id);
        if (ans?.isCorrect) auto += q.questionPoint;
      }
    });
    return { autoScore: auto, maxTextPts: txtMax };
  }, [details, type]);

  /* local state */
  const [textScore, setTextScore] = useState(
    Math.max(0, initialGrade - autoScore)
  );
  const [attemptDate, setAttemptDate] = useState(
    details?.submittedAt
      ? new Date(details.submittedAt).toISOString().split("T")[0]
      : ""
  );
  const [status, setStatus] = useState(details?.status || t("Missing"));

  /* sync when prop changes */
  useEffect(
    () => setTextScore(Math.max(0, initialGrade - autoScore)),
    [initialGrade, autoScore]
  );

  /* totals */
  const totalScore = autoScore + (Number(textScore) || 0);

  /* handlers */
  const onTextChange = (e) => {
    const v = e.target.value;
    if (v === "") return setTextScore("");
    const n = Math.min(Math.max(+v, 0), maxTextPts);
    setTextScore(n);
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
      toast.success(t("Grade submitted successfully"));
    } catch {
      toast.error(t("Failed to submit grade"));
    }
  }, [student, attemptDate, status, totalScore, type, sgid, dispatch, t]);

  /* misc derived */
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

  /* file + word-count renderers (unchanged) */
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

  /* placeholder when no student */
  if (!student)
    return (
      <div className="flex-grow flex flex-col items-center justify-center text-gray-400 h-full">
        <MdOutlineAssignmentLate className="text-6xl mb-4" />
        <p className="text-lg font-semibold">
          {t("Submission details will appear here")}
        </p>
      </div>
    );

  /* render */
  return (
    <div className="flex flex-col h-full">
      {/* header strip */}
      <div className="flex justify-between items-center p-2">
        <h3 className="text-lg font-semibold">{t("Submission")}</h3>
        <span className={`text-sm px-2 py-0.5 rounded-full ${daysLabelClass}`}>
          {daysLabel}
        </span>
      </div>

      {/* quiz summary */}
      {type === "Quiz" && (
        <div className="mx-3 mb-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">
            {t("Quiz Summary")}
          </h4>
          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div>
              <p className="text-gray-600">{t("Auto Score")}</p>
              <p className="font-bold">{autoScore}</p>
            </div>
            <div>
              <p className="text-gray-600">{t("Text Score")}</p>
              <p className="font-bold">{textScore || 0}</p>
            </div>
            <div className="col-span-3 border-t pt-2">
              <p className="text-gray-600">{t("Total Score")}</p>
              <p className="font-bold">
                {totalScore} / {totalPoints} (
                {Math.round((totalScore / totalPoints) * 100)}%)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* main content */}
      <div className="flex-grow overflow-y-auto space-y-4 px-3">
        {/* due date & attempt */}
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

        {/* text score input */}
        {type === "Quiz" && (
          <div>
            <label className="block text-sm font-medium">
              {t("Text Score")}{" "}
              <span className="text-xs italic text-pink-500">
                ({t("Out of")} {maxTextPts})
              </span>
            </label>
            <input
              type="number"
              value={textScore}
              onChange={onTextChange}
              min={0}
              max={maxTextPts}
              className="mt-1 w-full border rounded px-3 py-2 shadow-sm"
            />
          </div>
        )}

        {/* status radios (unchanged) */}
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

        {/* word count + files */}
        {renderWordCount()}
        {renderFiles()}
      </div>

      {/* footer button */}
      {type === "Quiz" && details?.quizId?.quizType !== "Practice" && (
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
