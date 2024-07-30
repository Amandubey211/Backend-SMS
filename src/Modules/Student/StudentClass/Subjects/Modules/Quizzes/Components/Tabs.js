import React from "react";
import { format } from 'date-fns';
const Tabs = ({
  quiz,
  children,
  activeTab,
  setActiveTab,
  onTabChange,
  createPage,
  quizSubmitted,
  hasAttempted,
}) => {
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  const { name } = quiz;

  const getButtonText = () => {
    if (activeTab === "instructions") {
      return hasAttempted ? "Retake Quiz" : "Take The Quiz";
    }
    return "Quiz Instructions";
  };
  const formattedDate = format(new Date(quiz.availableFrom), "dd/MM/yyyy");

  return (
    <>
      <div className="flex justify-between items-center p-4 border-b bg-white">
        {!createPage && (
          <div>
            <h2 className="text-lg font-semibold mb-1 capitalize">{name}</h2>
            <div className="flex items-center text-gray-500">
              <span className="text-green-600 font-medium mr-2">Quiz</span>
              <span className="text-sm">
                {activeTab === "questions" && `Started: ${formattedDate}`}
              </span>
            </div>
          </div>
        )}
        <div className="flex gap-2">
          <button
            onClick={() =>
              handleTabClick(
                activeTab === "instructions" ? "questions" : "instructions"
              )
            }
            className={`flex-grow ${
              activeTab === "instructions"
                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                : "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
            } rounded-md py-2 px-4 text-center transition`}
          >
            <span>{getButtonText()}</span>
          </button>
        </div>
      </div>
      <div className="p-4">{children(activeTab)}</div>
    </>
  );
};

export default Tabs;
