import React from "react";
import DateDetail from "../../../Component/DateDetail";
import AssignmentDetail from "../../../Component/AssignmentDetail";
import ButtonsGroup from "../../../Component/ButtonsGroup";
import SpeedGradeButton from "../../../Component/SpeedGradeButton";

const QuizzDetailCard = ({ quiz, onRefresh, isPublish }) => {
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
      value: new Date(
        quiz?.showAnswerDate || "MM/DD/YYYY"
      ).toLocaleDateString(),
      type: "quizz",
    },
    {
      label: "Available From",
      value: quiz?.availableFrom
        ? new Date(quiz?.availableFrom).toLocaleDateString()
        : "N/A",
      type: "date",
    },
    {
      label: "Due Date",
      value: quiz?.dueDate
        ? new Date(quiz?.dueDate).toLocaleDateString()
        : "N/A",
      type: "date",
    },
  ];

  return (
    <div className="p-3 bg-white" aria-label="Quiz Card">
      <ButtonsGroup data={quiz} type="Quiz" onRefresh={onRefresh} />
      <p className="text-center text-green-500 italic font-semibold pb-3 border-b">
        Submitted Students : 50/100{" "}
      </p>
      <SpeedGradeButton
        type="Quiz"
        sgid={quiz?._id}
        name={quiz?.name}
        isPublish={isPublish}
      />

      <div className="ps-3 ">
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
              <DateDetail
                key={index}
                label={detail.label}
                value={detail.value}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default QuizzDetailCard;
