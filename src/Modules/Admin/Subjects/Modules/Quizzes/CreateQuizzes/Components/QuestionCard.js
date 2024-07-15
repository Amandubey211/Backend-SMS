import React from "react";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const QuestionCard = ({ question, index, deleteQuestion }) => {
  return (
    <div className=" bg-white shadow min-h-60 min-w-96 rounded-lg mb-4 border">
      <div className="flex justify-between items-center mb-2 bg-gray-100 p-3">
        <div className="text-sm font-semibold ">
          Question Point :{" "}
          <span className="text-black">{question.questionPoint}</span>
        </div>
        <div className="flex space-x-2">
          <FiEdit2 className="text-green-600 cursor-pointer text-xl" />
          <FiTrash2
            className="text-red-600 cursor-pointer text-xl"
            onClick={() => deleteQuestion(index)}
          />
        </div>
      </div>
      <div className="px-4 py-2">
        <h2 className="text-lg font-semibold mb-3">
          <span
            dangerouslySetInnerHTML={{ __html: question.questionText }}
          ></span>
          {/* <span>?</span> */}
        </h2>
        <div className="space-y-2 ms-4">
          {question.options.map((option, optionIndex) => (
            <label key={optionIndex} className="flex items-center space-x-3">
              <div className="relative">
                {option.isCorrect ? (
                  <FaCheckCircle className="text-green-600 h-4 w-4" />
                ) : (
                  <FaRegCircle className="text-gray-600 h-4 w-4" />
                )}
              </div>
              <span className={option.isCorrect ? "text-green-600" : ""}>
                {option.text}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
