import React, { useState, useCallback, memo } from "react";
import {
  MdCheckCircle,
  MdRadioButtonChecked,
  MdEdit,
  MdDoneOutline,
} from "react-icons/md";
import { Badge } from "antd";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

/* inject ribbon CSS once */
const RIBBON_CSS_ID = "sgq-bottom-right-ribbon-css";
if (!document.getElementById(RIBBON_CSS_ID)) {
  const style = document.createElement("style");
  style.id = RIBBON_CSS_ID;
  style.textContent = `
    .bottom-right-ribbon .ant-badge-ribbon{
      top:auto!important;
      right:-2px!important;
      bottom:-2px!important;
      transform:translate(50%,50%) rotate(45deg);
      transform-origin:bottom right;
    }
    .bottom-right-ribbon .ant-badge-ribbon-text{
      transform:rotate(-45deg);
    }
  `;
  document.head.appendChild(style);
}

const SpeedGradeQuizAnswerCard = memo(
  ({ question, questionIndex, selectedOption, onUpdateTextQuestionGrade }) => {
    const { t } = useTranslation("admModule");

    const [grade, setGrade] = useState("");
    const [editing, setEdit] = useState(true);

    const {
      type,
      questionText,
      options = [],
      correctAnswer,
      questionPoint,
    } = question;

    /* flags */
    const isText = type === "text";
    const answered = !!selectedOption;
    const isCorrect = !isText && selectedOption === correctAnswer;

    /* bg tint */
    const cardBg = isText
      ? "bg-white"
      : answered
      ? isCorrect
        ? "bg-green-50"
        : "bg-red-50"
      : "bg-white";

    /* text-question grading helpers */
    const gradeMax = +questionPoint || 0;
    const clamp = (num) => Math.max(0, Math.min(num, gradeMax));

    const handleGradeChange = (e) => {
      const val = e.target.value;
      if (val === "") {
        setGrade("");
        return;
      }
      const num = clamp(+val);
      setGrade(num.toString());
    };

    const handleSave = () => {
      const safe = clamp(+grade || 0);
      onUpdateTextQuestionGrade(safe);
      setEdit(false);
    };

    /* render option (MCQ / TF) */
    const renderOption = useCallback(
      (opt, idx) => {
        const active = opt.text === selectedOption;
        const correct = opt.text === correctAnswer;

        const icon = correct ? (
          <MdCheckCircle className="text-green-600 shrink-0" />
        ) : active ? (
          <MdRadioButtonChecked className="text-blue-600 shrink-0" />
        ) : (
          <span className="w-5 h-5 shrink-0" />
        );

        const bg = clsx({
          "bg-green-100": correct && active,
          "bg-green-50": correct && !active,
          "bg-blue-50": active && !correct,
        });
        const txt = clsx({
          "text-green-700 font-medium": correct,
          "text-blue-700": active && !correct,
          "text-gray-700": !active && !correct,
        });

        return (
          <label
            key={opt._id}
            className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${bg}`}
          >
            {/* <span className="w-6 text-right text-gray-500 font-medium">
              {idx + 1}.
            </span> */}
            {icon}
            <span className={txt}>{opt.text}</span>
            {(correct || active) && (
              <span
                className={clsx(
                  "ml-auto rounded-full px-2 py-0.5 text-xs font-semibold",
                  !correct && "bg-blue-200 text-blue-800"
                )}
              >
                {!correct && t("Selected Option")}
              </span>
            )}
          </label>
        );
      },
      [selectedOption, correctAnswer, t]
    );

    /* core card */
    const coreCard = (
      <article className={clsx("relative border rounded-lg shadow-sm", cardBg)}>
        <header className="bg-gray-100 text-sm text-gray-600 font-semibold px-3 py-1 rounded-t-md flex gap-4 items-center">
          <span>
            {questionIndex + 1} {t("Q .")}
          </span>{" "}
          |
          <span>
            {t("Points")}: <span className="text-black">{questionPoint}</span>
          </span>
        </header>

        <section className="p-4 space-y-4">
          <h2
            className="font-semibold text-base"
            dangerouslySetInnerHTML={{ __html: questionText }}
          />

          {/* answers */}
          {isText ? (
            <>
              <textarea
                readOnly
                rows={3}
                value={selectedOption || t("No answer provided")}
                className="w-full bg-gray-50 p-2 border rounded-md"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={grade}
                  onChange={handleGradeChange}
                  max={gradeMax}
                  min={0}
                  placeholder={`0 / ${gradeMax}`}
                  disabled={!editing}
                  className="w-20 text-right p-1 border rounded bg-green-50"
                />
                {editing ? (
                  <MdDoneOutline
                    className="text-green-600 cursor-pointer"
                    onClick={handleSave}
                  />
                ) : (
                  <MdEdit
                    className="text-blue-600 cursor-pointer"
                    onClick={() => setEdit(true)}
                  />
                )}
              </div>
            </>
          ) : (
            options.map((opt, idx) => renderOption(opt, idx))
          )}
        </section>
      </article>
    );

    /* wrap with Ribbon when needed */
    return !isText && answered ? (
      <Badge.Ribbon
        className="bottom-right-ribbon"
        color={isCorrect ? "green" : "red"}
        text={isCorrect ? t("Correct Answer") : t("Wrong Answer")}
      >
        {coreCard}
      </Badge.Ribbon>
    ) : (
      coreCard
    );
  }
);

export default SpeedGradeQuizAnswerCard;
