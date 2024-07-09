import React from 'react';
import { AiOutlinePlus, AiOutlineInfoCircle } from 'react-icons/ai';
import { BsCheck } from 'react-icons/bs';

const AnswerSection = ({ answers, setAnswers, handleAnswerChange, rightAnswerComment, setRightAnswerComment, wrongAnswerComment, setWrongAnswerComment }) => {
  const handleCheckboxChange = (index) => {
    const newAnswers = answers.map((answer, i) => ({
      ...answer,
      isCorrect: i === index ? !answer.isCorrect : false,
    }));
    setAnswers(newAnswers);
  };

  return (
    <div className="p-6 bg-white space-y-6">
      <h2 className="text-xl font-semibold">Answer Section</h2>
      <div className="flex items-center space-x-2">
        <AiOutlineInfoCircle className="text-gray-500" />
        <p className="text-gray-500">Select the correct answer and write an answer text</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {answers.map((answer, index) => (
          <div key={index} className="flex items-center space-x-2 border p-1 ps-3 rounded-md">
            <div
              className={`flex items-center justify-center h-6 w-6 rounded ${answer.isCorrect ? 'bg-green-500' : 'bg-gray-200'} text-white cursor-pointer`}
              onClick={() => handleCheckboxChange(index)}
            >
              {answer.isCorrect && <BsCheck />}
            </div>
            <input
              type="text"
              name="text"
              value={answer.text}
              onChange={(e) => handleAnswerChange(index, e)}
              placeholder="Answer Text"
              className="w-full p-2 border-none focus:ring-0"
            />
          </div>
        ))}
      </div>

      <button
        onClick={() => setAnswers([...answers, { text: '', isCorrect: false }])}
        className="flex items-center text-green-500 hover:text-green-700 transition font-semibold mt-4"
      >
        <AiOutlinePlus className="mr-2" />
        Add Another Answer
      </button>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            name="rightAnswerComment"
            value={rightAnswerComment}
            onChange={(e) => setRightAnswerComment(e.target.value)}
            placeholder="Type Right Answer Comment"
            className="w-full p-3 border border-green-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            name="wrongAnswerComment"
            value={wrongAnswerComment}
            onChange={(e) => setWrongAnswerComment(e.target.value)}
            placeholder="Type Wrong Answer Comment"
            className="w-full p-3 border border-red-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>
    </div>
  );
};

export default AnswerSection;
