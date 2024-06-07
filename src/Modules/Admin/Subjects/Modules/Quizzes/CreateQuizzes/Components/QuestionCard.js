import React from 'react';
import { AiOutlineDelete } from 'react-icons/ai';

const QuestionCard = ({ question, index, deleteQuestion }) => {
  return (
    <div key={index} className="p-4 border rounded-md shadow-sm relative">
      <button
        onClick={() => deleteQuestion(index)}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition"
      >
        <AiOutlineDelete className="text-xl" />
      </button>
      <h4 className="text-lg font-medium mb-2">{question.question}</h4>
      <ul className="list-disc list-inside ml-4">
        {question.options.map((option, optIndex) => (
          <li key={optIndex} className={`mb-1 ${option.isCorrect ? 'text-green-600' : ''}`}>
            {option.text} {option.isCorrect && <span className="font-bold">(Correct)</span>}
          </li>
        ))}
      </ul>
      {question.rightAnswerComment && (
        <p className="mt-2 text-green-600"><strong>Right Answer Comment:</strong> {question.rightAnswerComment}</p>
      )}
      {question.wrongAnswerComment && (
        <p className="mt-2 text-red-600"><strong>Wrong Answer Comment:</strong> {question.wrongAnswerComment}</p>
      )}
    </div>
  );
};

export default QuestionCard;
