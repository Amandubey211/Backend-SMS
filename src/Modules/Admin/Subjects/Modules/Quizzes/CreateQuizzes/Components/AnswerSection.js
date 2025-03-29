import React from "react";
import {
  AiOutlinePlus,
  AiOutlineInfoCircle,
  AiOutlineMinus,
} from "react-icons/ai";
import { BsCheck } from "react-icons/bs";
import { useTranslation } from "react-i18next";

const AnswerSection = ({
  answers,
  setAnswers,
  handleAnswerChange,
  rightAnswerComment,
  setRightAnswerComment,
  wrongAnswerComment,
  setWrongAnswerComment,
  error,
}) => {
  const { t } = useTranslation("admModule");

  const handleCheckboxChange = (index) => {
    const newAnswers = answers.map((answer, i) => ({
      ...answer,
      isCorrect: i === index ? !answer.isCorrect : false,
    }));
    setAnswers(newAnswers);
  };

  const handleRemoveAnswer = (index) => {
    const newAnswers = answers.filter((_, i) => i !== index);
    setAnswers(newAnswers);
  };

  const handleInputChange = (index, event) => {
    const { value } = event.target;
    const newAnswers = answers.map((answer, i) =>
      i === index ? { ...answer, text: value } : answer
    );
    setAnswers(newAnswers);
  };

  return (
    <div
      className={`p-6 bg-white space-y-6 ${
        error ? "border border-red-500" : ""
      }`}
    >
      <h2 className="text-xl font-semibold">{t("Answer Section")}</h2>
      <div className="flex items-center space-x-2">
        <AiOutlineInfoCircle className="text-gray-500" />
        <p className="text-gray-500">
          {t("Select the correct answer and write an answer text")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {answers.map((answer, index) => (
          <div
            key={index}
            className="relative flex items-center space-x-2 border p-1 ps-3 rounded-md"
          >
            <div
              className={`flex items-center justify-center h-6 w-6 rounded ${
                answer.isCorrect ? "bg-green-500" : "bg-gray-200"
              } text-white cursor-pointer`}
              onClick={() => handleCheckboxChange(index)}
              aria-label={t("Set answer {{index}} as correct", {
                index: index + 1,
              })}
              role="checkbox"
              aria-checked={answer.isCorrect}
            >
              {answer.isCorrect && <BsCheck />}
            </div>
            <input
              type="text"
              name={`answer-${index}`}
              value={answer.text}
              onChange={(e) => handleInputChange(index, e)}
              placeholder={t("Answer Text")}
              className="w-full p-2 border-none focus:ring-0"
              aria-label={t("Answer {{index}} text", { index: index + 1 })}
            />
            <button
              className="absolute -top-2 -right-1 p-1 border rounded-full bg-gray-100 hover:bg-gray-200 text-red-500 hover:text-red-700 transition"
              onClick={() => handleRemoveAnswer(index)}
              aria-label={t("Remove answer {{index}}", { index: index + 1 })}
            >
              <AiOutlineMinus />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={() => setAnswers([...answers, { text: "", isCorrect: false }])}
        className="flex items-center text-green-500 hover:text-green-700 transition font-semibold mt-4"
        aria-label={t("Add answer")}
      >
        <AiOutlinePlus className="mr-2" />
        {t(answers.length === 0 ? "Add Answer" : "Add Another Answer")}
      </button>

      {/*  Right/Wrong Comment Fields  */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            name="rightAnswerComment"
            value={rightAnswerComment}
            onChange={(e) => setRightAnswerComment(e.target.value)}
            placeholder={t("Type Right Answer Comment")}
            className="w-full p-3 border border-green-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label={t("Right answer comment")}
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            name="wrongAnswerComment"
            value={wrongAnswerComment}
            onChange={(e) => setWrongAnswerComment(e.target.value)}
            placeholder={t("Type Wrong Answer Comment")}
            className="w-full p-3 border border-red-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label={t("Wrong answer comment")}
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default AnswerSection;
