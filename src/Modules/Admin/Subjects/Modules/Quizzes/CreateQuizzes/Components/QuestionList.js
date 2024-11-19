// QuestionList.jsx
import React from "react";
import QuestionCard from "./QuestionCard";

const QuestionList = ({
  questions,
  deleteQuestion,
  editQuestion,
  allowShuffleAnswers,
}) => {
  const totalPoints = questions?.reduce((sum, question) => {
    return sum + parseFloat(question.questionPoint);
  }, 0);

  return (
    <div className="w-full px-4 py-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h3 className="text-2xl font-semibold mb-2 md:mb-0">All Questions:</h3>
        <h3 className="text-xl font-medium">Total Points: {totalPoints}</h3>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {questions?.map((q) => (
          <QuestionCard
            key={q._id}
            question={q}
            allowShuffleAnswers={allowShuffleAnswers}
            deleteQuestion={() => deleteQuestion(q._id)}
            editQuestion={() => editQuestion(q._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionList;
