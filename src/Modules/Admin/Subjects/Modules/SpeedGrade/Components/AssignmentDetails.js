import React, { useEffect, useState } from "react";
import SpeedGradeQuizAnswerCard from "./SpeedGradeQuizAnswerCard";

const AssignmentDetails = ({ student, details, type, onTotalGradeUpdate }) => {
  const [totalTextGrade, setTotalTextGrade] = useState(0);

  useEffect(() => {
    if (!student || !details) return;

    const { questions } = details.assignmentId || details.quizId || {};
    let initialGrade = 0;

    if (questions && questions.length > 0) {
      initialGrade = questions.reduce((total, question) => {
        const answer = details.answers.find(
          (ans) => ans.questionId === question._id
        );
        if (question.type !== "text" && answer && answer.isCorrect) {
          return total + question.questionPoint;
        }
        return total;
      }, 0);
    }

    setTotalTextGrade(initialGrade);
    onTotalGradeUpdate(initialGrade);
  }, [student, details, onTotalGradeUpdate]);

  const handleUpdateTextQuestionGrade = (gradeDifference) => {
    const newTotal = totalTextGrade + gradeDifference;
    setTotalTextGrade(newTotal);
    onTotalGradeUpdate(newTotal);
  };

  if (!student || !details) {
    return null; // Return null if no student or details are selected
  }

  const { content, assignmentId, grade, score, quizId } = details;
  const { name, points, dueDate, questions, totalPoints } =
    assignmentId || quizId || {};

  return (
    <div className="bg-white">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <div>
          <h2 className="text-xl font-medium mb-1 capitalize">
            {name || "Untitled"}
          </h2>
          <p className="text-gray-500">
            Submission Date:{" "}
            {dueDate ? new Date(dueDate).toLocaleDateString() : "N/A"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 mb-1">Points</p>
          <p className="text-green-500 font-bold text-md">
            {type === "Quiz" ? score : grade}/
            {type === "Quiz" ? totalPoints : points}
          </p>
        </div>
      </div>

      {type === "Assignment" ? (
        <div className="text-gray-700 mb-4">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      ) : (
        <div className="space-y-4">
          {questions && questions.length > 0 ? (
            questions.map((question, index) => {
              const answer = details.answers.find(
                (ans) => ans.questionId === question._id
              );
              return (
                <SpeedGradeQuizAnswerCard
                  key={index}
                  question={question}
                  questionIndex={index}
                  selectedOption={answer ? answer.selectedOption : ""}
                  onUpdateTextQuestionGrade={handleUpdateTextQuestionGrade}
                />
              );
            })
          ) : (
            <p className="text-gray-500">No questions available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AssignmentDetails;
