import React from "react";
import DateDetail from "../../../Component/DateDetail";
import AssignmentDetail from "../../../Component/AssignmentDetail";

const QuizzDetailCard = React.memo(({ quiz }) => {
  const quizDetails = [
    { label: "Quiz Type", value: quiz.quizType },
    { label: "Total Points", value: quiz.totalPoints, extra: "Point" },
    {
      label: "Allow Attempts",
      value: quiz.allowNumberOfAttempts,
      extra: "Time",
    },
    { label: "Question", value: quiz.totalQuestions, extra: "Question" },
    { label: "Time Limit", value: quiz.timeLimit, extra: "Minute" },
  ];

  return (
    <div className="p-3 bg-white " aria-label="Quiz Card">
      <DateDetail label="Due Date" value={quiz.dueDate} />
      {quizDetails.map((detail, index) => (
        <AssignmentDetail
          key={index}
          label={detail.label}
          value={detail.value}
          extra={detail.extra}
        />
      ))}
    </div>
  );
});

export default QuizzDetailCard;
