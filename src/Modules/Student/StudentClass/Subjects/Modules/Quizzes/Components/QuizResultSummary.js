import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedAttempt } from "../../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Quizes/quizesSlice";
import {
  FaChevronDown,
  FaChevronUp,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaHistory,
  FaChartLine,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const QuizResultSummary = () => {
  const { attemptHistory = [] } = useSelector(
    (store) => store?.student?.studentQuiz || {}
  );

  const dispatch = useDispatch();
  const [openIndex, setOpenIndex] = useState(0);

  const formatTime = (totalSeconds) => {
    if (!totalSeconds || isNaN(totalSeconds)) return "0s";

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const hoursDisplay = hours > 0 ? `${hours}h ` : "";
    const minutesDisplay = minutes > 0 ? `${minutes}m ` : "";
    const secondsDisplay = seconds > 0 ? `${seconds}s` : "";

    return `${hoursDisplay}${minutesDisplay}${secondsDisplay}`.trim() || "0s";
  };

  const calculatePercentage = (attempt) => {
    if (!attempt?.answers?.length) return 0;
    const correct = attempt.answers.filter((a) => a.isCorrect).length;
    return Math.round((correct / attempt.answers.length) * 100);
  };

  const handleToggle = (index) => {
    setOpenIndex(index === openIndex ? -1 : index);
  };

  const handleAttemptClick = (attempt) => {
    dispatch(setSelectedAttempt(attempt));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Submitted":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          border: "border-green-300",
        };
      case "inProgress":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          border: "border-yellow-300",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          border: "border-gray-300",
        };
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <FaHistory className="mr-3 text-blue-500" />
          My Attempt History ({attemptHistory.length})
        </h2>
        {attemptHistory.length > 0 && (
          <div className="flex items-center text-sm text-gray-500">
            <FaChartLine className="mr-1" />
            <span>Performance Overview</span>
          </div>
        )}
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {attemptHistory.length > 0 ? (
          [...attemptHistory].reverse().map((attempt, index) => {
            const statusColors = getStatusColor(attempt?.submissionStatus);
            const percentage = calculatePercentage(attempt);
            const totalQuestions = attempt?.answers?.length || 0;
            const correctAnswers =
              attempt?.rightAnswer ||
              attempt?.answers?.filter((a) => a.isCorrect)?.length ||
              0;
            const wrongAnswers =
              attempt?.wrongAnswer || totalQuestions - correctAnswers;

            return (
              <div
                key={attempt?._id || index}
                className={`bg-white rounded-xl shadow-sm border ${statusColors.border} transition-all duration-200 hover:shadow-md`}
              >
                <div
                  className="flex justify-between items-center p-4 cursor-pointer"
                  onClick={() => handleToggle(index)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-50">
                        <span className="text-blue-600 font-bold">
                          {attemptHistory.length - index}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Attempt {attemptHistory.length - index}
                      </h3>
                      <div className="flex items-center space-x-3 mt-1">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${statusColors.bg} ${statusColors.text}`}
                        >
                          {attempt?.submissionStatus || "Unknown"}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <FaClock className="mr-1" />
                          {attempt?.submittedAt
                            ? new Date(attempt.submittedAt).toLocaleDateString()
                            : "In Progress"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-800">
                        {percentage}%
                      </div>
                      <div className="text-xs text-gray-500">Score</div>
                    </div>
                    {openIndex === index ? (
                      <FaChevronUp className="text-gray-400" size={16} />
                    ) : (
                      <FaChevronDown className="text-gray-400" size={16} />
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="bg-green-50 p-3 rounded-lg text-center">
                            <div className="text-green-600 font-bold flex items-center justify-center">
                              <FaCheckCircle className="mr-2" />
                              {correctAnswers}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              Correct
                            </div>
                          </div>
                          <div className="bg-red-50 p-3 rounded-lg text-center">
                            <div className="text-red-600 font-bold flex items-center justify-center">
                              <FaTimesCircle className="mr-2" />
                              {wrongAnswers}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              Wrong
                            </div>
                          </div>
                          <div className="bg-blue-50 p-3 rounded-lg text-center">
                            <div className="text-blue-600 font-bold flex items-center justify-center">
                              <FaClock className="mr-2" />
                              {formatTime(attempt?.timeTaken)}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              Time Taken
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <button
                            onClick={() => handleAttemptClick(attempt)}
                            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                          >
                            View Details
                          </button>
                          <div className="text-xs text-gray-500">
                            Submitted:{" "}
                            {new Date(attempt?.submittedAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-xl border border-gray-200"
          >
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center">
                <FaClock className="text-blue-400 text-3xl" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-center">
              No Attempt History Found
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              You haven't completed any quizzes yet. Start one now to track your
              progress and see detailed results here!
            </p>
            <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
              Start a Quiz
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default React.memo(QuizResultSummary);
