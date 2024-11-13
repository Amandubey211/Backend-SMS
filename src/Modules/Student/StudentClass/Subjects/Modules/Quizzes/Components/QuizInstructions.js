import React from "react";
import { FaExclamationTriangle, FaClock, FaRedo, FaBan } from "react-icons/fa"; // React Icons for modern visuals
import {
  MdCheckBoxOutlineBlank,
  MdCheckBox,
  MdErrorOutline,
} from "react-icons/md"; // Icons for the acknowledgment checkbox and placeholder
import { motion } from "framer-motion"; // For smooth animations
import { useSelector } from "react-redux";

const QuizInstructions = ({ onAcknowledge, acknowledged, handleStartQuiz }) => {
  const { itemDetails: quiz } = useSelector(
    (store) => store?.student?.studentQuiz
  );
  const questionLength = quiz?.questions?.length;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-md"
    >
      {questionLength === 0 ? (
        <motion.div
          className="flex flex-col items-center justify-center p-10 bg-white  rounded-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <MdErrorOutline className="text-gray-400 text-6xl mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">
            No Questions Available
          </h3>
          <p className="text-gray-500 text-sm">
            This quiz has no questions added yet. Please check back later.
          </p>
        </motion.div>
      ) : (
        <>
          {/* Header */}
          <motion.div
            className="flex items-center mb-6"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
          >
            <FaExclamationTriangle className="text-yellow-600 text-4xl mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">
              Important Instructions
            </h2>
          </motion.div>

          {/* Instruction List */}
          <motion.ul
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.li
              className="flex items-start"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FaClock className="text-blue-500 text-4xl mr-4 mt-1" />
              <p className="text-gray-600 text-lg leading-7">
                Once you click the{" "}
                <strong className="text-gray-800">"Start Quiz"</strong> button,
                the timer will begin. You need to answer all questions within
                the given time limit.
              </p>
            </motion.li>
            <motion.li
              className="flex items-start"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FaRedo className="text-green-500 text-4xl mr-4 mt-1" />
              <p className="text-gray-600 text-lg leading-7">
                If you've already completed the quiz, you may have the chance to{" "}
                <strong className="text-gray-800">restart</strong> if more
                attempts are allowed.
              </p>
            </motion.li>
            <motion.li
              className="flex items-start"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FaBan className="text-red-500 text-5xl mr-4 mt-1" />
              <p className="text-gray-600 text-lg leading-7">
                Misbehavior, such as switching tabs, resizing the screen, or
                unauthorized actions, may result in automatic submission of your
                answers and could affect your exam eligibility.
              </p>
            </motion.li>
            <motion.li
              className="flex items-start"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FaExclamationTriangle className="text-yellow-500 text-4xl mr-4 mt-1" />
              <p className="text-gray-600 text-lg leading-7">
                Ensure that you have a stable internet connection and avoid any
                suspicious activities during the quiz.
              </p>
            </motion.li>
          </motion.ul>

          {/* Warning */}
          <motion.div
            className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <p className="text-red-600 font-medium text-lg leading-6">
              Please focus on completing the quiz. Any violation of rules will
              be recorded and could result in penalties.
            </p>
          </motion.div>

          {/* Acknowledgment Checkbox */}
          <motion.div
            className="flex items-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <button
              className="flex items-center"
              onClick={onAcknowledge}
              aria-pressed={acknowledged}
              role="button"
            >
              {acknowledged ? (
                <MdCheckBox className="text-green-500 text-4xl" />
              ) : (
                <MdCheckBoxOutlineBlank className="text-gray-400 text-4xl" />
              )}
            </button>
            <p className="ml-4 text-gray-600 text-lg">
              I have read and understood the instructions. I agree to follow the
              guidelines during the quiz.
            </p>
          </motion.div>

          {/* Start Quiz Button */}
          <motion.div
            className="mt-8 text-right"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <button
              onClick={handleStartQuiz}
              disabled={!acknowledged} // Disable button until acknowledged
              className={`px-6 py-3 font-semibold text-lg rounded-md shadow-md focus:outline-none ${
                acknowledged
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-300 cursor-not-allowed text-gray-600"
              }`}
            >
              Start Quiz
            </button>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default QuizInstructions;
