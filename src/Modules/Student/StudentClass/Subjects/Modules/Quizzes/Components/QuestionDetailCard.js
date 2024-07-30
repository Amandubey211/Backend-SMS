import React from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import AssignmentDetail from '../../../Component/AssignmentDetail';
import DateDetail from '../../../Component/DateDetail';

const QuestionDetailCard = ({ quiz, timeLeft }) => {
  const { totalPoints, allowNumberOfAttempts, timeLimit } = quiz;

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const quizQuestionDetails = [
    { label: "Allow Attempts", value: allowNumberOfAttempts, type: "quizz" },
    { label: "Quiz Point", value: `${totalPoints} Point`, type: "quizz" },
    { label: "Questions", value: "25", type: "quizz" },
    { label: "Time Limit", value: formatTime(timeLimit * 60), type: "quizz" },
  ];

  const timeLimitInSeconds = timeLimit * 60;
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;
  const totalHours = Math.floor(timeLeft / 3600);
  const totalMinutes = 60;
  const totalSeconds = 60;

  const hourPercentage = totalHours ? (hours / totalHours) * 100 : 0;
  const minutePercentage = (minutes / totalMinutes) * 100;
  const secondPercentage = (seconds / totalSeconds) * 100;

  return (
    <div className="flex flex-col gap-24 bg-white" aria-label="Question Detail Card">
      <div className="mb-auto p-3">
        {quizQuestionDetails.map((detail, index) => (
          <AssignmentDetail key={index} label={detail.label} value={detail.value} />
        ))}
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
                  fill: '#000',
                },
                trail: {
                  stroke: '#d6d6d6',
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
                  fill: '#000',
                },
                trail: {
                  stroke: '#d6d6d6',
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
                  fill: '#000',
                },
                trail: {
                  stroke: '#d6d6d6',
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(QuestionDetailCard);
