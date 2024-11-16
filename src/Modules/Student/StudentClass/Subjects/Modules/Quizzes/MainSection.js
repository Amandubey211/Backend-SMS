import React, { useState, useEffect, useCallback, useRef } from "react";
import SubjectSideBar from "../../Component/SubjectSideBar";
import Tabs from "./Components/Tabs";
import QuizQuestions from "./Components/QuizQuestions";
import QuizInstructionSection from "./Components/QuizInstructionSection";
import QuizzDetailCard from "./Components/QuizzDetailCard";
import QuestionDetailCard from "./Components/QuestionDetailCard";
import QuizResultSummary from "./Components/QuizResultSummary";
import { useDispatch, useSelector } from "react-redux";
import { MdErrorOutline } from "react-icons/md"; // React Icon for Placeholder

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
import QuizInstructions from "./Components/QuizInstructions";

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
  const [resizeModalVisible, setResizeModalVisible] = useState(false);
  const [initialWindowWidth, setInitialWindowWidth] = useState(null);
  const [initialWindowHeight, setInitialWindowHeight] = useState(null);
  const [acknowledged, setAcknowledged] = useState(false);
  const [submissionModalVisible, setSubmissionModalVisible] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);

  const timerRef = useRef(null);

  // Enable fullscreen and wait for it to be activated
  const enableFullScreen = () => {
    const elem = document.documentElement;
    const requestFullScreen =
      elem.requestFullscreen ||
      elem.mozRequestFullScreen ||
      elem.webkitRequestFullscreen ||
      elem.msRequestFullscreen;

    if (requestFullScreen) {
      requestFullScreen.call(elem).catch((err) => {
        console.error("Error attempting to enable fullscreen mode:", err);
      });
    }
  };

  // Exit fullscreen
  const disableFullScreen = () => {
    const exitFullScreen =
      document.exitFullscreen ||
      document.mozCancelFullScreen ||
      document.webkitExitFullscreen ||
      document.msExitFullscreen;

    if (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    ) {
      exitFullScreen.call(document).catch((err) => {
        console.error("Error attempting to exit fullscreen mode:", err);
      });
    }
  };

  // Submit quiz logic
  // const handleSubmit = useCallback(async () => {
  //   try {
  //     clearInterval(timerRef.current);
  //     setQuizStarted(false);
  //     disableFullScreen(); // Exit fullscreen after submission

  //     const questionsWithSelectedOptions = itemDetails?.questions?.map(
  //       (question, index) => {
  //         const selectedOption = selectedOptions[index];
  //         const isCorrect =
  //           selectedOption && selectedOption === question.correctAnswer;

  //         return {
  //           questionId: question._id,
  //           selectedOption,
  //           isCorrect,
  //         };
  //       }
  //     );

  //     const timeTakenInMinutes = (totalTime - timeLeft) / 60; // Convert time taken to minutes
  //     const response = await dispatch(
  //       submitQuiz({
  //         quizId,
  //         answers: questionsWithSelectedOptions,
  //         timeTaken: timeTakenInMinutes,
  //         attemptHistory,
  //       })
  //     ).unwrap();

  //     dispatch(setAttemptHistory([...attemptHistory, response.newAttempt]));
  //     dispatch(
  //       setQuizResults({
  //         totalPoints: response.totalPoints,
  //         correctAnswers: response.correctAnswers,
  //         wrongAnswers: response.wrongAnswers,
  //       })
  //     );
  //     setQuizSubmitted(true);
  //     setIsModalOpen(false);
  //     window.location.reload();
  //   } catch (error) {
  //     console.error("Failed to submit quiz:", error);
  //     setErrorModalVisible(true);
  //   }
  // }, [
  //   dispatch,
  //   itemDetails?.questions,
  //   selectedOptions,
  //   totalTime,
  //   timeLeft,
  //   quizId,
  //   attemptHistory,
  // ]);

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

      // Update time taken and show the submission modal
      setTimeTaken(timeTakenInMinutes);
      setSubmissionModalVisible(true);
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

  // Security event listeners
  const addSecurityEventListeners = useCallback(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setSuspiciousActivityDetected(true);
      }
    };

    const handleFocusLoss = () => {
      setSuspiciousActivityDetected(true);
    };

    const disableShortcuts = (e) => {
      // List of restricted keys
      const restrictedKeys = [
        "F12",
        "F11",
        "Escape",
        "PrintScreen",
        "Alt",
        "Tab",
        "ContextMenu",
      ];

      if (
        (e.ctrlKey && e.key === "c") || // Ctrl+C
        (e.ctrlKey && e.key === "v") || // Ctrl+V
        (e.ctrlKey && e.key === "x") || // Ctrl+X
        (e.ctrlKey && e.key === "s") || // Ctrl+S
        (e.altKey && e.key === "Tab") || // Alt+Tab
        restrictedKeys.includes(e.key)
      ) {
        e.preventDefault();
        setSuspiciousActivityDetected(true);
      }
    };

    const disableRightClick = (e) => {
      e.preventDefault();
      setSuspiciousActivityDetected(true);
    };

    const handleResize = () => {
      if (
        window.innerWidth < initialWindowWidth ||
        window.innerHeight < initialWindowHeight
      ) {
        setResizeModalVisible(true);
      }
    };

    // Add event listeners
    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleFocusLoss);
    window.addEventListener("keydown", disableShortcuts);
    window.addEventListener("contextmenu", disableRightClick);
    window.addEventListener("resize", handleResize);

    // Cleanup function
    const removeSecurityEventListeners = () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleFocusLoss);
      window.removeEventListener("keydown", disableShortcuts);
      window.removeEventListener("contextmenu", disableRightClick);
      window.removeEventListener("resize", handleResize);
    };

    // Save the cleanup function to be called when the quiz ends
    cleanupRef.current = removeSecurityEventListeners;
  }, [initialWindowWidth, initialWindowHeight]);

  const cleanupRef = useRef(null);

  // Start quiz logic
  const handleStartQuiz = useCallback(async () => {
    try {
      // Listen for fullscreen change
      const onFullScreenChange = () => {
        if (document.fullscreenElement) {
          // Now we're in fullscreen mode
          // Set initial window size
          setInitialWindowWidth(window.innerWidth);
          setInitialWindowHeight(window.innerHeight);

          // Remove the listener as it's no longer needed
          document.removeEventListener("fullscreenchange", onFullScreenChange);

          // Now, set up the security event listeners
          addSecurityEventListeners();
        }
      };

      document.addEventListener("fullscreenchange", onFullScreenChange);

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
  }, [
    dispatch,
    quizId,
    itemDetails.timeLimit,
    handleSubmit,
    addSecurityEventListeners,
  ]);

  const hasRemainingAttempts = useCallback(() => {
    if (itemDetails?.allowNumberOfAttempts === null) return true; // Unlimited attempts
    return attemptHistory?.length < itemDetails?.allowNumberOfAttempts;
  }, [itemDetails?.allowNumberOfAttempts, attemptHistory]);

  const handleAcknowledge = () => {
    setAcknowledged((prev) => !prev);
  };

  const handleOkClick = useCallback(() => {
    const newViolationCount = violationCount + 1;
    setViolationCount(newViolationCount);
    setViolationModalVisible(false);

    if (newViolationCount >= 3) {
      setErrorModalVisible(true);
      handleSubmit();
    }
  }, [violationCount, handleSubmit]);

  const handleResizeOkClick = useCallback(() => {
    setResizeModalVisible(false);
    handleSubmit();
  }, [handleSubmit]);

  const handleResizeCancelClick = useCallback(() => {
    const newViolationCount = violationCount + 1;
    setViolationCount(newViolationCount);
    setResizeModalVisible(false);

    // Re-enable fullscreen mode
    enableFullScreen();

    // Update initial window size to current size
    // We need to wait for fullscreen to be re-enabled
    const onFullScreenChange = () => {
      if (document.fullscreenElement) {
        setInitialWindowWidth(window.innerWidth);
        setInitialWindowHeight(window.innerHeight);
        document.removeEventListener("fullscreenchange", onFullScreenChange);
      }
    };
    document.addEventListener("fullscreenchange", onFullScreenChange);

    if (newViolationCount >= 3) {
      setErrorModalVisible(true);
      handleSubmit();
    }
  }, [violationCount, enableFullScreen, handleSubmit]);

  // Handle violation modal visibility
  useEffect(() => {
    if (suspiciousActivityDetected) {
      setViolationModalVisible(true);
      setSuspiciousActivityDetected(false); // Reset to avoid repeated triggers
    }
  }, [suspiciousActivityDetected]);

  // Cleanup on component unmount or when quiz ends
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);

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
                  <QuizInstructions
                    acknowledged={acknowledged}
                    onAcknowledge={handleAcknowledge}
                    handleStartQuiz={handleStartQuiz}
                  />
                </div>
              )}
            </div>
          )}
        </Tabs>
      </div>

      {isModalOpen && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
            (violationModalVisible || resizeModalVisible) &&
            "border-4 border-red-600"
          }`}
        >
          <div className="bg-white w-full h-full flex">
            <div className="w-[75%] p-4 overflow-y-auto">
              <QuizQuestions handleSubmit={handleSubmit} />
            </div>
            <div className="w-[25%] border-l p-4">
              <QuestionDetailCard hideTime={true} />
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

            {resizeModalVisible && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-lg font-semibold text-red-600">
                    Window Resized!
                  </h3>
                  <p className="mt-2 text-gray-700">
                    You have resized the window. Do you want to submit the quiz?
                  </p>
                  <div className="mt-4 flex justify-end space-x-4">
                    <button
                      onClick={handleResizeCancelClick}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-600 focus:outline-none"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleResizeOkClick}
                      className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 focus:outline-none"
                    >
                      Submit Quiz
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {submissionModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full relative">
            {/* Close Button */}
            <button
              onClick={() => {
                setSubmissionModalVisible(false);
                window.location.reload();
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              aria-label="Close Modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal Content */}
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-green-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <h3 className="mt-4 text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Quiz Submitted Successfully!
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  You have completed the quiz.
                </p>
                <p className="mt-4 text-sm text-gray-700 dark:text-gray-400">
                  <strong>Time Taken:</strong> {Math.floor(timeTaken)} minutes{" "}
                  {Math.round((timeTaken % 1) * 60)} seconds
                </p>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => {
                    setSubmissionModalVisible(false);
                    window.location.reload();
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Close
                </button>
              </div>
            </div>
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
            <QuizResultSummary />
            <QuestionDetailCard />
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
