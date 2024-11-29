import React from "react";
import QuestionList from "./QuestionList";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const QuestionListView = ({
  handleSidebarOpen,
  deleteQuestion,
  editQuestion,
  allowShuffleAnswers,
}) => {
  const { t } = useTranslation('admModule');

  // Safely access `questions` from `quizzDetail`, defaulting to an empty array if null/undefined
  const questionState = useSelector(
    (store) => store.admin.quizzes.quizzDetail?.questions || []
  );

  return (
    <>
      {/* Pass the safe `questionState` to QuestionList */}
      <QuestionList
        questions={questionState}
        deleteQuestion={deleteQuestion}
        allowShuffleAnswers={allowShuffleAnswers}
        editQuestion={editQuestion}
      />

      {/* Show a message and button if no questions exist */}
      {questionState?.length === 0 && (
        <div className="w-full h-80 flex justify-center items-center">
          <div>
            <button
              onClick={handleSidebarOpen}
              className="flex items-center border border-gray-300 ps-5 py-0 rounded-full"
            >
              <span className="mr-2">{t("Add new Question")}</span>
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-12 h-12 flex items-center justify-center">
                <span className="text-3xl -mt-2">+</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default QuestionListView;
