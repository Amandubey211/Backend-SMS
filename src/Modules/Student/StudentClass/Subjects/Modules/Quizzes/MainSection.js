
import React, { useState, Suspense, useEffect, useCallback } from 'react';
import SubjectSideBar from '../../Component/SubjectSideBar';
import QuizzDetailCard from './Components/QuizzDetailCard';
import QuizInstructionSection from './Components/QuizInstructionSection';
import QuizQuestions from './Components/QuizQuestions';
import QuestionDetailCard from './Components/QuestionDetailCard';
import QuizResults from './Components/QuizResults';
import QuizResultSummary from './Components/QuizResultSummary';
import Tabs from './Components/Tabs';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { baseUrl } from '../../../../../../config/Common';

const MainSection = ({ quiz }) => {
  const quizId = quiz._id;
  const { selectedClass, selectedSection, selectedSubject, studentId } = useSelector((state) => state.Common);
  const [activeTab, setActiveTab] = useState('instructions');
  const [selectedOptions, setSelectedOptions] = useState({});
  const [totalTime, setTotalTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResults, setQuizResults] = useState({ totalPoints: 0, correctAnswers: 0, wrongAnswers: 0 });
  const [attemptHistory, setAttemptHistory] = useState([]);

  const { timeLimit } = quiz;
  const quizDuration = timeLimit * 60;

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
            handleSubmit();  // Automatically submit when timer reaches 0
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [quizStarted]);

  useEffect(() => {
    const fetchAttemptHistory = async () => {
      try {
        const token = localStorage.getItem('student:token');
        if (!token) {
          throw new Error('Authentication token not found');
        }
        const attemptNumber = 1; // Start with the first attempt for example
        // const response = await fetch(`${baseUrl}/student/studentquiz/${quizId}/attempt/${attemptNumber}`, {
        const response = await fetch(`${baseUrl}/student/studentquiz/${quizId}/attempt`, {
          headers: {
            'Authentication': token,
          },
        });
        // console.log(`${baseUrl}/student/studentquiz/${quizId}/attempt/${attemptNumber}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch attempt history, status: ${response.status}`);
        }

        const data = await response.json();


        console.log("atttempt data", data)
        if (data.success && data.submission) {
          setAttemptHistory(data.submission);
          setQuizSubmitted(data.submission.length > 0);
        } else {
          setQuizSubmitted(false); // Reset to false if no submission found
          console.error("No attempt history data or unsuccessful response");
        }
      } catch (error) {
        console.error("Failed to fetch attempt history:", error);
      }
    };

    fetchAttemptHistory();
  }, [quizId]);

  const submitQuiz = async (answers, timeTaken) => {
    console.log("answers⌚⌚", answers)
    console.log("timeTaken", timeTaken)
    try {

      const token = localStorage.getItem('student:token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`${baseUrl}/student/studentquiz/submit/${quizId}`, {
        method: 'POST',
        headers: {
          'Authentication': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentAnswers: answers, timeTaken }),
      });

      const data = await response.json();
      console.log("data is ", data)
      if (response.ok) {
        setQuizSubmitted(true);
        setQuizResults({
          totalPoints: data.score,
          correctAnswers: data.rightAnswer,
          wrongAnswers: data.wrongAnswer,
        });

        setAttemptHistory(prev => [
          ...prev,
          {
            attempts: prev.length + 1,
            score: data.score,
            rightAnswer: data.rightAnswer,
            wrongAnswer: data.wrongAnswer,
            questions: answers,
          }
        ]);
      } else {
        console.error('Failed to submit quiz:', data.message);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const handleOptionChange = (questionIndex, selectedOption) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionIndex]: selectedOption,
    }));
  };

  const handleTabChange = useCallback((tab) => {
    if (tab === 'questions') {
      if (quizSubmitted) {
        setSelectedOptions({});
        setTimeLeft(quizDuration);
        setQuizResults({ totalPoints: 0, correctAnswers: 0, wrongAnswers: 0 });
      }
      if (!quizStarted) {
        startTimer();
      }
    } else {
      // Reset quizSubmitted and other states when switching to 'instructions'
      setQuizSubmitted(false);
      setSelectedOptions({});
      setQuizResults({ totalPoints: 0, correctAnswers: 0, wrongAnswers: 0 });
      setQuizStarted(false); // Stop the timer
    }
    setActiveTab(tab);
  }, [quizSubmitted, quizDuration, quizStarted]);

  const handleSubmit = useCallback(() => {
    let totalPoints = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;
    const questionsWithSelectedOptions = quiz.questions.map((question, index) => {
      const selectedOption = selectedOptions[index];
      const isCorrect = selectedOption && selectedOption === question.correctAnswer;
      // console.log("Question data💻:", isCorrect);

      console.log("🛜isCorrect:🛜", isCorrect);




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
    });

    const newAttempt = {
      attemptNumber: attemptHistory.length + 1,
      totalPoints,
      correctAnswers,
      wrongAnswers,
      questions: questionsWithSelectedOptions,
    };

    setQuizResults(newAttempt);
    setQuizSubmitted(true);
    setQuizStarted(false); // Stop the timer
    submitQuiz(questionsWithSelectedOptions, totalTime - timeLeft);
    setAttemptHistory((prev) => [...prev, newAttempt]);
  }, [selectedOptions, attemptHistory, quiz.questions, submitQuiz, totalTime, timeLeft]);




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
            <div className='h-full'>
              {activeTab === 'instructions' && (
                <Suspense fallback={<div>Loading...</div>}>
                  <QuizInstructionSection quiz={quiz} />
                </Suspense>
              )}
              {activeTab === 'questions' && (
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
                    <QuizResults questions={quiz.questions} selectedOptions={selectedOptions} />
                  )}
                </Suspense>
              )}
            </div>
          )}
        </Tabs>
      </div>
      <div className="w-[30%]">
        {activeTab === 'instructions' && <QuizzDetailCard quiz={quiz} />}
        {activeTab === 'questions' && !quizSubmitted && (
          <QuestionDetailCard timeLeft={timeLeft} totalTime={totalTime} quiz={quiz} />
        )}
        {activeTab === 'questions' && quizSubmitted && (
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

