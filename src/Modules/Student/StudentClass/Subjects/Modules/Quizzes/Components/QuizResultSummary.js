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



  useEffect(() => {
    console.log("QuizResultSummary props:", {
      totalPoints,
      correctAnswers,
      wrongAnswers,
      attemptHistory,
    });
  }, [totalPoints, correctAnswers, wrongAnswers, attemptHistory]);

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
    <div className="p-4 bg-white shadow rounded-lg mb-4 border">
      <h2 className="text-xl font-semibold mb-3">Quiz Results</h2>
      {quizQuestionDetails?.map((detail, index) => {
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

      <button
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md"
        onClick={handleSidebarOpen}
      >
        View Attempt History
      </button>

      <SidebarSlide
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        title={
          <span className="bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
            Attempt History
          </span>
        }
        width="40%"
      >
        <div className="mt-4 overflow-y-auto" style={{ maxHeight: "80vh" }}>
          <h3 className="text-lg font-semibold">Attempt History</h3>
          {attemptHistory?.map((attempt, index) => {
            console.log(`Attempt ${index + 1}:`, attempt);

            return (
              <div
                key={index}
                className="p-2 border rounded-md mt-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleAttemptClick(attempt)}
              >
                <h3 className="font-medium text-lg text-blue-600">
                  Attempt-{attempt.attempts}
                </h3>
                <ul className="list-none space-y-1">
                  <li className=" font-mono">
                    Time Taken:{" "}
                    <span className="text-gray-700  font-semibold">
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
                    <span className="text-green-500  font-semibold">
                      {attempt.rightAnswer}
                    </span>
                  </li>
                  <li>
                    <strong>Wrong Answers:</strong>{" "}
                    <span className="text-red-500  font-semibold">
                      {attempt.wrongAnswer}
                    </span>
                  </li>
                </ul>
              </div>
            );
          })}
        </div>
        {selectedAttempt && (
          <>
            <h2 className="text-xl font-semibold mb-4">
              Attempt-{selectedAttempt.attemptNumber}
            </h2>
            <div
              className="flex flex-wrap border overflow-y-auto mb-3 p-9"
              style={{ maxHeight: "80vh" }}
            >
              {selectedAttempt?.questions?.map((question, index) => (
                <div key={index} className="flex-grow">
                  <SelectedQuestionCard
                    question={question}
                    selectedOption={question.selectedOption}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </SidebarSlide>
    </div>
  );
};

export default React.memo(QuizResultSummary);
