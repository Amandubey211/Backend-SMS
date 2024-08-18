import React, { useState, useEffect, useCallback } from "react";
import SubjectSideBar from "../../Component/SubjectSideBar";
import QuizzDetailCard from "./Components/QuizzDetailCard";
import QuizInstructionSection from "./Components/QuizInstructionSection";
import QuizQuestions from "./Components/QuizQuestions";
import QuestionDetailCard from "./Components/QuestionDetailCard";
import QuizResults from "./Components/QuizResults";
import QuizResultSummary from "./Components/QuizResultSummary";
import Tabs from "./Components/Tabs";
import { useSelector } from "react-redux";
import useFetchAttemptHistory from "../../../../../../Hooks/StudentHooks/Quiz/useFetchAttemptHistory";
import useSubmitQuiz from "../../../../../../Hooks/StudentHooks/Quiz/useSubmitQuiz";
import { useNavigate, useBeforeUnload } from "react-router-dom";

const MainSection = ({ quiz }) => {
  const quizId = quiz._id;
  const { selectedClass, selectedSection, selectedSubject, studentId } =
    useSelector((state) => state.Common);
  const [activeTab, setActiveTab] = useState("instructions");
  const [selectedOptions, setSelectedOptions] = useState({});
  const [totalTime, setTotalTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [attemptHistory, setAttemptHistory] = useState([]);
  const [quizResults, setQuizResults] = useState({
    totalPoints: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  });

  const {
    timeLimit,
    allowNumberOfAttempts,
    showOneQuestionOnly,
    allowedAttempts,
  } = quiz;
  const quizDuration = timeLimit * 60;

  const navigate = useNavigate();

  // Custom hook to fetch attempt history
  useFetchAttemptHistory(
    quizId,
    allowNumberOfAttempts,
    setAttemptHistory,
    setQuizSubmitted
  );

  // Custom hook to handle quiz submission
  const { submitQuiz } = useSubmitQuiz(
    quizId,
    attemptHistory,
    setAttemptHistory,
    allowNumberOfAttempts
  );

  useBeforeUnload((event) => {
    if (quizStarted && !quizSubmitted) {
      event.preventDefault();
      event.returnValue = ""; // Trigger the native browser confirmation dialog
    }
  });

  useEffect(() => {
    const handleNavigation = (e) => {
      if (quizStarted && !quizSubmitted) {
        const confirmLeave = window.confirm(
          "You are about to leave the quiz. Your submission will not be saved. Are you sure you want to leave?"
        );
        if (!confirmLeave) {
          e.preventDefault(); // Prevent navigation
        } else {
          navigate(e.target.location.pathname); // Allow navigation
        }
      }
    };

    // Override the default behavior of link clicks
    const links = document.querySelectorAll("a");
    links.forEach((link) => link.addEventListener("click", handleNavigation));

    return () => {
      links.forEach((link) =>
        link.removeEventListener("click", handleNavigation)
      );
    };
  }, [quizStarted, quizSubmitted, navigate]);

  useEffect(() => {
    let timer;
    if (quizStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setQuizStarted(false);
            handleSubmit(); // Automatically submit when timer reaches 0
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [quizStarted, timeLeft]);

  const handleOptionChange = (questionIndex, selectedOption) => {
    console.log(
      `Selected option for question ${questionIndex}:`,
      selectedOption
    );
    setSelectedOptions((prev) => ({
      ...prev,
      [questionIndex]: selectedOption,
    }));
  };

  const handleTabChange = useCallback(
    (tab) => {
      if (tab === "instructions") {
        // Allow navigation to instructions at any time
        setActiveTab(tab);
        return;
      }

      if (tab === "questions") {
        if (!quizStarted) {
          setTimeLeft(quizDuration);
          setTotalTime(quizDuration);
          setQuizStarted(true);
        }
      }
      setActiveTab(tab);
    },
    [quizStarted, quizDuration]
  );

  const handleSubmit = useCallback(async () => {
    console.log("Submitting quiz...");
    let totalPoints = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;
    const questionsWithSelectedOptions = quiz.questions.map(
      (question, index) => {
        const selectedOption = selectedOptions[index];
        const isCorrect =
          selectedOption && selectedOption === question.correctAnswer;

        if (selectedOption) {
          if (isCorrect) {
            correctAnswers += 1;
            totalPoints += question.questionPoint;
          } else {
            wrongAnswers += 1;
          }
        }
        return {
          questionId: question._id,
          selectedOption,
          isCorrect,
        };
      }
    );

    console.log("Quiz results:", { totalPoints, correctAnswers, wrongAnswers });

    const newAttempt = await submitQuiz(
      questionsWithSelectedOptions,
      totalTime - timeLeft
    );

    if (newAttempt) {
      console.log("New attempt saved:", newAttempt);
      setAttemptHistory((prev) => [...prev, newAttempt]);
      setQuizSubmitted(true); // Set quizSubmitted to true immediately after successful submission
      setQuizResults({
        totalPoints: totalPoints,
        correctAnswers: correctAnswers,
        wrongAnswers: wrongAnswers,
      });
    }

    setQuizStarted(false); // Stop the timer
  }, [selectedOptions, submitQuiz, totalTime, timeLeft, quiz.questions]);

  const hasRemainingAttempts = () => {
    console.log("Checking remaining attempts...");
    if (allowedAttempts) {
      console.log("Unlimited attempts allowed");
      return true; // Allow unlimited attempts
    }
    return (
      allowNumberOfAttempts === 0 ||
      attemptHistory.length < allowNumberOfAttempts
    );
  };

  return (
    <div className="flex">
      <SubjectSideBar />
      <div className="w-[65%] border-x">
        <Tabs
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          onTabChange={handleTabChange}
          quizSubmitted={quizSubmitted}
          hasAttempted={attemptHistory.length > 0}
          quiz={quiz}
          hasRemainingAttempts={hasRemainingAttempts()}
        >
          {(activeTab) => (
            <div className="h-full">
              {activeTab === "instructions" && (
                <QuizInstructionSection quiz={quiz} />
              )}
              {activeTab === "questions" && (
                <>
                  {!quizSubmitted && hasRemainingAttempts() ? (
                    <QuizQuestions
                      questions={quiz.questions}
                      selectedOptions={selectedOptions}
                      handleOptionChange={handleOptionChange}
                      showOneQuestionOnly={showOneQuestionOnly}
                      handleSubmit={handleSubmit}
                    />
                  ) : (
                    <QuizResults
                      questions={quiz.questions}
                      selectedOptions={selectedOptions}
                    />
                  )}
                </>
              )}
            </div>
          )}
        </Tabs>
      </div>
      <div className="w-[30%]">
        {activeTab === "instructions" && <QuizzDetailCard quiz={quiz} />}
        {activeTab === "questions" && !quizSubmitted && (
          <QuestionDetailCard
            timeLeft={timeLeft}
            totalTime={totalTime}
            quiz={quiz}
          />
        )}
        {activeTab === "questions" && quizSubmitted && (
          <QuizResultSummary
            totalPoints={quizResults.totalPoints}
            correctAnswers={quizResults.correctAnswers}
            wrongAnswers={quizResults.wrongAnswers}
            attemptHistory={attemptHistory}
            quizId={quizId}
          />
        )}
      </div>
    </div>
  );
};

export default MainSection;
