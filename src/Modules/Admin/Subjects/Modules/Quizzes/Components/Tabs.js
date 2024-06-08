import React, { useState } from "react";
import { QuizzDetails } from "../../Assignments/AssignmentComponents/MockData";

const Tabs = ({ children,activeTab,setActiveTab, onTabChange,createPage }) => {
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  const { title, type } = QuizzDetails;

  return (
    <>
      <div className="flex justify-between items-center p-2 px-3 border-b">
        {
          !createPage && <div >
          <h2 className="text-xl font-semibold mb-1">
            {activeTab === "instructions" ? title  : "Quiz Question "}
          </h2>
          <p className="text-sm text-green-600 ">
            {activeTab === "instructions" ? type : "Quizz"}
          </p>
        </div>
        }
        

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
              Quiz Questions
            </span>
          </button>
        </div>
      </div>
      <div className="p-4">{children(activeTab)}</div>
    </>
  );
};

export default Tabs;
