
import React, { useState, Suspense, useEffect } from 'react';
import SubjectSideBar from '../../Component/SubjectSideBar';
import QuizzDetailCard from './Components/QuizzDetailCard';
import QuizInstructionSection from './Components/QuizInstructionSection';
import QuizQuestions from './Components/QuizQuestions';
import QuestionDetailCard from './Components/QuestionDetailCard';
import QuizResults from './Components/QuizResults';
import QuizResultSummary from './Components/QuizResultSummary';
import mockData from './Components/MockData/QuestionsMock';
import Tabs from './Components/Tabs';

const MainSection = () => {
  const [activeTab, setActiveTab] = useState('instructions');
  const [selectedOptions, setSelectedOptions] = useState({});
  const [totalTime, setTotalTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResults, setQuizResults] = useState({ totalPoints: 0, correctAnswers: 0, wrongAnswers: 0 });
  const [attemptHistory, setAttemptHistory] = useState([]);
  const quizDuration = 3665;

  const startTimer = () => {
    setTimeLeft(quizDuration);
    setTotalTime(quizDuration);
    setQuizStarted(true);
  };

  useEffect(() => {
    let timer;
    if (quizStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [quizStarted, timeLeft]);

  const handleOptionChange = (questionIndex, selectedOption) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionIndex]: selectedOption,
    }));
  };

  const handleSubmit = () => {
    let totalPoints = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;
    const questionsWithSelectedOptions = mockData.map((question, index) => {
      const correctOption = question.options.find((option) => option.isCorrect);
      const selectedOption = selectedOptions[index];
      const isCorrect = selectedOption === correctOption.value;

      if (selectedOption) {
        if (isCorrect) {
          correctAnswers += 1;
          totalPoints += question.points;
        } else {
          wrongAnswers += 1;
        }
      }

      return {
        ...question,
        selectedOption,
      };
    });

    const attemptNumber = attemptHistory.length + 1;
    const newAttempt = {
      attemptNumber,
      totalPoints,
      correctAnswers,
      wrongAnswers,
      questions: questionsWithSelectedOptions,
    };

    setAttemptHistory((prev) => [...prev, newAttempt]);
    setQuizResults(newAttempt);
    setQuizSubmitted(true);
    setQuizStarted(false); // Stop the timer
  };

  const handleTabChange = (tab) => {
    if (tab === 'questions') {
      if (quizSubmitted) {
        setSelectedOptions({});
        setQuizSubmitted(false);
        setTimeLeft(quizDuration);
        setQuizResults({ totalPoints: 0, correctAnswers: 0, wrongAnswers: 0 });
      }
      if (!quizStarted) {
        startTimer();
      }
    }
    setActiveTab(tab);
  };

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
        >
          {(activeTab) => (
            <div className='h-full'>
              {activeTab === 'instructions' && (
                <Suspense fallback={<div>Loading...</div>}>
                  <QuizInstructionSection />
                </Suspense>
              )}
              {activeTab === 'questions' && (
                <Suspense fallback={<div>Loading...</div>}>
                  {!quizSubmitted ? (
                    <>
                      <QuizQuestions
                        questions={mockData}
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
                    <QuizResults questions={mockData} selectedOptions={selectedOptions} />
                  )}
                </Suspense>
              )}
            </div>
          )}
        </Tabs>
      </div>
      <div className="w-[30%]">
        {activeTab === 'instructions' && <QuizzDetailCard />}
        {activeTab === 'questions' && !quizSubmitted && (
          <QuestionDetailCard timeLeft={timeLeft} totalTime={totalTime} />
        )}
        {activeTab === 'questions' && quizSubmitted && (
          <QuizResultSummary 
            totalPoints={quizResults.totalPoints}
            correctAnswers={quizResults.correctAnswers}
            wrongAnswers={quizResults.wrongAnswers}
            attemptHistory={attemptHistory} // Pass attempt history to QuizResultSummary
          />
        )}
      </div>
    </div>
  );
};

export default MainSection;
