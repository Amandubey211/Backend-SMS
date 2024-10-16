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
import { useSelector } from "react-redux";
import { useNavigate, useBeforeUnload } from "react-router-dom";

const MainSection = () => {
  const { loading, error, quizData, filters } = useSelector((store) => store?.student?.studentQuiz);
  const quizId = quizData ._id;
  // const { selectedClass, selectedSection, selectedSubject, studentId } =
  //   useSelector((state) => state.Common);

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

  const { timeLimit, allowNumberOfAttempts, showOneQuestionOnly } = quizData ;
  const quizDuration = timeLimit * 60;

  // Fetch attempt history (allows for null attempts)
  useFetchAttemptHistory(
    quizId,
    allowNumberOfAttempts, // Pass this correctly
    setAttemptHistory,
    setQuizSubmitted
  );

  const { submitQuiz, isLoading } = useSubmitQuiz(
    quizId,
    attemptHistory,
    setAttemptHistory,
    allowNumberOfAttempts
  );

  useBeforeUnload((event) => {
    if (quizStarted && !quizSubmitted) {
      event.preventDefault();
      event.returnValue = "";
    }
  });

  useEffect(() => {
    let timer;
    if (quizStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setQuizStarted(false);
            handleSubmit();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStarted, timeLeft]);

  const handleTabChange = useCallback(
    (tab) => {
      if (tab === "instructions") {
        setActiveTab(tab);
        return;
      }
      if (tab === "questions" && !quizStarted) {
        setTimeLeft(quizDuration);
        setTotalTime(quizDuration);
        setQuizStarted(true);
      }
      setActiveTab(tab);
    },
    [quizStarted, quizDuration]
  );

  const handleSubmit = useCallback(async () => {
    try {
      let totalPoints = 0;
      let correctAnswers = 0;
      let wrongAnswers = 0;

      const questionsWithSelectedOptions = quizData .questions.map(
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

          return { questionId: question._id, selectedOption, isCorrect };
        }
      );

      const newAttempt = await submitQuiz(
        questionsWithSelectedOptions,
        totalTime - timeLeft
      );

      if (newAttempt) {
        setAttemptHistory((prev) => [...prev, newAttempt]);
        setQuizSubmitted(true);
        setQuizResults({ totalPoints, correctAnswers, wrongAnswers });
      }

      setQuizStarted(false);
    } catch (error) {
      console.error("Quiz submission failed:", error);
      alert("An error occurred while submitting your quiz. Please try again.");
    }
  }, [selectedOptions, submitQuiz, totalTime, timeLeft, quizData .questions]);

  const hasRemainingAttempts = () => {
    // Only check attempts if allowNumberOfAttempts is not null
    if (allowNumberOfAttempts === null) {
      return true; // Unlimited attempts
    }
    return attemptHistory.length < allowNumberOfAttempts;
  };

  return (
    <div className="flex">
      <SubjectSideBar />
      <div className="w-[65%] border-x">
        <Tabs
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          quizSubmitted={quizSubmitted}
          hasAttempted={attemptHistory.length > 0}
          quiz={quizData}
          hasRemainingAttempts={hasRemainingAttempts()} // Call the attempt check function
        >
          {(activeTab) => (
            <div className="h-full">
              {activeTab === "instructions" && (
                <QuizInstructionSection quiz={quizData} />
              )}
              {activeTab === "questions" && (
                <>
                  {quizSubmitted && hasRemainingAttempts() ? (
                    <QuizQuestions
                      questions={quizData.questions}
                      selectedOptions={selectedOptions}
                      setSelectedOptions={setSelectedOptions}
                      showOneQuestionOnly={showOneQuestionOnly}
                      handleSubmit={handleSubmit}
                    />
                  ) : (
                    <QuizResults
                      questions={quizData.questions}
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
        {activeTab === "instructions" && <QuizzDetailCard quiz={quizData} />}
        {((activeTab === "questions" && !quizSubmitted) ||
          (activeTab === "questions" &&
            quizSubmitted &&
            hasRemainingAttempts())) && (
          <QuestionDetailCard
            timeLeft={timeLeft}
            totalTime={totalTime}
            quizData={quizData}
            numberOfQuestions={quizData.questions.length}
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
