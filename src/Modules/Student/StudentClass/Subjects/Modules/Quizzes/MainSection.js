import React, { useState, useEffect, useCallback } from "react";
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
import { useNavigate, useBeforeUnload, useLocation } from "react-router-dom";
import { setActiveTab, setAttemptHistory, setQuizResults } from "../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Quizes/quizesSlice";
import { submitQuiz } from "../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Quizes/quizes.action";

const MainSection = () => {
  const { loading, error, itemDetails, activeTab, selectedOptions,quizResults,attemptHistory } = useSelector((store) => store?.student?.studentQuiz);
  const quizId = itemDetails?._id;

  const location = useLocation();
  const dispatch = useDispatch();

  const [totalTime, setTotalTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  // const [attemptHistory, setAttemptHistory] = useState([]);

  // console.log("attempt history is===>",attemptHistory)
  const { timeLimit, allowNumberOfAttempts, showOneQuestionOnly } = itemDetails;
  const quizDuration = timeLimit * 60;

  // Fetch attempt history (allows for null attempts)
  // useFetchAttemptHistory(
  //   quizId,
  //   allowNumberOfAttempts, // Pass this correctly
  //   setAttemptHistory,
  //   setQuizSubmitted
  // );

  // const { isLoading } = useSubmitQuiz(
  //   quizId,
  //   attemptHistory,
  //   setAttemptHistory,
  //   allowNumberOfAttempts
  // );

  // useBeforeUnload to handle preventing reload until quiz is submitted
  useBeforeUnload((event) => {
    if (quizStarted && !quizSubmitted) {
      event.preventDefault();
      event.returnValue = ""; // Show a confirmation dialog before reloading
    }
  });



  // UseEffect for handling timer logic
  useEffect(() => {
    let timer;
    if (quizStarted && timeLeft > 0) {
      // Start the timer
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setQuizStarted(false); // Stop the quiz when time is over
            handleSubmit(); // Submit the quiz when time is up
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer); // Cleanup the timer on unmount or quiz stop
  }, [quizStarted, timeLeft]);

  // Handle tab switching
  const handleTabChange = useCallback(
    (tab) => {
      if (tab === "instructions") {
        dispatch(setActiveTab(tab));
        return;
      }

      // If switching to "questions", start the quiz if not already started
      if (tab === "questions" && !quizStarted) {
        setTimeLeft(quizDuration); // Set the time left to the quiz duration
        setTotalTime(quizDuration); // Set total time
        setQuizStarted(true); // Start the quiz (i.e., trigger the timer)
      }

      dispatch(setActiveTab(tab));
    },
    [quizStarted, quizDuration, dispatch]
  );

  const handleSubmit = useCallback(async () => {
    try {
      let totalPoints = 0;
      let correctAnswers = 0;
      let wrongAnswers = 0;

      const questionsWithSelectedOptions = itemDetails?.questions?.map(
        (question, index) => {
          const selectedOption = selectedOptions[index];
          const isCorrect =
            selectedOption && selectedOption === question.correctAnswer;

          if (selectedOption) {
            if (isCorrect) {
              correctAnswers += 1;
              totalPoints += question?.questionPoint;
            } else {
              wrongAnswers += 1;
            }
          }

          return { questionId: question._id, selectedOption, isCorrect };
        }
      );

      const newAttempt = dispatch(submitQuiz(
        {
          quizId,
          answers: questionsWithSelectedOptions,
          timeTaken: totalTime - timeLeft,
          attemptHistory
        }
      ));

      if (newAttempt) {
        dispatch(setAttemptHistory((prev) => [...prev, newAttempt]));
        setQuizSubmitted(true);
        dispatch(setQuizResults({ totalPoints, correctAnswers, wrongAnswers }));
      }

      setQuizStarted(false); // Stop the quiz after submitting
    } catch (error) {
      console.error("Quiz submission failed:", error);
      alert("An error occurred while submitting your quiz. Please try again.");
    }
  }, [selectedOptions, submitQuiz, totalTime, timeLeft, itemDetails.questions]);





  const hasRemainingAttempts = () => {
    if (allowNumberOfAttempts === null) {
      return true; // Unlimited attempts
    }
    return attemptHistory?.length < allowNumberOfAttempts;
  };

  // Start timer if the "questions" tab is active (when quiz is already started)
  useEffect(() => {
    if (activeTab === "questions" && !quizStarted) {
      // Trigger timer if the tab is questions but quiz hasn't started yet
      setTimeLeft(quizDuration);
      setTotalTime(quizDuration);
      setQuizStarted(true);
    }
  }, [activeTab, quizStarted, quizDuration]);






  // Custom event listener for submitting quiz on reload
  useEffect(() => {
    const handleBeforeUnload = async (event) => {
      if (quizStarted && !quizSubmitted) {
        event.preventDefault();
        event.returnValue = ""; // Standard to show confirmation dialog

        // Submit the quiz before reload
        await handleSubmit();

        // Allow the page to reload after submission
        if (quizSubmitted) {
          event.returnValue = null; // Let the reload happen
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload); // Cleanup on unmount
    };
  }, [quizStarted, quizSubmitted, handleSubmit]);

  return (
    <div className="flex">
      <SubjectSideBar />
      <div className="w-[65%] border-x">
        <Tabs
          quizSubmitted={quizSubmitted}
          hasAttempted={attemptHistory?.length > 0}
          quiz={itemDetails}
          hasRemainingAttempts={hasRemainingAttempts()}
          onTabChange={handleTabChange}
          attemptHistory={attemptHistory}
        >
          {(activeTab) => (
            <div className="h-full">
              {activeTab === "instructions" && <QuizInstructionSection />}
              {activeTab === "questions" && (
                <>
                  {!quizSubmitted && hasRemainingAttempts() ? (
                    <QuizQuestions
                      showOneQuestionOnly={showOneQuestionOnly}
                      handleSubmit={handleSubmit}
                      hasRemainingAttempts={hasRemainingAttempts()}
                    />
                  ) : (
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
        {((activeTab === "questions" && !quizSubmitted) ||
          (activeTab === "questions" &&
            quizSubmitted &&
            hasRemainingAttempts())) && (
            <QuestionDetailCard
              timeLeft={timeLeft}
              totalTime={totalTime}
              quiz={itemDetails}
              numberOfQuestions={itemDetails?.questions?.length}
            />
          )}
        {activeTab === "questions" && quizSubmitted && (
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
