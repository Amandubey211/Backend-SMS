import React, { useState, useEffect, useCallback, Suspense, lazy } from "react";
import { useParams } from "react-router-dom";
import SubjectSideBar from "../../Component/SubjectSideBar";
import useFetchQuizById from "../../../../../../Hooks/AuthHooks/Student/Quiz/useFetchQuizById";
import axios from "axios";
import { baseUrl } from "../../../../../../config/Common";
import Tabs from "./Components/Tabs";

const QuizResultSummary = lazy(() => import("./Components/QuizResultSummary"));
const QuizQuestions = lazy(() => import("./Components/QuizQuestions"));
const QuizInstructionSection = lazy(() => import("./Components/QuizInstructionSection"));
const QuizResults = lazy(() => import("./Components/QuizResults"));
const QuizzDetailCard = lazy(() => import("./Components/QuizzDetailCard"));
const QuestionDetailCard = lazy(() => import("./Components/QuestionDetailCard"));

const MainSection = () => {
  const { qid: quizId } = useParams();
  const {
    quiz,
    loading: quizLoading,
    error: quizError,
    refetch,
  } = useFetchQuizById(quizId);

  const [activeTab, setActiveTab] = useState("instructions");
  const [selectedOptions, setSelectedOptions] = useState({});
  const [totalTime, setTotalTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResults, setQuizResults] = useState({
    totalPoints: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  });
  const [attemptHistory, setAttemptHistory] = useState([]);
  const quizDuration = quiz ? quiz.timeLimit * 60 : 0;

  useEffect(() => {
    if (quiz) {
      console.log(quiz);
    }
  }, [quiz]);

  useEffect(() => {
    const fetchAttemptHistory = async () => {
      try {
        const token = localStorage.getItem("student:token");
        if (!token) {
          throw new Error("Authentication token not found");
        }
        const response = await axios.get(
          `${baseUrl}/student/studentquiz/${quizId}/attempt`,
          {
            headers: {
              Authentication: token,
            },
          }
        );

        if (response.data.success && response.data.submission) {
          setAttemptHistory(response.data.submission);
          setQuizSubmitted(response.data.submission.length > 0);
        } else {
          setQuizSubmitted(false);
          console.error("No attempt history data or unsuccessful response");
        }
      } catch (error) {
        console.error("Failed to fetch attempt history:", error);
      }
    };

    if (quizId) {
      fetchAttemptHistory();
    }
  }, [quizId]);

  const startTimer = () => {
    setTimeLeft(quizDuration);
    setTotalTime(quizDuration);
    setQuizStarted(true);
  };

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

  const submitQuiz = useCallback(async (answers, timeTaken) => {
    try {
      const token = localStorage.getItem("student:token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.post(
        `${baseUrl}/student/studentquiz/submit/${quizId}`,
        { studentAnswers: answers, timeTaken },
        {
          headers: {
            Authentication: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setQuizSubmitted(true);
        setQuizResults({
          totalPoints: response.data.score,
          correctAnswers: response.data.rightAnswer,
          wrongAnswers: response.data.wrongAnswer,
        });

        setAttemptHistory((prev) => [
          ...prev,
          {
            attempts: prev.length + 1,
            score: response.data.score,
            rightAnswer: response.data.rightAnswer,
            wrongAnswer: response.data.wrongAnswer,
            questions: answers,
          },
        ]);
      } else {
        console.error("Failed to submit quiz:", response.data.message);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  }, [quizId]);

  const handleOptionChange = useCallback((questionIndex, selectedOption) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionIndex]: selectedOption,
    }));
  }, []);

  const handleTabChange = useCallback(
    (tab) => {
      if (tab === "questions") {
        if (quizSubmitted) {
          setSelectedOptions({});
          setTimeLeft(quizDuration);
          setQuizResults({
            totalPoints: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
          });
        }
        if (!quizStarted) {
          startTimer();
        }
      } else {
        setQuizSubmitted(false);
        setSelectedOptions({});
        setQuizResults({ totalPoints: 0, correctAnswers: 0, wrongAnswers: 0 });
        setQuizStarted(false);
      }
      setActiveTab(tab);
    },
    [quizSubmitted, quizDuration, quizStarted]
  );

  const handleSubmit = useCallback(() => {
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

    const newAttempt = {
      attemptNumber: attemptHistory.length + 1,
      totalPoints,
      correctAnswers,
      wrongAnswers,
      questions: questionsWithSelectedOptions,
    };

    setQuizResults(newAttempt);
    setQuizSubmitted(true);
    setQuizStarted(false);
    submitQuiz(questionsWithSelectedOptions, totalTime - timeLeft);
    setAttemptHistory((prev) => [...prev, newAttempt]);
  }, [
    selectedOptions,
    attemptHistory,
    quiz?.questions,
    submitQuiz,
    totalTime,
    timeLeft,
  ]);

  if (quizLoading) {
    return <div>Loading...</div>;
  }

  if (quizError) {
    return <div>Error: {quizError}</div>;
  }

  const hasAttempted = attemptHistory.length > 0;

  return (
    <div className="flex">
      <SubjectSideBar />
      <div className="w-[65%] border-x">
        <Tabs
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          onTabChange={handleTabChange}
          quizSubmitted={quizSubmitted}
          hasAttempted={hasAttempted}
          quiz={quiz}
        >
          {(activeTab) => (
            <div className="h-full">
              {activeTab === "instructions" && (
                <Suspense fallback={<div>Loading...</div>}>
                  <QuizInstructionSection quiz={quiz} />
                </Suspense>
              )}
              {activeTab === "questions" && (
                <Suspense fallback={<div>Loading...</div>}>
                  {!quizSubmitted ? (
                    <>
                      <QuizQuestions
                        questions={quiz.questions}
                        selectedOptions={selectedOptions}
                        handleOptionChange={handleOptionChange}
                      />
                      <button
                        onClick={handleSubmit}
                        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md"
                      >
                        Submit All
                      </button>
                    </>
                  ) : (
                    <QuizResults
                      questions={quiz.questions}
                      selectedOptions={selectedOptions}
                    />
                  )}
                </Suspense>
              )}
            </div>
          )}
        </Tabs>
      </div>
      <div className="w-[30%]">
        <Suspense fallback={<div>Loading...</div>}>
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
        </Suspense>
      </div>
    </div>
  );
};

export default MainSection;
