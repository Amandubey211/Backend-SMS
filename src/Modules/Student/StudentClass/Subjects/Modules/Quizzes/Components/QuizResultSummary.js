import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedAttempt } from "../../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Quizes/quizesSlice";
import {
  FaChevronDown,
  FaChevronUp,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const QuizResultSummary = () => {
  const { attemptHistory } = useSelector(
    (store) => store?.student?.studentQuiz
  );
  const dispatch = useDispatch();
  const [openIndex, setOpenIndex] = useState(0); // Keeps track of the currently opened accordion

  const formatTime = (totalSeconds) => {
    if (!totalSeconds || totalSeconds <= 0) return "0s";
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const hoursDisplay = hours > 0 ? `${hours}h ` : "";
    const minutesDisplay = minutes > 0 ? `${minutes}m ` : "";
    const secondsDisplay = seconds > 0 ? `${seconds}s` : "";

    return `${hoursDisplay}${minutesDisplay}${secondsDisplay}`.trim();
  };

  const handleToggle = (index) => {
    setOpenIndex(index === openIndex ? -1 : index); // Toggle accordion
  };

  const handleAttemptClick = (attempt) => {
    dispatch(setSelectedAttempt(attempt));
  };

  return (
    <>
      <h2 className="text-lg font-semibold p-3">
        My Attempt History ({attemptHistory?.length || 0})
      </h2>

      <div className="p-4 space-y-2 h-80 no-scrollbar overflow-y-scroll  ">
        {/* Component Heading */}

        {Array.isArray(attemptHistory) && attemptHistory?.length > 0 ? (
          attemptHistory
            ?.slice()
            .reverse()
            ?.map((attempt, index) => (
              <div
                key={attempt?._id || index}
                className="bg-white shadow-md rounded-lg overflow-hidden transition-shadow duration-300"
              >
                {/* Accordion Header */}
                <div
                  className="flex justify-between items-center p-1 px-4 cursor-pointer bg-gray-50 hover:bg-gray-200"
                  onClick={() => handleToggle(index)}
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gradient">
                      Attempt {attemptHistory?.length - index}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {attempt?.submittedAt
                        ? new Date(attempt?.submittedAt).toLocaleString()
                        : "In Progress"}
                    </p>
                  </div>
                  <div>
                    {openIndex === index ? (
                      <FaChevronUp className="text-gray-600" size={20} />
                    ) : (
                      <FaChevronDown className="text-gray-600" size={20} />
                    )}
                  </div>
                </div>

                {/* Accordion Content with Framer Motion */}
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-4"
                    >
                      {/* Stats Section */}
                      {/* <div className="grid grid-cols-3 text-center divide-x">
                      <div>
                        <p className="text-gray-500 text-sm">Correct</p>
                        <p className="text-green-500 font-bold flex items-center justify-center">
                          <FaCheckCircle className="inline mr-1" />
                          <span>{attempt?.rightAnswer ?? "N/A"}</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Wrong</p>
                        <p className="text-red-500 font-bold flex items-center justify-center">
                          <FaTimesCircle className="inline mr-1" />
                          <span>{attempt?.wrongAnswer ?? "N/A"}</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Time</p>
                        <p className="text-blue-500 font-bold flex justify-center items-center">
                          <FaClock className="inline mr-1" />
                          <span>
                            {attempt?.timeTaken
                              ? formatTime(attempt?.timeTaken)
                              : "N/A"}
                          </span>
                        </p>
                      </div>
                    </div> */}

                      {/* Status Section */}
                      <div className="text-center mt-4">
                        <span
                          className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                            attempt?.submissionStatus === "Submitted"
                              ? "bg-green-100 text-green-600"
                              : attempt?.submissionStatus === "inProgress"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {attempt?.submissionStatus || "Unknown"}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
        ) : (
          <div className="flex flex-col items-center justify-center mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-md">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-blue-400"
            >
              <FaClock size={60} />
            </motion.div>
            <h3 className="text-lg font-semibold text-gray-700 mt-4">
              No Attempt History Found
            </h3>
            <p className="text-gray-500 text-sm mt-2">
              You haven’t completed any quizzes yet. Start one now to see your
              progress here!
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default React.memo(QuizResultSummary);
