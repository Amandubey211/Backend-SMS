


import React, { useState, useEffect } from 'react';
import AssignmentDetail from '../../../Component/AssignmentDetail';
import DateDetail from '../../../Component/DateDetail';
import SidebarSlide from '../../../../../../../Components/Common/SidebarSlide';
import SelectedQuestionCard from './SelectedQuestionCard';
import { baseUrl } from '../../../../../../../config/Common';

const QuizResultSummary = ({ totalPoints, correctAnswers, wrongAnswers, quizId }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [attemptHistory, setAttemptHistory] = useState([]);

  useEffect(() => {
    console.log("QuizResultSummary props:", { totalPoints, correctAnswers, wrongAnswers, attemptHistory });
  }, [totalPoints, correctAnswers, wrongAnswers, attemptHistory]);

  const fetchAttemptHistory = async () => {
    try {
      const token = localStorage.getItem('student:token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`${baseUrl}/student/studentquiz/${quizId}/attempt`, {
        headers: {
          'Authentication': token,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch attempt history, status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.submission) {
        setAttemptHistory(data.submission);
      } else {
        console.error("No attempt history data or unsuccessful response");
      }
    } catch (error) {
      console.error("Failed to fetch attempt history:", error);
    }
  };

  const handleAttemptClick = (attempt) => {
    setSelectedAttempt(attempt);
  };

  const handleSidebarOpen = () => {
    fetchAttemptHistory();
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
    setSelectedAttempt(null);
  };

  const quizQuestionDetails = [
    { label: "Total Points", value: `${totalPoints}`, type: "quizz" },
    { label: "Correct Answers", value: `${correctAnswers}`, type: "quizz" },
    { label: "Wrong Answers", value: `${wrongAnswers}`, type: "quizz" },
  ];

  return (
    <div className="p-4 bg-white shadow rounded-lg mb-4 border">
      <h2 className="text-xl font-semibold mb-3">Quiz Results</h2>
      {quizQuestionDetails.map((detail, index) => {
        if (detail.type === "quizz") {
          return <AssignmentDetail key={index} label={detail.label} value={detail.value} />;
        } else if (detail.type === "date") {
          return <DateDetail key={index} label={detail.label} value={detail.value} />;
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
        title={<span className="bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
          Attempt History
        </span>}
        width="40%"
      >
        <div className="mt-4 overflow-y-auto" style={{ maxHeight: '80vh' }}>
          <h3 className="text-lg font-semibold">Attempt History</h3>
          {attemptHistory.map((attempt, index) => (
            <div
              key={index}
              className="p-2 border rounded-md mt-2 cursor-pointer"
              // onClick={() => handleAttemptClick(attempt)}
            >
              <div>Attempt-{attempt.attempts}</div>
              <div>Attempt Id-{attempt._id}</div>
              <div>Total Points: {attempt.score}</div>
              <div>Correct Answers: {attempt.rightAnswer}</div>
              <div>Wrong Answers: {attempt.wrongAnswer}</div>
            </div>
          ))}
        </div>
        {selectedAttempt && (
          <>
            <h2 className="text-xl font-semibold mb-4">Attempt-{selectedAttempt.attemptNumber}</h2>
            <div className="flex flex-wrap border overflow-y-auto mb-3 p-9" style={{ maxHeight: '80vh' }}>
              {selectedAttempt.questions.map((question, index) => (
                <div key={index} className="flex-grow">
                  <SelectedQuestionCard question={question} selectedOption={question.selectedOption} />
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
