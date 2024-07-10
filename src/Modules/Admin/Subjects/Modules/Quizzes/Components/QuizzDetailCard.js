import React from "react";
import DateDetail from "../../../Component/DateDetail";
import AssignmentDetail from "../../../Component/AssignmentDetail";
import ButtonsGroup from "../../../Component/ButtonsGroup";
import SpeedGradeButton from "../../../Component/SpeedGradeButton";
import { useParams } from "react-router-dom";

const QuizzDetailCard = ({ quiz }) => {
  const quizDetails = [
    {
      label: "Quiz Point",
      value: `${quiz?.totalPoints || 0} Points`,
      type: "quizz",
    },
    { label: "Quiz Type", value: quiz?.quizType || "N/A", type: "quizz" },
    { label: "Quiz Score", value: "0 out of 10", type: "quizz" },
    {
      label: "Multiple Attempts",
      value: quiz?.allowedAttempts ? "Yes" : "No",
      type: "quizz",
    },
    { label: "Submitting date", value: "20-5-2024", type: "quizz" },
    {
      label: "One Question at a time",
      value: quiz?.showOneQuestionOnly ? "Yes" : "No",
      type: "quizz",
    },
    {
      label: "Time Limit",
      value: quiz?.timeLimit ? `${quiz.timeLimit} Minutes` : "No Time Limit",
      type: "quizz",
    },

    {
      label: "This Quiz Is For",
      value: quiz?.assignTo || "N/A",
      type: "quizz",
    },
    {
      label: "Student See The correct Answer",
      value: new Date(quiz?.showAnswerDate).toLocaleDateString(),
      type: "quizz",
    },
    {
      label: "Available From",
      value: new Date(quiz?.availableFrom).toLocaleDateString(),
      type: "date",
    },

    {
      label: "Due Date",
      value: new Date(quiz?.dueDate).toLocaleDateString(),
      type: "date",
    },
 
    // { label: "Until", value: "02/10/2024", type: "date" }
  ];

  return (
    <div className="p-3 bg-white" aria-label="Quiz Card">
      <ButtonsGroup />
      <p className="text-center text-green-500 italic font-semibold pb-3 border-b">
        Submitted Students : 50/100{" "}
      </p>
      <SpeedGradeButton />
      {quizDetails.map((detail, index) => {
        if (detail.type === "quizz") {
          return (
            <AssignmentDetail
              key={index}
              label={detail.label}
              value={detail.value}
            />
          );
        } else if (detail.type === "date") {
          return (
            <DateDetail key={index} label={detail.label} value={detail.value} />
          );
        }
        return null;
      })}
    </div>
  );
};

export default QuizzDetailCard;
