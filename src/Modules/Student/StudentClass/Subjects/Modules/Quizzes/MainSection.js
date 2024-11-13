import React, { useState, useEffect, useCallback, useRef } from "react";
import SubjectSideBar from "../../Component/SubjectSideBar";
import Tabs from "./Components/Tabs";
import QuizQuestions from "./Components/QuizQuestions";
import QuizInstructionSection from "./Components/QuizInstructionSection";
import QuizzDetailCard from "./Components/QuizzDetailCard";
import QuestionDetailCard from "./Components/QuestionDetailCard";
import QuizResultSummary from "./Components/QuizResultSummary";
import { useDispatch, useSelector } from "react-redux";
import {
  setAttemptHistory,
  setQuizResults,
  setTimeLeft,
  setTotalTime,
} from "../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Quizes/quizesSlice";
import {
  startQuiz,
  submitQuiz,
  fetchAllAttemptHistory,
} from "../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Quizes/quizes.action";
import { useParams } from "react-router-dom";

const MainSection = () => {
  const {
    itemDetails,
    activeTab,
    selectedOptions,
    attemptHistory,
    timeLeft,
    totalTime,
  } = useSelector((store) => store?.student?.studentQuiz);

  const { qid: quizId } = useParams();
  const dispatch = useDispatch();

  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [suspiciousActivityDetected, setSuspiciousActivityDetected] =
    useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [violationModalVisible, setViolationModalVisible] = useState(false);

  const timerRef = useRef(null);

  // Enable fullscreen
  const enableFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable fullscreen mode:", err);
      });
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  };

  // Exit fullscreen
  const disableFullScreen = () => {
    if (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    ) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => {
          console.error("Error attempting to exit fullscreen mode:", err);
        });
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  // Submit quiz logic
  const handleSubmit = useCallback(async () => {
    try {
      clearInterval(timerRef.current);
      setQuizStarted(false);
      disableFullScreen(); // Exit fullscreen after submission

      const questionsWithSelectedOptions = itemDetails?.questions?.map(
        (question, index) => {
          const selectedOption = selectedOptions[index];
          const isCorrect =
            selectedOption && selectedOption === question.correctAnswer;

          return {
            questionId: question._id,
            selectedOption,
            isCorrect,
          };
        }
      );

      const timeTakenInMinutes = (totalTime - timeLeft) / 60; // Convert time taken to minutes
      const response = await dispatch(
        submitQuiz({
          quizId,
          answers: questionsWithSelectedOptions,
          timeTaken: timeTakenInMinutes,
          attemptHistory,
        })
      ).unwrap();

      dispatch(setAttemptHistory([...attemptHistory, response.newAttempt]));
      dispatch(
        setQuizResults({
          totalPoints: response.totalPoints,
          correctAnswers: response.correctAnswers,
          wrongAnswers: response.wrongAnswers,
        })
      );
      setQuizSubmitted(true);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to submit quiz:", error);
      setErrorModalVisible(true);
    }
  }, [
    dispatch,
    itemDetails?.questions,
    selectedOptions,
    totalTime,
    timeLeft,
    quizId,
    attemptHistory,
  ]);

  // Start quiz logic
  const handleStartQuiz = useCallback(async () => {
    try {
      enableFullScreen(); // Enable fullscreen mode
      const response = await dispatch(startQuiz({ quizId })).unwrap();

      setQuizStarted(true);
      dispatch(
        setTimeLeft(response?.remainingTime * 60 || itemDetails.timeLimit * 60)
      );
      dispatch(setTotalTime(itemDetails.timeLimit * 60));
      setQuizSubmitted(false);
      setShowInstructions(false);
      setIsModalOpen(true);

      timerRef.current = setInterval(() => {
        dispatch((dispatch, getState) => {
          const { timeLeft } = getState().student.studentQuiz;
          if (timeLeft <= 1) {
            clearInterval(timerRef.current);
            handleSubmit();
            return;
          }
          dispatch(setTimeLeft(timeLeft - 1));
        });
      }, 1000);
    } catch (error) {
      console.error("Failed to start quiz:", error);
      setErrorModalVisible(true);
    }
  }, [dispatch, quizId, itemDetails.timeLimit, handleSubmit]);

  const hasRemainingAttempts = useCallback(() => {
    if (itemDetails?.allowNumberOfAttempts === null) return true; // Unlimited attempts
    return attemptHistory?.length < itemDetails?.allowNumberOfAttempts;
  }, [itemDetails?.allowNumberOfAttempts, attemptHistory]);

  const handleOkClick = useCallback(() => {
    setViolationModalVisible(false);
  }, []);

  // Cleanup on component unmount
  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  // Handle suspicious activity detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setSuspiciousActivityDetected(true);
      }
    };

    const handleFocusLoss = () => {
      setSuspiciousActivityDetected(true);
    };

    const disableShortcuts = (e) => {
      if (
        (e.ctrlKey && e.key === "c") || // Ctrl+C
        (e.ctrlKey && e.key === "v") || // Ctrl+V
        (e.altKey && e.key === "Tab") || // Alt+Tab
        e.key === "F12" || // Developer Tools
        e.key === "Escape" // Exit fullscreen
      ) {
        e.preventDefault();
        setSuspiciousActivityDetected(true);
      }
    };

    const disableRightClick = (e) => {
      e.preventDefault();
      setSuspiciousActivityDetected(true);
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleFocusLoss);
    window.addEventListener("keydown", disableShortcuts);
    window.addEventListener("contextmenu", disableRightClick);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleFocusLoss);
      window.removeEventListener("keydown", disableShortcuts);
      window.removeEventListener("contextmenu", disableRightClick);
    };
  }, []);

  useEffect(() => {
    if (suspiciousActivityDetected) {
      setViolationCount((prev) => prev + 1);
      setViolationModalVisible(true);
      setSuspiciousActivityDetected(false); // Reset to avoid repeated increments

      if (violationCount + 1 >= 3) {
        setViolationModalVisible(false);
        setErrorModalVisible(true);
        handleSubmit();
      }
    }
  }, [suspiciousActivityDetected, violationCount, handleSubmit]);

  // Fetch attempt history
  useEffect(() => {
    dispatch(fetchAllAttemptHistory({ quizId }));
  }, [dispatch, quizId]);

  return (
    <div className="flex">
      <SubjectSideBar />

      <div className="w-[65%] border-x">
        <Tabs
          quizSubmitted={quizSubmitted}
          hasAttempted={attemptHistory?.length > 0}
          hasRemainingAttempts={hasRemainingAttempts()}
          attemptHistory={attemptHistory}
        >
          {(activeTab) => (
            <div className="h-full">
              {activeTab === "instructions" && <QuizInstructionSection />}
              {activeTab === "questions" && (
                <div>
                  {!quizStarted && showInstructions && (
                    <div className="my-4 p-4 bg-gray-100 border border-gray-300 rounded">
                      <p className="text-gray-600 mt-2">
                        You are about to start the quiz. Once you click the{" "}
                        <strong>"Start Quiz"</strong> button, the timer will
                        begin, and you'll need to answer all the questions
                        within the given time limit. If you close the quiz or
                        run out of time, your answers will be automatically
                        submitted. If you've already completed the quiz, you may
                        have the chance to <strong>restart</strong> if more
                        attempts are allowed.
                      </p>
                      <p className="mt-2 text-red-600 font-semibold">
                        Make sure you're ready before starting!
                      </p>
                    </div>
                  )}
                  {!quizStarted && (
                    <button
                      onClick={handleStartQuiz}
                      className="mt-4 px-4 py-2 text-white font-medium rounded-md shadow-sm bg-gradient-to-r from-pink-500 to-pink-700 hover:to-pink-900 focus:outline-none"
                    >
                      {quizSubmitted && hasRemainingAttempts()
                        ? "Restart Quiz"
                        : "Start Quiz"}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </Tabs>
      </div>

      {isModalOpen && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
            violationModalVisible && "border-4 border-red-600"
          }`}
        >
          <div className="bg-white w-full h-full flex">
            <div className="w-[75%] p-4 overflow-y-auto">
              <QuizQuestions handleSubmit={handleSubmit} />
            </div>
            <div className="w-[25%] border-l p-4">
              <QuestionDetailCard />
            </div>
            {violationModalVisible && (
              <div
                className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
                  violationModalVisible ? "animate-pulse" : ""
                }`}
              >
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-lg font-semibold text-red-600">
                    Suspicious Activity Detected!
                  </h3>
                  <p className="mt-2 text-gray-700">
                    Switching tabs or attempting suspicious actions is not
                    allowed. Please focus on completing the quiz.
                  </p>
                  <button
                    onClick={handleOkClick}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 focus:outline-none"
                  >
                    OK
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Modal */}
      {errorModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-red-600">
              Error Occurred
            </h3>
            <p className="mt-2 text-gray-700">
              An error occurred while submitting your quiz. Please try again.
            </p>
            <button
              onClick={() => setErrorModalVisible(false)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="w-[30%]">
        {activeTab === "instructions" && (
          <div>
            <QuizzDetailCard />
            <QuizResultSummary />
          </div>
        )}
        {activeTab === "questions" && !quizSubmitted && (
          <div>
            <QuestionDetailCard />
            <QuizResultSummary />
          </div>
        )}

        {activeTab === "questions" && quizSubmitted && !quizStarted && (
          <QuizResultSummary />
        )}
      </div>
    </div>
  );
};

export default MainSection;
