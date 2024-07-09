import React from 'react';
import QuestionCard from './QuestionCard';

const QuestionList = ({ questions, deleteQuestion }) => {
  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-2">Added Questions:</h3>
      <div className="space-y-4">
        {questions.map((q, index) => (
          <QuestionCard key={index} question={q} index={index} deleteQuestion={deleteQuestion} />
        ))}
      </div>
    </div>
  );
};

export default QuestionList;
