// import React, { useState } from "react";
// import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
// import "react-circular-progressbar/dist/styles.css";
// import AssignmentDetail from "../../../Component/AssignmentDetail";
// import DateDetail from "../../../Component/DateDetail";

// const QuestionDetailCard = ({
//   quiz,
//   timeLeft,
//   totalTime,
//   numberOfQuestions,
// }) => {
//   const {
//     totalPoints,
//     allowNumberOfAttempts,
//     timeLimit, // Time in minutes from the backend
//     showshowAnswerDate,
//   } = quiz; // Destructure quiz object

//   const [showTime, setShowTime] = useState(true);

//   // Convert time from minutes to seconds
//   const timeLimitInSeconds = timeLimit * 60; // Convert timeLimit from minutes to seconds
//   const totalTimeInSeconds = totalTime || timeLimitInSeconds;

//   const formatTimeLimit = (minutes) => {
//     const hrs = Math.floor(minutes / 60); // Calculate hours
//     const mins = minutes % 60; // Remaining minutes
//     return `${hrs > 0 ? `${hrs} hr` : ""} ${
//       mins > 0 ? `${mins} Minute` : ""
//     }`.trim();
//   };

//   const quizQuestionDetails = [
//     { label: "Quiz Point", value: totalPoints, type: "quizz", extra: "Point" },
//     {
//       label: "Allow Attempts",
//       value:
//         allowNumberOfAttempts !== null ? allowNumberOfAttempts : "Unlimited",
//       type: "quizz",
//       extra: "Times",
//     },
//     {
//       label: "Remaining Attempts",
//       value: allowNumberOfAttempts, // Update if dynamic logic is needed
//       type: "quizz",
//       extra: "Times",
//     },
//     {
//       label: "Question",
//       value: numberOfQuestions,
//       type: "quizz",
//       extra: "Questions",
//     },
//     {
//       label: "Time Limit",
//       value: formatTimeLimit(timeLimit),
//       type: "quizz",
//     }, // Display converted time
//     showshowAnswerDate && {
//       label: "You can see the correct Answer",
//       value: showshowAnswerDate,
//       type: "date",
//     },
//   ].filter(Boolean); // Filter out undefined or null values

//   // Calculate remaining time components
//   const hours = Math.floor(timeLeft / 3600);
//   const minutes = Math.floor((timeLeft % 3600) / 60);
//   const seconds = timeLeft % 60;

//   // Calculate progress bar percentages
//   const hourPercentage = Math.min(
//     (hours / Math.floor(totalTimeInSeconds / 3600)) * 100,
//     100
//   );
//   const minutePercentage = Math.min((minutes / 60) * 100, 100);
//   const secondPercentage = Math.min((seconds / 60) * 100, 100);

//   const darkerGreen = `rgba(0, 128, 0, 0.9)`; // Dark green color

//   return (
//     <div
//       className="flex flex-col gap-7 py-1 pb-6 px-4 bg-white "
//       aria-label="Question Detail Card"
//     >
//       <div className="mb-auto">
//         {quizQuestionDetails?.map((detail, index) =>
//           detail?.type === "quizz" ? (
//             <AssignmentDetail
//               key={index}
//               label={detail?.label}
//               value={detail?.value}
//               extra={detail?.extra}
//             />
//           ) : (
//             <DateDetail
//               key={index}
//               label={detail?.label}
//               value={detail?.value}
//               labelAbove={detail?.labelAbove}
//             />
//           )
//         )}

//         {/* Show/Hide Time Button */}
//         <div className="flex justify-center items-center">
//           <button
//             onClick={() => setShowTime(!showTime)}
//             className="mt-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-1 px-3 rounded-md shadow-sm hover:bg-opacity-90"
//           >
//             {showTime ? "Hide Time" : "Show Time"}
//           </button>
//         </div>

//         {/* Time Progress Bars */}
//         {showTime && (
//           <div className="flex justify-around mt-6">
//             {/* Circular Progress for Hours */}
//             <div style={{ width: 70, height: 70 }}>
//               <CircularProgressbar
//                 value={hourPercentage}
//                 text={`${String(hours).padStart(2, "0")}\nHours`}
//                 styles={buildStyles({
//                   textColor: "#000",
//                   pathColor: darkerGreen,
//                   trailColor: "#e0e0e0", // Light gray
//                   textSize: "18px",
//                   lineHeight: "1.2", // Adjust text line height inside the circle
//                 })}
//               />
//             </div>

//             {/* Circular Progress for Minutes */}
//             <div style={{ width: 70, height: 70 }}>
//               <CircularProgressbar
//                 value={minutePercentage}
//                 text={`${String(minutes).padStart(2, "0")}\nMin`}
//                 styles={buildStyles({
//                   textColor: "#000",
//                   pathColor: darkerGreen,
//                   trailColor: "#e0e0e0", // Light gray
//                   textSize: "18px",
//                   lineHeight: "1.2", // Adjust text line height inside the circle
//                 })}
//               />
//             </div>

//             {/* Circular Progress for Seconds */}
//             <div style={{ width: 70, height: 70 }}>
//               <CircularProgressbar
//                 value={secondPercentage}
//                 text={`${String(seconds).padStart(2, "0")}\nSec`}
//                 styles={buildStyles({
//                   textColor: "#000",
//                   pathColor: darkerGreen,
//                   trailColor: "#e0e0e0", // Light gray
//                   textSize: "18px",
//                   lineHeight: "1.2", // Adjust text line height inside the circle
//                 })}
//               />
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default QuestionDetailCard;

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import AssignmentDetail from "../../../Component/AssignmentDetail";
import DateDetail from "../../../Component/DateDetail";

const QuestionDetailCard = () => {
  const { itemDetails, timeLeft, totalTime, attemptHistory } = useSelector(
    (store) => store?.student?.studentQuiz
  );

  const [showTime, setShowTime] = useState(true);

  // Extract data from itemDetails
  const {
    totalPoints,
    allowNumberOfAttempts,
    timeLimit,
    showshowAnswerDate,
    questions,
  } = itemDetails || {};

  const numberOfQuestions = questions?.length;

  // Fallback values to avoid NaN
  const safeTotalTime = totalTime || 1; // Avoid division by zero

  const safeTimeLeft = timeLeft || 0; // Fallback to 0 if undefined
  const hours = Math.floor(safeTimeLeft / 3600);
  const minutes = Math.floor((safeTimeLeft % 3600) / 60);
  const seconds = safeTimeLeft % 60;

  // Calculate progress bar percentages
  const hourPercentage = Math.min(
    (hours / Math.floor(safeTotalTime / 3600)) * 100,
    100
  );
  const minutePercentage = Math.min((minutes / 60) * 100, 100);
  const secondPercentage = Math.min((seconds / 60) * 100, 100);

  const darkerGreen = `rgba(0, 128, 0, 0.9)`; // Dark green color
  const formatTimeLimit = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs > 0 ? `${hrs} hr` : ""} ${
      mins > 0 ? `${mins} Minute` : ""
    }`.trim();
  };

  const quizQuestionDetails = [
    { label: "Quiz Point", value: totalPoints, type: "quizz", extra: "Point" },
    {
      label: "Allow Attempts",
      value:
        allowNumberOfAttempts !== null ? allowNumberOfAttempts : "Unlimited",
      type: "quizz",
      extra: "Times",
    },
    {
      label: "Remaining Attempts",
      value:
        allowNumberOfAttempts !== null
          ? allowNumberOfAttempts - (attemptHistory?.length || 0)
          : "Unlimited",
      type: "quizz",
      extra: "Times",
    },
    {
      label: "Question",
      value: numberOfQuestions,
      type: "quizz",
      extra: "Questions",
    },
    {
      label: "Time Limit",
      value: formatTimeLimit(timeLimit),
      type: "quizz",
    },
    showshowAnswerDate && {
      label: "You can see the correct Answer",
      value: showshowAnswerDate,
      type: "date",
    },
  ].filter(Boolean);

  return (
    <div
      className="flex flex-col gap-7 py-1 pb-6 px-4 bg-white "
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
                  trailColor: "#e0e0e0",
                  textSize: "18px",
                  lineHeight: "1.2",
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
                  trailColor: "#e0e0e0",
                  textSize: "18px",
                  lineHeight: "1.2",
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
                  trailColor: "#e0e0e0",
                  textSize: "18px",
                  lineHeight: "1.2",
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
