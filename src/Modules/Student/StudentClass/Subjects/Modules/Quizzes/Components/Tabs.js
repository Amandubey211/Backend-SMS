/* src/Modules/Student/StudentClass/Subjects/Quizzes/Components/Tabs.jsx */
import React, { useEffect, useRef } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { stdGetSingleQuiz } from "../../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Quizes/quizes.action";
import { setActiveTab } from "../../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Quizes/quizesSlice";

const Tabs = ({ children, createPage }) => {
  const { qid } = useParams();
  const dispatch = useDispatch();

  const {
    loading,
    activeTab,
    itemDetails: quiz,
    attemptHistory,
  } = useSelector((s) => s.student.studentQuiz);

  /* ------------------------------------------------- */
  /*     derive quiz-state helpers on every render      */
  /* ------------------------------------------------- */
  const { name, quizType, availableFrom, dueDate, allowNumberOfAttempts } =
    quiz || {};

  const now = new Date();
  const hasRemainingAttempts =
    allowNumberOfAttempts === null ||
    (attemptHistory?.length || 0) < allowNumberOfAttempts;

  const isQuizAvailable = dueDate && new Date(dueDate) > now;
  const showTakeQuizTab = isQuizAvailable && hasRemainingAttempts;

  /* ------------------------------------------------- */
  /*         auto-switch tab when circumstances change  */
  /* ------------------------------------------------- */
  const prevAttempts = useRef(attemptHistory?.length || 0);

  useEffect(() => {
    /* 1. fetch quiz meta on mount / qid change */
    dispatch(stdGetSingleQuiz({ quizId: qid }));
  }, [dispatch, qid]);

  useEffect(() => {
    /* 2. move user back to “instructions” after a new submission */
    const current = attemptHistory?.length || 0;
    if (current > prevAttempts.current) {
      dispatch(setActiveTab("instructions"));
    }
    prevAttempts.current = current;
  }, [attemptHistory, dispatch]);

  useEffect(() => {
    /* 3. if Take-Quiz tab disappears (expired or limit hit) while active, reset */
    if (!showTakeQuizTab && activeTab === "questions") {
      dispatch(setActiveTab("instructions"));
    }
  }, [showTakeQuizTab, activeTab, dispatch]);

  /* ------------------------------------------------- */
  /*                    render UI                       */
  /* ------------------------------------------------- */
  const buttonBase =
    "flex-grow rounded-md py-2 px-4 text-center transition border border-gray-300";
  const grad =
    "bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200";

  return (
    <>
      <div className="flex justify-between items-center p-2 px-3 border-b">
        {!createPage && (
          <div>
            <h2 className="text-xl font-semibold mb-1">{name}</h2>
            <div className="flex items-center text-gray-500">
              <span className="text-green-600 font-medium mr-2">
                {quizType}
              </span>
              <span className="mx-2">|</span>
              <FaCalendarAlt className="w-4 h-4 mr-2" />
              <span className="text-sm">
                Available From: {availableFrom?.slice(0, 10)}
              </span>
            </div>
          </div>
        )}

        <div className="flex gap-2 bg-white">
          {/* Instructions tab */}
          <button
            onClick={() => dispatch(setActiveTab("instructions"))}
            className={`${buttonBase} ${
              activeTab === "instructions" ? grad : "text-gray-800"
            }`}
          >
            <span
              className={
                activeTab === "instructions" ? "text-gradient" : "text-black"
              }
            >
              Quiz Instructions
            </span>
          </button>

          {/* Take-Quiz tab (conditionally rendered) */}
          {showTakeQuizTab && (
            <button
              onClick={() => dispatch(setActiveTab("questions"))}
              className={`${buttonBase} ${
                activeTab === "questions" ? grad : "text-gray-800"
              }`}
            >
              <span
                className={
                  activeTab === "questions" ? "text-gradient" : "text-black"
                }
              >
                Take Quiz
              </span>
            </button>
          )}
        </div>
      </div>

      {/* children is a render-prop: children(currentActiveTab) */}
      <div className="p-4">{!loading && children(activeTab)}</div>
    </>
  );
};

export default Tabs;
