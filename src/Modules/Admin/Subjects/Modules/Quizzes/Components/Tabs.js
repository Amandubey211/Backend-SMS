import React from "react";
import { FaCalendarAlt } from "react-icons/fa";

const Tabs = ({
  children,
  activeTab,
  setActiveTab,
  onTabChange,
  createPage,
  handleSidebarOpen,
  title,
  availableFrom,
}) => {
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <>
      <div className="flex justify-between items-center p-2 px-3 border-b">
        {!createPage && (
          <div>
            <h2 className="text-xl font-semibold mb-1">{title}</h2>
            <div className="flex items-center text-gray-500">
              <span className="text-green-600 font-medium mr-2">Quiz</span>
              <span className="mx-2">|</span>
              <FaCalendarAlt className="w-4 h-4 mr-2" />
              <span className="text-sm">Available From: {new Date(availableFrom).toLocaleDateString()}</span>
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
              Quiz Questions
            </span>
          </button>
        </div>
        {activeTab === "questions" && createPage && (
          <button
            onClick={handleSidebarOpen}
            className="flex items-center border border-gray-300 ps-5  rounded-full"
          >
            <span className="mr-2">Add new Question</span>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
              <span className="text-3xl -mt-2">+</span>
            </div>
          </button>
        )}
      </div>
      <div className="p-4">{children(activeTab)}</div>
    </>
  );
};

export default Tabs;
