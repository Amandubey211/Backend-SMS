import React from "react";
import { FaCalendarAlt } from "react-icons/fa";

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

  return (
    <>
      <div className="flex justify-between items-center p-2 px-8 border-b">
        {!createPage && (
          <div>
            <h2 className="text-lg font-semibold mb-1 capitalize ">{name}</h2>
            <div className="flex items-center text-gray-500">
              <span className="text-green-600 font-medium mr-2">quiz</span>
            </div>
          </div>
        )}
        <div className="flex gap-2 bg-white">
          <button
            onClick={() => handleTabClick("instructions")}
            className={`flex-grow ${
              activeTab === "instructions"
                ? "bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200"
                : "border border-gray-300 text-gray-800"
            } rounded-md py-2 px-4 text-center transition`}
          >
            <span
              className={`${
                activeTab === "instructions" ? "text-gradient" : "text-black"
              }`}
            >
              Quiz Instructions
            </span>
          </button>

          <button
            onClick={() => handleTabClick("questions")}
            className={`flex-grow ${
              activeTab === "questions"
                ? "bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200"
                : "border border-gray-300 text-gray-800"
            } rounded-md py-2 px-4 text-center transition`}
          >
            <span
              className={`${
                activeTab === "questions" ? "text-gradient" : "text-black"
              }`}
            >
              {quizSubmitted || hasAttempted ? "Retake Quiz" : "Take the Quiz"}
            </span>
          </button>
        </div>
      </div>
      <div className="p-4">{children(activeTab)}</div>
    </>
  );
};

export default Tabs;
