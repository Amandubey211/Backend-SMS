import React, { useState, useCallback, memo } from "react";
import {
  MdCheckCircle,
  MdRadioButtonChecked,
  MdEdit,
  MdDoneOutline,
} from "react-icons/md";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

/**
 * Quiz-answer card (speed-grading view)
 * • Shows question stem, options (or text answer)
 * • Icons + badges for correct / selected answers
 * • Inline manual grading for “text” questions
 */
const SpeedGradeQuizAnswerCard = ({
  question,
  selectedOption,
  onUpdateTextQuestionGrade,
}) => {
  const { t } = useTranslation("admModule");
  const [grade, setGrade] = useState("");
  const [editing, setEditing] = useState(true);

  const {
    type,
    questionText,
    options = [],
    correctAnswer,
    questionPoint,
  } = question;

  /* ---------------- grading helpers ---------------- */
  const gradeMax = Number(questionPoint) || 0;
  const parsedGrade = Number(grade) || 0;

  const handleSave = () => {
    const safe = Math.min(parsedGrade, gradeMax);
    onUpdateTextQuestionGrade(safe);
    setEditing(false);
  };

  /* -------------- option renderer ------------------ */
  const renderOption = useCallback(
    (opt, idx) => {
      const active = opt.text === selectedOption; // learner picked
      const correct = opt.text === correctAnswer; // right answer

      // choose icon
      let icon = <span className="w-5 h-5 shrink-0" />; // placeholder
      if (correct) icon = <MdCheckCircle className="text-green-600 shrink-0" />;
      else if (active)
        icon = <MdRadioButtonChecked className="text-blue-600  shrink-0" />;

      // colours
      const bg = clsx({
        "bg-green-100": correct && active,
        "bg-green-50": correct && !active,
        "bg-blue-50": active && !correct,
      });
      const textCol = clsx({
        "text-green-700 font-medium": correct,
        "text-blue-700": active && !correct,
        "text-gray-700": !active && !correct,
      });

      // badge
      let badgeText = "";
      if (correct) badgeText = t("Correct Option");
      else if (active) badgeText = t("Selected Option");

      return (
        <label
          key={opt._id}
          className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${bg}`}
        >
          {/* option number */}
          <span className="w-6 text-right text-gray-500 font-medium">
            {idx + 1}.
          </span>

          {/* icon */}
          {icon}

          {/* option text */}
          <span className={textCol}>{opt.text}</span>

          {/* badge */}
          {badgeText && (
            <span
              className={clsx(
                "ml-auto rounded-full px-2 py-0.5 text-xs font-semibold",
                correct
                  ? "bg-green-200 text-green-800"
                  : "bg-blue-200  text-blue-800"
              )}
            >
              {badgeText}
            </span>
          )}
        </label>
      );
    },
    [selectedOption, correctAnswer, t]
  );

  /* ------------------ render ----------------------- */
  return (
    <article className="relative mb-4 border rounded-lg shadow-sm bg-white">
      {/* points header */}
      <header className="bg-gray-100 text-sm text-gray-600 font-semibold px-3 py-1 rounded-t-md">
        {t("Question Point")}:{" "}
        <span className="text-black">{questionPoint}</span>
      </header>

      <section className="p-4 space-y-4">
        {/* question stem */}
        <h2
          className="font-semibold text-base"
          dangerouslySetInnerHTML={{ __html: questionText }}
        />

        {/* answers */}
        {type === "text" ? (
          <>
            <textarea
              readOnly
              rows={3}
              value={selectedOption || t("No answer provided")}
              className="w-full bg-gray-50 p-2 border rounded-md"
            />

            {/* inline grade input */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="w-20 text-right p-1 border rounded bg-green-50"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                max={gradeMax}
                placeholder={`0 / ${gradeMax}`}
                disabled={!editing}
              />
              {editing ? (
                <MdDoneOutline
                  className="text-green-600 cursor-pointer"
                  onClick={handleSave}
                />
              ) : (
                <MdEdit
                  className="text-blue-600 cursor-pointer"
                  onClick={() => setEditing(true)}
                />
              )}
            </div>
          </>
        ) : (
          options.map((opt, idx) => renderOption(opt, idx))
        )}
      </section>

      {/* overall correct / wrong ribbon */}
      {type !== "text" && (
        <span
          className={clsx(
            "absolute top-1 right-0 rounded-l-full px-3 py-1 text-xs font-bold shadow-sm",
            selectedOption === correctAnswer
              ? "bg-green-200 text-green-800"
              : "bg-red-200 text-red-800"
          )}
        >
          {selectedOption === correctAnswer
            ? t("Correct Answer")
            : t("Wrong Answer")}
        </span>
      )}
    </article>
  );
};

export default memo(SpeedGradeQuizAnswerCard);
