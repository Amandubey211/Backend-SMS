/* src/Modules/Student/StudentClass/Subjects/Quizzes/Components/QuizzDetailCard.jsx */
import React, { useMemo } from "react";
import DateDetail from "../../../Component/DateDetail";
import AssignmentDetail from "../../../Component/AssignmentDetail";
import { useSelector } from "react-redux";

/* convert minutes ➡ `xh ym` */
const formatTimeLimit = (minutes = 0) => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs ? `${hrs} hr` : ""} ${mins ? `${mins} min` : ""}`.trim();
};

const QuizzDetailCard = () => {
  /* pull quiz meta + attempt history from store */
  const { itemDetails: quiz, attemptHistory } = useSelector(
    (s) => s.student.studentQuiz
  );

  /* compute remaining attempts once per render */
  const remainingAttempts = useMemo(() => {
    if (quiz?.allowNumberOfAttempts === null) return "Unlimited";
    return Math.max(
      (quiz?.allowNumberOfAttempts || 0) - (attemptHistory?.length || 0),
      0
    );
  }, [quiz?.allowNumberOfAttempts, attemptHistory]);

  /* build the detail rows */
  const quizDetails = [
    { label: "Due Date", value: quiz?.dueDate, type: "date" },
    { label: "Quiz Type", value: quiz?.quizType, type: "quizz" },
    {
      label: "Quiz Points",
      value: quiz?.totalPoints,
      type: "quizz",
      extra: "Pts",
    },
    {
      label: "Allowed Attempts",
      value: quiz?.allowNumberOfAttempts ?? "Unlimited",
      type: "quizz",
      extra: "Times",
    },
    {
      label: "Remaining Attempts",
      value: remainingAttempts,
      type: "quizz",
      extra: "Left",
    },
    {
      label: "Questions",
      value: quiz?.questions?.length,
      type: "quizz",
      extra: "Qs",
    },
    {
      label: "Time Limit",
      value: formatTimeLimit(quiz?.timeLimit),
      type: "quizz",
    },
  ];

  return (
    <div className="px-4">
      {quizDetails.map((d, i) =>
        d.type === "date" ? (
          <DateDetail key={i} label={d.label} value={d.value} />
        ) : (
          <AssignmentDetail
            key={i}
            label={d.label}
            value={d.value}
            extra={d.extra}
          />
        )
      )}
    </div>
  );
};

export default QuizzDetailCard;
