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
    <div className="">
      <div className="flex justify-between px-4 items-center">
        <h3 className="text-xl font-semibold mb-2">All Questions:</h3>
        <h3>Total Points: {totalPoints}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {questions?.map((q) => (
          <QuestionCard
            key={q._id}
            question={q}
            allowShuffleAnswers={allowShuffleAnswers} // Pass the prop here
            deleteQuestion={() => deleteQuestion(q._id)}
            editQuestion={() => editQuestion(q._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionList;
