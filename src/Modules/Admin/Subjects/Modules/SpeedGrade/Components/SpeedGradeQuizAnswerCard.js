import React, { useState } from "react";
import { MdEdit, MdCheckCircle, MdCancel, MdDoneOutline } from "react-icons/md";
import { useTranslation } from "react-i18next";

const SpeedGradeQuizAnswerCard = ({
  question,
  questionIndex,
  selectedOption,
  onUpdateTextQuestionGrade,
}) => {
  const [textGrade, setTextGrade] = useState("");
  const [isEditing, setIsEditing] = useState(true); // Start in edit mode
  const { t } = useTranslation("admModule"); // Adding the translation function with namespace 'speedGradeQuizAnswerCard'

  const correctAnswer = question.correctAnswer;
  const isCorrect = selectedOption === correctAnswer;

  const handleTextGradeChange = (e) => {
    const inputGrade = e.target.value;

    setTextGrade(inputGrade);
  };

  const handleSaveGrade = () => {
    const parsedGrade = parseFloat(textGrade);
    if (!isNaN(parsedGrade) && parsedGrade <= question.questionPoint) {
      onUpdateTextQuestionGrade(parsedGrade - (textGrade || 0), questionIndex);
    } else {
      setTextGrade(question.questionPoint);
      onUpdateTextQuestionGrade(
        question.questionPoint - (textGrade || 0),
        questionIndex
      );
    }
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  return (
    <div className="relative bg-white shadow rounded-lg mb-4 border flex flex-col h-full">
      {/* Badge for non-text questions */}
      {question.type !== "text" && (
        <div className="absolute top-1 right-0">
          {isCorrect ? (
            <span className="px-2 py-2 text-xs shadow-sm font-semibold text-green-800 bg-green-200 rounded-l-full">
              {t("Correct Answer")}
            </span>
          ) : (
            <span className="px-2 py-2 text-xs font-semibold shadow-sm text-red-800 bg-red-200 rounded-l-full">
              {t("Wrong Answer")}
            </span>
          )}
        </div>
      )}

      {/* Input for text-based questions */}
      {question.type === "text" && (
        <div className="absolute top-0 right-0 mt-1 mr-2">
          <div className="relative">
            <input
              type="number"
              className="p-1 border bg-green-50 rounded w-24 text-right pr-8"
              value={textGrade}
              onChange={handleTextGradeChange}
              max={question.questionPoint}
              placeholder={`0/${question.questionPoint}`}
              disabled={!isEditing} // Disable input when not in edit mode
            />
            {isEditing ? (
              <MdDoneOutline
                className="absolute top-2 right-1 text-2xl p-1 rounded-full border bg-green-100 transform -translate-y-1/2 text-green-500 cursor-pointer hover:text-green-700 transition-colors duration-200"
                onClick={handleSaveGrade}
              />
            ) : (
              <MdEdit
                className="absolute top-2 right-1  text-2xl p-1 rounded-full border bg-green-100  transform -translate-y-1/2 text-blue-500 cursor-pointer hover:text-blue-700 transition-colors duration-200"
                onClick={handleEditClick}
              />
            )}
          </div>
        </div>
      )}

      <div className="text-sm font-semibold py-2 ps-2 bg-gray-100 text-gray-500 mb-2">
        {t("Question Point")}:{" "}
        <span className="text-black">{question.questionPoint}</span>
      </div>

      <div className="px-4 pb-3">
        <h2 className="text-md font-semibold mb-3">
          <span
            dangerouslySetInnerHTML={{ __html: question.questionText }}
          ></span>
        </h2>

        <div>
          {question.type === "text" ? (
            <textarea
              rows="4"
              className="w-full p-2 border rounded flex-grow bg-gray-50"
              value={selectedOption || t("No answer provided")}
              readOnly
            />
          ) : (
            question.options.map((option, optionIndex) => (
              <label
                key={optionIndex}
                className={`flex items-center space-x-3 mb-1 cursor-pointer p-1 rounded-md ${
                  option.text === selectedOption
                    ? option.text === correctAnswer
                      ? "bg-green-100"
                      : "bg-red-100"
                    : option.text === correctAnswer
                    ? "bg-green-50"
                    : ""
                }`}
              >
                <div className="relative">
                  {option.text === correctAnswer ? (
                    <MdCheckCircle className="text-green-600 h-5 w-5" />
                  ) : option.text === selectedOption ? (
                    <MdCancel className="text-red-600 h-5 w-5" />
                  ) : (
                    <MdCancel className="text-gray-600 h-5 w-5" />
                  )}
                </div>
                <span
                  className={
                    option.text === selectedOption
                      ? option.text === correctAnswer
                        ? "text-green-600"
                        : "text-red-600"
                      : option.text === correctAnswer
                      ? "text-green-600"
                      : "text-gray-600"
                  }
                >
                  {option.text}
                </span>
                <input
                  type="radio"
                  id={`quiz-${questionIndex}-${optionIndex}`}
                  name={`quiz-${questionIndex}`}
                  value={option.text}
                  checked={selectedOption === option.text}
                  className="hidden"
                  readOnly
                />
              </label>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeedGradeQuizAnswerCard;
