



import React, { useState } from 'react';
import AssignmentDetail from '../../../Component/AssignmentDetail';
import DateDetail from '../../../Component/DateDetail';
// import SidebarSlide from '../../../Components/Common/SidebarSlide'; // Import SidebarSlide
import SidebarSlide from '../../../../../../../Components/Common/SidebarSlide'; // Import SidebarSlide
import SelectedQuestionCard from './SelectedQuestionCard'; // Import SelectedQuestionCard to display questions

const QuizResultSummary = ({ totalPoints, correctAnswers, wrongAnswers, attemptHistory }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedAttempt, setSelectedAttempt] = useState(null);

  const quizQuestionDetails = [
    { label: "Total Points", value: `${totalPoints}`, type: "quizz" },
    { label: "Correct Answers", value: `${correctAnswers}`, type: "quizz" },
    { label: "Wrong Answers", value: `${wrongAnswers}`, type: "quizz" },
  ];

  const handleAttemptClick = (attempt) => {
    setSelectedAttempt(attempt);
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
    setSelectedAttempt(null);
  };

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
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Attempt History</h3>
        {attemptHistory.map((attempt, index) => (
          <div key={index} className="p-2 border rounded-md mt-2 cursor-pointer" onClick={() => handleAttemptClick(attempt)}>
            <div>Attempt-{attempt.attemptNumber}</div>
            <div>Total Points: {attempt.totalPoints}</div>
            <div>Correct Answers: {attempt.correctAnswers}</div>
            <div>Wrong Answers: {attempt.wrongAnswers}</div>
          </div>
        ))}
      </div>
      <SidebarSlide
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        title={<span className="bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
          Attempt Details
        </span>}
        width="40%"
      >
        

{selectedAttempt && (
          <>
            <h2 className="text-xl font-semibold mb-4">Attempt-{selectedAttempt.attemptNumber}</h2>

            <div className="  flex flex-wrap h-screen  border  overflow-y-auto mb-3 p-9  " style={ {maxHeight:'90vh'}} >
              {selectedAttempt.questions.map((question, index) => (
                <div key={index} className="  flex-grow  ">
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

export default QuizResultSummary;

