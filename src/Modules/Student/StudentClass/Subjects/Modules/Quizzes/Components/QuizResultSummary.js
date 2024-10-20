import React, { useState, useEffect } from "react";
import AssignmentDetail from "../../../Component/AssignmentDetail";
import DateDetail from "../../../Component/DateDetail";
import SidebarSlide from "../../../../../../../Components/Common/SidebarSlide";
import SelectedQuestionCard from "./SelectedQuestionCard";
import { baseUrl } from "../../../../../../../config/Common";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedAttempt } from "../../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Quizes/quizesSlice";
import { fetchAttemptHistory } from "../../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Quizes/quizes.action";

const QuizResultSummary = ({
  totalPoints,
  correctAnswers,
  wrongAnswers,
  quizId,
}) => {
  const { selectedAttempt, attemptHistory} = useSelector((store) => store?.student?.studentQuiz);
  const dispatch=useDispatch();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  // const [selectedAttempt, setSelectedAttempt] = useState(null);
  // const [attemptHistory, setAttemptHistory] = useState([]);


  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const hoursDisplay = hours > 0 ? `${hours}h ` : "";
    const minutesDisplay = minutes > 0 ? `${minutes}m ` : "";
    const secondsDisplay = `${seconds}s`;

    return `${hoursDisplay}${minutesDisplay}${secondsDisplay}`.trim();
  };

  const quizQuestionDetails = [
    { label: "Total Points", value: `${totalPoints}`, type: "quizz" },
    { label: "Correct Answers", value: `${correctAnswers}`, type: "quizz" },
    { label: "Wrong Answers", value: `${wrongAnswers}`, type: "quizz" },
  ];



  // useEffect(() => {
  //   console.log("QuizResultSummary props:", {
  //     totalPoints,
  //     correctAnswers,
  //     wrongAnswers,
  //     attemptHistory,
  //   });
  // }, [totalPoints, correctAnswers, wrongAnswers, attemptHistory]);

  // const fetchAttemptHistory = async () => {
  //   try {
  //     const token = localStorage.getItem("student:token");
  //     if (!token) {
  //       throw new Error("Authentication token not found");
  //     }

  //     const response = await fetch(
  //       `${baseUrl}/student/studentquiz/${quizId}/attempt`,
  //       {
  //         headers: {
  //           Authentication: token,
  //         },
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error(
  //         `Failed to fetch attempt history, status: ${response.status}`
  //       );
  //     }

  //     const data = await response.json();

  //     if (data.success && data.submission) {
  //       setAttemptHistory(data.submission);
  //     } else {
  //       console.error("No attempt history data or unsuccessful response");
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch attempt history:", error);
  //   }
  // };

  const handleAttemptClick = (attempt) => {
    dispatch(setSelectedAttempt(attempt));
  };

  const handleSidebarOpen = () => {
    dispatch(fetchAttemptHistory({quizId}));
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
    dispatch(setSelectedAttempt(null));
  };



  return (
    <div className="mt-4 overflow-y-auto px-4"  style={{ maxHeight: "80vh" }}>
      <h3 className="text-lg font-semibold">Attempt History</h3>
      {Array.isArray(attemptHistory) && attemptHistory.length > 0 ? (
        attemptHistory?.map((attempt, index) => (
          <div
            key={index}
            className="p-2 border rounded-md mt-2 cursor-pointer hover:bg-gray-100"
            onClick={() => handleAttemptClick(attempt)}
          >
            <h3 className="font-medium text-lg text-blue-600">
              Attempt-{attempt.attempts}
            </h3>
            <ul className="list-none space-y-1">
              <li className="font-mono">
                Time Taken:{" "}
                <span className="text-gray-700 font-semibold">
                  {formatTime(attempt.timeTaken)}
                </span>
              </li>
              <li>
                <strong>Total Points:</strong>{" "}
                <span className="text-gray-700 font-semibold">
                  {attempt.score}
                </span>
              </li>
              <li>
                <strong>Correct Answers:</strong>{" "}
                <span className="text-green-500 font-semibold">
                  {attempt.rightAnswer}
                </span>
              </li>
              <li>
                <strong>Wrong Answers:</strong>{" "}
                <span className="text-red-500 font-semibold">
                  {attempt.wrongAnswer}
                </span>
              </li>
            </ul>
          </div>
        ))
      ) : (
        <div>No attempt history available.</div>
      )}
    </div>
  );
  
};

export default React.memo(QuizResultSummary);
