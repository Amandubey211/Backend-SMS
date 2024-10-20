import React, { useState, useEffect, useCallback, useRef } from "react";
import SubjectSideBar from "../../Component/SubjectSideBar";
import Tabs from "./Components/Tabs";
import QuizQuestions from "./Components/QuizQuestions";
import QuizResults from "./Components/QuizResults";
import QuizResultSummary from "./Components/QuizResultSummary";
import QuizInstructionSection from "./Components/QuizInstructionSection";
import QuizzDetailCard from "./Components/QuizzDetailCard";
import QuestionDetailCard from "./Components/QuestionDetailCard";
import useFetchAttemptHistory from "../../../../../../Hooks/StudentHooks/Quiz/useFetchAttemptHistory";
import useSubmitQuiz from "../../../../../../Hooks/StudentHooks/Quiz/useSubmitQuiz";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { setAttemptHistory, setQuizResults } from "../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Quizes/quizesSlice";
import { submitQuiz } from "../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Quizes/quizes.action";

const MainSection = () => {
  const { itemDetails, activeTab, selectedOptions, quizResults, attemptHistory } = useSelector((store) => store?.student?.studentQuiz);
  const quizId = itemDetails?._id;

  const dispatch = useDispatch();

  const [totalTime, setTotalTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const timerRef = useRef(null); // Store the timer reference

  const { timeLimit, allowNumberOfAttempts, showOneQuestionOnly } = itemDetails;
  const quizDuration = timeLimit * 60;

  // Timer logic on quiz start or restart
  const handleStartQuiz = () => {
    setQuizStarted(true);
    setTimeLeft(quizDuration);
    setTotalTime(quizDuration);
    setQuizSubmitted(false);
    setShowInstructions(false); // Hide instructions when quiz starts

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current); // Clear the timer when it hits 0
          setQuizStarted(false);
          handleSubmit(); // Automatically submit the quiz when time runs out
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  // Handle quiz submission
  const handleSubmit = useCallback(async () => {
    try {
      let totalPoints = 0;
      let correctAnswers = 0;
      let wrongAnswers = 0;
      setQuizStarted(false);
      clearInterval(timerRef.current); // Clear the timer on submission

      const questionsWithSelectedOptions = itemDetails?.questions?.map((question, index) => {
        const selectedOption = selectedOptions[index];
        const isCorrect = selectedOption && selectedOption === question.correctAnswer;

        if (selectedOption) {
          if (isCorrect) {
            correctAnswers += 1;
            totalPoints += question?.questionPoint;
          } else {
            wrongAnswers += 1;
          }
        }

        return { questionId: question._id, selectedOption, isCorrect };
      });

      const newAttempt = dispatch(submitQuiz({
        quizId,
        answers: questionsWithSelectedOptions,
        timeTaken: totalTime - timeLeft,
        attemptHistory
      }));

      if (newAttempt) {
        dispatch(setAttemptHistory((prev) => [...prev, newAttempt]));
        setQuizSubmitted(true);
        dispatch(setQuizResults({ totalPoints, correctAnswers, wrongAnswers }));
      }

      setQuizStarted(false); // Stop the quiz after submission
    } catch (error) {
      console.error("Quiz submission failed:", error);
      alert("An error occurred while submitting your quiz. Please try again.");
    }
  }, [selectedOptions, totalTime, timeLeft, itemDetails?.questions, dispatch, attemptHistory]);

  // Logic for checking remaining attempts
  const hasRemainingAttempts = () => {
    if (allowNumberOfAttempts === null) return true; // Unlimited attempts
    return attemptHistory?.length < allowNumberOfAttempts;
  };

  // Clear the timer when the component unmounts
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current); // Clear the timer if the component unmounts
    };
  }, []);

  return (
    <div className="flex">
      <SubjectSideBar />

      <div className="w-[65%] border-x">
        <Tabs
          quizSubmitted={quizSubmitted}
          hasAttempted={attemptHistory?.length > 0}
          quiz={itemDetails}
          hasRemainingAttempts={hasRemainingAttempts()}
          attemptHistory={attemptHistory}
        >
          {(activeTab) => (
            <div className="h-full">
              {activeTab === "instructions" && <QuizInstructionSection />}
              {activeTab === "questions" && (
                <>
                  {/* Show instructions before the quiz starts */}
                  {!quizStarted && showInstructions && (
                    <div className="my-4 p-4 bg-gray-100 border border-gray-300 rounded">
                      <p className="text-gray-600 mt-2">
                        You are about to start the quiz. Once you click the <strong>"Start Quiz"</strong> button, the timer will begin, and you'll need to answer all the questions within the given time limit. If you close the quiz or run out of time, your answers will be automatically submitted. If you've already completed the quiz, you may have the chance to <strong>restart</strong> if more attempts are allowed.
                      </p>
                      <p className="mt-2 text-red-600 font-semibold">
                        Make sure you're ready before starting!
                      </p>
                    </div>
                  )}

                  {/* Show "Start Quiz" if not started or "Restart Quiz" if submitted and attempts remaining */}
                  {!quizStarted && (
                    <button
                      onClick={handleStartQuiz}
                      className="mt-4 px-4 py-2 text-white font-medium rounded-md shadow-sm bg-gradient-to-r from-pink-500 to-pink-700  hover:to-pink-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      {quizSubmitted && hasRemainingAttempts() ? "Restart Quiz" : "Start Quiz"}
                    </button>
                  )}

                  {/* Display Quiz Questions if the quiz has started and not submitted */}
                  {!quizSubmitted && quizStarted && (
                    <QuizQuestions
                      showOneQuestionOnly={showOneQuestionOnly}
                      handleSubmit={handleSubmit}
                      hasRemainingAttempts={hasRemainingAttempts()}
                    />
                  )}

                  {/* Display results if the quiz is submitted */}
                  {quizSubmitted && !quizStarted && (
                    <QuizResults hasRemainingAttempts={hasRemainingAttempts()} />
                  )}
                </>
              )}
            </div>
          )}
        </Tabs>
      </div>

      <div className="w-[30%]">
        {activeTab === "instructions" && <QuizzDetailCard quiz={itemDetails} />}
        {activeTab === "questions" && !quizSubmitted && (
          <QuestionDetailCard
            timeLeft={timeLeft}
            totalTime={totalTime}
            quiz={itemDetails}
            numberOfQuestions={itemDetails?.questions?.length}
          />
        )}
        {activeTab === "questions" && quizSubmitted && !quizStarted && (
          <QuizResultSummary
            totalPoints={quizResults?.totalPoints}
            correctAnswers={quizResults?.correctAnswers}
            wrongAnswers={quizResults?.wrongAnswers}
            attemptHistory={attemptHistory}
            quizId={quizId}
          />
        )}
      </div>
    </div>
  );
};

export default MainSection;
