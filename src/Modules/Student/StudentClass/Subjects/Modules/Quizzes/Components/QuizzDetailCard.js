import React from "react";
import DateDetail from "../../../Component/DateDetail";
import AssignmentDetail from "../../../Component/AssignmentDetail";

// Utility function to convert minutes to hours and minutes
const formatTimeLimit = (minutes) => {
  const hrs = Math.floor(minutes / 60); // Calculate hours
  const mins = minutes % 60; // Remaining minutes
  return `${hrs > 0 ? `${hrs} hr` : ""} ${
    mins > 0 ? `${mins} Minute` : ""
  }`.trim();
};

const QuizzDetailCard = ({ quiz }) => {
  const quizDetails = [
    { label: "Due Date", value: quiz?.dueDate, type: "date" },
    { label: "Quiz Type", value: quiz?.quizType, type: "quizz" },
    {
      label: "Quiz Points",
      value: quiz?.totalPoints,
      type: "quizz",
      extra: "Point",
    },
    {
      label: "Allow Attempts",
      value: quiz?.allowNumberOfAttempts,
      type: "quizz",
      extra: "Time",
    },
    {
      label: "Questions",
      value: quiz?.questions?.length,
      type: "quizz",
      extra: "Question",
    },
    {
      label: "Time Limit",
      value: formatTimeLimit(quiz?.timeLimit),
      type: "quizz",
    },
  ];

  return (
    <div className="px-4 ">
      {quizDetails?.map((detail, index) => {
        if (detail.type === "quizz") {
          return (
            <AssignmentDetail
              key={index}
              label={detail?.label}
              extra={detail?.extra}
              value={detail?.value}
            />
          );
        } else if (detail?.type === "date") {
          return (
            <DateDetail key={index} label={detail?.label} value={detail?.value} />
          );
        }
      })}
    </div>
  );
};

export default QuizzDetailCard;
