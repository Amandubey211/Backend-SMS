import React from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Tooltip, Tag } from "antd"; // Import antd components
import ProtectedAction from "../../../../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../../../../config/permission";

const Tabs = ({
  children,
  activeTab,
  setActiveTab,
  onTabChange,
  createPage,
  handleSidebarOpen,
}) => {
  const handleTabClick = (tab) => {
    if (tab === "questions" && !hasQuizId) return; // ignore clicks
    setActiveTab(tab);
    onTabChange(tab);
  };

  const { quizzDetail } = useSelector((store) => store.admin.quizzes);
  const { name, availableFrom, publish } = quizzDetail || {};
  const hasQuizId = !!quizzDetail?._id; // <─ NEW
  // Determine the display date: format if present, else use a placeholder "DD-MM-YY"
  const displayDate = availableFrom
    ? new Date(availableFrom).toLocaleDateString()
    : "DD-MM-YY";

  return (
    <>
      <div className="flex justify-between items-center p-2 px-3 border-b">
        {/* Quiz Title and Publish Badge */}
        {!createPage && (
          <div>
            <div className="flex items-center mb-1">
              <h2 className="text-xl font-semibold">{name || "Quiz Name"}</h2>

              {/* Show Published/Unpublished Badge */}
              {typeof publish === "boolean" && (
                <div className="ml-2">
                  <Tooltip
                    title={`This quiz is ${
                      publish ? "published" : "unpublished"
                    }`}
                  >
                    <Tag color={publish ? "green" : "red"}>
                      {publish ? "Published" : "Unpublished"}
                    </Tag>
                  </Tooltip>
                </div>
              )}
            </div>

            <div className="flex items-center text-gray-500">
              <span className="text-green-600 font-medium mr-2">Quiz</span>
              <span className="mx-2">|</span>
              <FaCalendarAlt className="w-4 h-4 mr-2" />
              <span className="text-sm">Available From: {displayDate}</span>
            </div>
          </div>
        )}

        {/* Tab Buttons */}
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
          {hasQuizId && (
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
          )}
        </div>

        {/* Add Question Button (Protected) */}
        {activeTab === "questions" && createPage && hasQuizId && (
          <ProtectedAction
            requiredPermission={PERMISSIONS.ADD_QUESTION_TO_QUIZ}
          >
            <button
              onClick={handleSidebarOpen}
              className="flex items-center border border-gray-300 ps-5 rounded-full"
            >
              <span className="mr-2">Add new Question</span>
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
                <span className="text-3xl -mt-2">+</span>
              </div>
            </button>
          </ProtectedAction>
        )}
      </div>

      {/* Tab Content */}
      <div className="p-4">{children(activeTab)}</div>
    </>
  );
};

export default Tabs;
