import React, { useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import AssignmentDetail from "../../../Component/AssignmentDetail";
import DateDetail from "../../../Component/DateDetail";

const QuestionDetailCard = ({
  quiz,
  timeLeft,
  totalTime,
  numberOfQuestions,
}) => {
  const {
    name,
    quizType,
    availableFrom,
    totalPoints,
    allowNumberOfAttempts,
    timeLimit,
    showshowAnswerDate,

  } = quiz; // Destructure quiz object

  const [showTime, setShowTime] = useState(true);

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const quizQuestionDetails = [
    {
      label: "Allow Attempts",
      value: allowNumberOfAttempts,
      type: "quizz",
      extra: "Times",
    },
    { label: "Quiz Point", value: totalPoints, type: "quizz", extra: "Point" },
    {
      label: "Question",
      value: numberOfQuestions,
      type: "quizz",
      extra: "Question",
    },
    { label: "Time Limit", value: formatTime(timeLimit), type: "quizz" },
    {
      label: "You can see the correct Answer",
      value: showshowAnswerDate,
      type: "date",
    },
  ];

  // Convert timeLimit to seconds if it's not already
  const timeLimitInSeconds = timeLimit * 60;

  // Calculate hours, minutes, and seconds from timeLeft
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const totalHours = Math.floor(timeLimitInSeconds / 3600);
  const totalMinutes = 60; // Max minutes value is always 60
  const totalSeconds = 60; // Max seconds value is always 60

  // Calculate percentage for the circular progress bars
  const hourPercentage = totalHours ? (hours / totalHours) * 100 : 0;
  const minutePercentage = (minutes / totalMinutes) * 100;
  const secondPercentage = (seconds / totalSeconds) * 100;

  // Darker color for circular progress bars
  const darkerGreen = `rgba(0, 128, 0, 0.9)`; // Dark green color

  return (
    <div
      className="flex flex-col gap-7 py-1 pb-6 px-4 bg-white rounded-lg shadow-md"
      aria-label="Question Detail Card"
    >
      <div className="mb-auto">
        {quizQuestionDetails?.map((detail, index) =>
          detail?.type === "quizz" ? (
            <AssignmentDetail
              key={index}
              label={detail?.label}
              value={detail?.value}
              extra={detail?.extra}
            />
          ) : (
            <DateDetail
              key={index}
              label={detail?.label}
              value={detail?.value}
              labelAbove={detail?.labelAbove}
            />
          )
        )}

        {/* Show/Hide Time Button */}
        <div className="flex justify-center items-center">
          <button
            onClick={() => setShowTime(!showTime)}
            className="mt-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-1 px-3 rounded-md shadow-sm hover:bg-opacity-90"
          >
            {showTime ? "Hide Time" : "Show Time"}
          </button>
        </div>

        {/* Time Progress Bars */}
        {showTime && (
          <div className="flex justify-around mt-6">
            {/* Circular Progress for Hours */}
            <div style={{ width: 70, height: 70 }}>
              <CircularProgressbar
                value={hourPercentage}
                text={`${String(hours).padStart(2, "0")}\nHours`}
                styles={buildStyles({
                  textColor: "#000",
                  pathColor: darkerGreen,
                  trailColor: "#e0e0e0", // Light gray
                  textSize: "18px",
                  lineHeight: "1.2", // Adjust text line height inside the circle
                })}
              />
            </div>

            {/* Circular Progress for Minutes */}
            <div style={{ width: 70, height: 70 }}>
              <CircularProgressbar
                value={minutePercentage}
                text={`${String(minutes).padStart(2, "0")}\nMin`}
                styles={buildStyles({
                  textColor: "#000",
                  pathColor: darkerGreen,
                  trailColor: "#e0e0e0", // Light gray
                  textSize: "18px",
                  lineHeight: "1.2", // Adjust text line height inside the circle
                })}
              />
            </div>

            {/* Circular Progress for Seconds */}
            <div style={{ width: 70, height: 70 }}>
              <CircularProgressbar
                value={secondPercentage}
                text={`${String(seconds).padStart(2, "0")}\nSec`}
                styles={buildStyles({
                  textColor: "#000",
                  pathColor: darkerGreen,
                  trailColor: "#e0e0e0", // Light gray
                  textSize: "18px",
                  lineHeight: "1.2", // Adjust text line height inside the circle
                })}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionDetailCard;
