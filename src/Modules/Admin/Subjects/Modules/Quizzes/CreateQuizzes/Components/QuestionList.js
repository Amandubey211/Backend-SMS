// QuestionList.jsx
import React from "react";
import QuestionCard from "./QuestionCard";
import { useTranslation } from "react-i18next";

const QuestionList = ({
  questions,
  deleteQuestion,
  editQuestion,
  allowShuffleAnswers,
}) => {
  const { t } = useTranslation("admModule");

  const totalPoints = questions?.reduce((sum, question) => {
    return sum + parseFloat(question.questionPoint);
  }, 0);

  return (
    <div className="">
      <div className="flex justify-between px-4 items-center">
        <h3 className="text-xl font-semibold mb-2">{t("All Questions:")}</h3>
        <h3>
          {t("Total Points:")} {totalPoints}
        </h3>
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
