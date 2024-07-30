import React, { useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import AssignmentDetail from "../../../Component/AssignmentDetail";
import DateDetail from "../../../Component/DateDetail";

const QuestionDetailCard = ({ quiz, timeLeft }) => {
  const { totalPoints, allowNumberOfAttempts, timeLimit, showAnswerDate } =
    quiz;

  const [showTime, setShowTime] = useState(true);

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const quizQuestionDetails = [
    { label: "Allowed Attempts", value: allowNumberOfAttempts, type: "quizz" },
    { label: "Quiz Point", value: `${totalPoints} Point`, type: "quizz" },
    { label: "Question", value: "25 Question", type: "quizz" },
    {
      label: "Time Limit",
      value: `${Math.floor(timeLimit / 60)} Hour ${timeLimit % 60} Minute`,
      type: "quizz",
    },
    {
      label: "You Can See the correct Answer on :",
      value: showAnswerDate,
      type: "date",
      labelAbove: true,
    },
  ];

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const hourPercentage = hours ? (hours / 24) * 100 : 0;
  const minutePercentage = (minutes / 60) * 100;
  const secondPercentage = (seconds / 60) * 100;

  return (
    <div
      className="flex flex-col gap-24 bg-white "
      aria-label="Question Detail Card"
    >
      <div className="mb-auto">
        {quizQuestionDetails.map((detail, index) =>
          detail.type === "quizz" ? (
            <AssignmentDetail
              key={index}
              label={detail.label}
              value={detail.value}
            />
          ) : (
            <DateDetail
              key={index}
              label={detail.label}
              value={detail.value}
              labelAbove={detail.labelAbove}
            />
          )
        )}
        <div className="flex justify-center items-center">
          <button
            onClick={() => setShowTime(!showTime)}
            className="mt-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-1 px-3  rounded-md"
          >
            {showTime ? "Hide Time" : "Show Time"}
          </button>{" "}
        </div>
        {showTime && (
          <div className="flex justify-around mt-4">
            <div style={{ width: 70, height: 70 }}>
              <CircularProgressbar
                value={hourPercentage}
                text={`${hours} Hours`}
                styles={{
                  path: {
                    stroke: `rgba(25, 246, 138, 0.8)`,
                  },
                  text: {
                    fill: "#000",
                  },
                  trail: {
                    stroke: "#d6d6d6",
                  },
                }}
              />
            </div>
            <div style={{ width: 70, height: 70 }}>
              <CircularProgressbar
                value={minutePercentage}
                text={`${minutes} Min`}
                styles={{
                  path: {
                    stroke: `rgba(25, 246, 138, 0.8)`,
                  },
                  text: {
                    fill: "#000",
                  },
                  trail: {
                    stroke: "#d6d6d6",
                  },
                }}
              />
            </div>
            <div style={{ width: 70, height: 70 }}>
              <CircularProgressbar
                value={secondPercentage}
                text={`${seconds} Sec`}
                styles={{
                  path: {
                    stroke: `rgba(25, 246, 138, 0.8)`,
                  },
                  text: {
                    fill: "#000",
                  },
                  trail: {
                    stroke: "#d6d6d6",
                  },
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(QuestionDetailCard);
