import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedAttempt } from "../../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Quizes/quizesSlice";

const QuizResultSummary = () => {
  const { attemptHistory } = useSelector(
    (store) => store?.student?.studentQuiz
  );
  const dispatch = useDispatch();

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const hoursDisplay = hours > 0 ? `${hours}h ` : "";
    const minutesDisplay = minutes > 0 ? `${minutes}m ` : "";
    const secondsDisplay = `${seconds}s`;

    return `${hoursDisplay}${minutesDisplay}${secondsDisplay}`.trim();
  };

  const handleAttemptClick = (attempt) => {
    dispatch(setSelectedAttempt(attempt));
  };

  return (
    <div className="mt-4 overflow-y-auto px-4" style={{ maxHeight: "80vh" }}>
      <h3 className="text-lg font-semibold">
        Attempt History ({attemptHistory.length})
      </h3>
      {Array.isArray(attemptHistory) && attemptHistory.length > 0 ? (
        attemptHistory?.map((attempt, index) => (
          <div
            key={index}
            className="p-4 border rounded-md mt-4 cursor-pointer hover:bg-gray-100"
            onClick={() => handleAttemptClick(attempt)}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-lg text-blue-600">
                Attempt {attempt?.attempts}
              </h3>
              <span className="text-gray-500 text-sm">
                {new Date(attempt?.date).toLocaleString()}
              </span>
            </div>
            <ul className="list-none space-y-1 mt-2">
              <li className="font-mono">
                <strong>Time Taken:</strong>{" "}
                <span className="text-gray-700 font-semibold">
                  {formatTime(attempt?.timeTaken)}
                </span>
              </li>
              <li>
                <strong>Total Points:</strong>{" "}
                <span className="text-gray-700 font-semibold">
                  {attempt?.score}
                </span>
              </li>
              <li>
                <strong>Correct Answers:</strong>{" "}
                <span className="text-green-500 font-semibold">
                  {attempt?.rightAnswer}
                </span>
              </li>
              <li>
                <strong>Wrong Answers:</strong>{" "}
                <span className="text-red-500 font-semibold">
                  {attempt?.wrongAnswer}
                </span>
              </li>
            </ul>
            <div className="mt-2">
              <button
                className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600"
                onClick={() => handleAttemptClick(attempt)}
              >
                View Details
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="mt-2 text-gray-600">No attempt history available.</div>
      )}
    </div>
  );
};

export default React.memo(QuizResultSummary);
