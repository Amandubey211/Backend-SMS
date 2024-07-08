
// import React, { useState, Suspense, useEffect } from 'react';
// import SubjectSideBar from '../../Component/SubjectSideBar';
// import QuizzDetailCard from './Components/QuizzDetailCard';
// import QuizInstructionSection from './Components/QuizInstructionSection';
// import QuizQuestions from './Components/QuizQuestions';
// import QuestionDetailCard from './Components/QuestionDetailCard';
// import QuizResults from './Components/QuizResults';
// import QuizResultSummary from './Components/QuizResultSummary';
// import mockData from './Components/MockData/QuestionsMock';
// import Tabs from './Components/Tabs';

// const MainSection = () => {
//   const [activeTab, setActiveTab] = useState('instructions');
//   const [selectedOptions, setSelectedOptions] = useState({});
//   const [totalTime, setTotalTime] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [quizStarted, setQuizStarted] = useState(false);
//   const [quizSubmitted, setQuizSubmitted] = useState(false);
//   const [quizResults, setQuizResults] = useState({ totalPoints: 0, correctAnswers: 0, wrongAnswers: 0 });
//   const [attemptHistory, setAttemptHistory] = useState([]);
//   const quizDuration = 3665;

//   const startTimer = () => {
//     setTimeLeft(quizDuration);
//     setTotalTime(quizDuration);
//     setQuizStarted(true);
//   };

//   useEffect(() => {
//     let timer;
//     if (quizStarted && timeLeft > 0) {
//       timer = setInterval(() => {
//         setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
//       }, 1000);
//     }

//     return () => clearInterval(timer);
//   }, [quizStarted, timeLeft]);

//   const handleOptionChange = (questionIndex, selectedOption) => {
//     setSelectedOptions((prev) => ({
//       ...prev,
//       [questionIndex]: selectedOption,
//     }));
//   };

//   const handleSubmit = () => {
//     let totalPoints = 0;
//     let correctAnswers = 0;
//     let wrongAnswers = 0;
//     const questionsWithSelectedOptions = mockData.map((question, index) => {
//       const correctOption = question.options.find((option) => option.isCorrect);
//       const selectedOption = selectedOptions[index];
//       const isCorrect = selectedOption === correctOption.value;

//       if (selectedOption) {
//         if (isCorrect) {
//           correctAnswers += 1;
//           totalPoints += question.points;
//         } else {
//           wrongAnswers += 1;
//         }
//       }

//       return {
//         ...question,
//         selectedOption,
//       };
//     });

//     const attemptNumber = attemptHistory.length + 1;
//     const newAttempt = {
//       attemptNumber,
//       totalPoints,
//       correctAnswers,
//       wrongAnswers,
//       questions: questionsWithSelectedOptions,
//     };

//     setAttemptHistory((prev) => [...prev, newAttempt]);
//     setQuizResults(newAttempt);
//     setQuizSubmitted(true);
//     setQuizStarted(false); // Stop the timer
//   };

//   const handleTabChange = (tab) => {
//     if (tab === 'questions') {
//       if (quizSubmitted) {
//         setSelectedOptions({});
//         setQuizSubmitted(false);
//         setTimeLeft(quizDuration);
//         setQuizResults({ totalPoints: 0, correctAnswers: 0, wrongAnswers: 0 });
//       }
//       if (!quizStarted) {
//         startTimer();
//       }
//     }
//     setActiveTab(tab);
//   };

//   const hasAttempted = attemptHistory.length > 0;

//   return (
//     <div className="flex">
//       <SubjectSideBar />
//       <div className="w-[65%] border-x">
//         <Tabs
//           activeTab={activeTab}
//           setActiveTab={handleTabChange}
//           onTabChange={handleTabChange}
//           quizSubmitted={quizSubmitted}
//           hasAttempted={hasAttempted}
//         >
//           {(activeTab) => (
//             <div className='h-full'>
//               {activeTab === 'instructions' && (
//                 <Suspense fallback={<div>Loading...</div>}>
//                   <QuizInstructionSection />
//                 </Suspense>
//               )}
//               {activeTab === 'questions' && (
//                 <Suspense fallback={<div>Loading...</div>}>
//                   {!quizSubmitted ? (
//                     <>
//                       <QuizQuestions
//                         questions={mockData}
//                         selectedOptions={selectedOptions}
//                         handleOptionChange={handleOptionChange}
//                       />
//                       <button
//                         onClick={handleSubmit}
//                         className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md"
//                       >
//                         Submit All
//                       </button>
//                     </>
//                   ) : (
//                     <QuizResults questions={mockData} selectedOptions={selectedOptions} />
//                   )}
//                 </Suspense>
//               )}
//             </div>
//           )}
//         </Tabs>
//       </div>
//       <div className="w-[30%]">
//         {activeTab === 'instructions' && <QuizzDetailCard />}
//         {activeTab === 'questions' && !quizSubmitted && (
//           <QuestionDetailCard timeLeft={timeLeft} totalTime={totalTime} />
//         )}
//         {activeTab === 'questions' && quizSubmitted && (
//           <QuizResultSummary 
//             totalPoints={quizResults.totalPoints}
//             correctAnswers={quizResults.correctAnswers}
//             wrongAnswers={quizResults.wrongAnswers}
//             attemptHistory={attemptHistory} // Pass attempt history to QuizResultSummary
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default MainSection;



//-----------------------------


// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import SubjectSideBar from '../../Component/SubjectSideBar';
// import QuizzDetailCard from './Components/QuizzDetailCard';
// import QuizInstructionSection from './Components/QuizInstructionSection';
// import QuizQuestions from './Components/QuizQuestions';
// import QuizResults from './Components/QuizResults';
// import QuizResultSummary from './Components/QuizResultSummary';
// import Tabs from './Components/Tabs';

// const MainSection = () => {
//   const [activeTab, setActiveTab] = useState('instructions');
//   const [selectedQuiz, setSelectedQuiz] = useState(null); // State to hold selected quiz

//   const [selectedOptions, setSelectedOptions] = useState({});
//   const [totalTime, setTotalTime] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [quizStarted, setQuizStarted] = useState(false);
//   const [quizSubmitted, setQuizSubmitted] = useState(false);
//   const [quizResults, setQuizResults] = useState({ totalPoints: 0, correctAnswers: 0, wrongAnswers: 0 });
//   const [attemptHistory, setAttemptHistory] = useState([]);
//   const { qid } = useParams();
//   const [quizData, setQuizData] = useState(null);
//   const quizDuration = 3665;
//   useEffect(() => {
//     const fetchQuizData = async () => {
//       try {
//         const token = localStorage.getItem('student:token');
//         if (!token) {
//           throw new Error('Authentication token not found');
//         }

//         const response = await fetch(`http://localhost:8080/student/studentquiz/${qid}`, {
//           headers: {
//             'Authorization': token,
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`Failed to fetch quiz data, status: ${response.status}`);
//         }

//         const data = await response.json();
//         setQuizData(data);
//       } catch (error) {
//         console.error("Failed to fetch quiz data:", error);
//       }
//     };

//     fetchQuizData();
//   }, [qid]);

//   const startTimer = () => {
//     setTimeLeft(quizDuration);
//     setTotalTime(quizDuration);
//     setQuizStarted(true);
//   };

//   useEffect(() => {
//     let timer;
//     if (quizStarted && timeLeft > 0) {
//       timer = setInterval(() => {
//         setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
//       }, 1000);
//     }

//     return () => clearInterval(timer);
//   }, [quizStarted, timeLeft]);

//   const handleOptionChange = (questionIndex, selectedOption) => {
//     setSelectedOptions((prev) => ({
//       ...prev,
//       [questionIndex]: selectedOption,
//     }));
//   };

//   const handleSubmit = () => {
//     let totalPoints = 0;
//     let correctAnswers = 0;
//     let wrongAnswers = 0;
//     const questionsWithSelectedOptions = quizData.questions.map((question, index) => {
//       const correctOption = question.correctOption;
//       const selectedOption = selectedOptions[index] || null;
//       if (selectedOption === correctOption) {
//         totalPoints += 1;
//         correctAnswers += 1;
//       } else {
//         wrongAnswers += 1;
//       }
//       return {
//         ...question,
//         selectedOption,
//       };
//     });

//     setQuizResults({ totalPoints, correctAnswers, wrongAnswers });
//     setQuizSubmitted(true);
//     setAttemptHistory((prevHistory) => [
//       ...prevHistory,
//       { quizId: qid, date: new Date().toLocaleDateString(), score: totalPoints },
//     ]);
//     setActiveTab('results');
//   };

//   return (
//     <div className="flex">
//       <SubjectSideBar />
//       <div className="w-[65%] border-l">
//         <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
//         {activeTab === 'instructions' && (
//           <QuizInstructionSection
//             instructions={quizData?.instructions}
//             startTimer={startTimer}
//             quizStarted={quizStarted}
//             totalTime={totalTime}
//           />
//         )}
//         {activeTab === 'questions' && (
//           <QuizQuestions
//             questions={quizData?.questions}
//             selectedOptions={selectedOptions}
//             handleOptionChange={handleOptionChange}
//             timeLeft={timeLeft}
//             handleSubmit={handleSubmit}
//           />
//         )}
//         {activeTab === 'results' && (
//           <QuizResults
//             quizResults={quizResults}
//             attemptHistory={attemptHistory}
//           />
//         )}
//         {activeTab === 'summary' && <QuizResultSummary />}
//       </div>
//       <div className="w-[30%] p-2">
//         <QuizzDetailCard />
//       </div>
//     </div>
//   );
// };

// export default MainSection;



//------------------------- 👇 -------------------------------


// import React, { useState, Suspense, useEffect } from 'react';
// import SubjectSideBar from '../../Component/SubjectSideBar';
// import QuizzDetailCard from './Components/QuizzDetailCard';
// import QuizInstructionSection from './Components/QuizInstructionSection';
// import QuizQuestions from './Components/QuizQuestions';
// import QuestionDetailCard from './Components/QuestionDetailCard';
// import QuizResults from './Components/QuizResults';
// import QuizResultSummary from './Components/QuizResultSummary';
// import Tabs from './Components/Tabs';

// const MainSection = ({ quiz }) => { // Accepting quiz prop
//   const { quizId } = useParams()
//   const [activeTab, setActiveTab] = useState('instructions');
//   const [selectedOptions, setSelectedOptions] = useState({});
//   const [totalTime, setTotalTime] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [quizStarted, setQuizStarted] = useState(false);
//   const [quizSubmitted, setQuizSubmitted] = useState(false);
//   const [quizResults, setQuizResults] = useState({ totalPoints: 0, correctAnswers: 0, wrongAnswers: 0 });
//   const [attemptHistory, setAttemptHistory] = useState([]);
//   // const quizDuration =  3665;  // Use provided quiz duration or default
//   console.log("quiz in main sectib 1",quiz)
 
//   const { timeLimit } = quiz; // Extract timeLimit from quiz
//   const quizDuration = timeLimit * 60; // Convert timeLimit to seconds
  
//   const startTimer = () => {
//     setTimeLeft(quizDuration);
//     setTotalTime(quizDuration);
//     setQuizStarted(true);
//   };

//   useEffect(() => {
//     let timer;
//     if (quizStarted && timeLeft > 0) {
//       timer = setInterval(() => {
//         setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
//       }, 1000);
//     }

//     return () => clearInterval(timer);
//   }, [quizStarted, timeLeft]);

//   const handleOptionChange = (questionIndex, selectedOption) => {
//     setSelectedOptions((prev) => ({
//       ...prev,
//       [questionIndex]: selectedOption,
//     }));
//   };

//   const handleSubmit = () => {
//     let totalPoints = 0;
//     let correctAnswers = 0;
//     let wrongAnswers = 0;
//     const questionsWithSelectedOptions = quiz.questions.map((question, index) => {
//       console.log("Question data:", question);

//       const correctOption = question.options.find((option) => option.isCorrect);
//       console.log("Correct option:", correctOption);

//       const selectedOption = selectedOptions[index];
//       // const isCorrect = selectedOption === correctOption.value;
//       const isCorrect = correctOption && selectedOption === correctOption.value;

//       if (selectedOption) {
//         if (isCorrect) {
//           correctAnswers += 1;
//           totalPoints += question.points;
//         } else {
//           wrongAnswers += 1;
//         }
//       }

//       return {
//         ...question,
//         selectedOption,
//          isCorrect,
//         correctOption: correctOption ? correctOption.value : null,
//       };
//     });

//     const attemptNumber = attemptHistory.length + 1;
//     const newAttempt = {
//       attemptNumber,
//       totalPoints,
//       correctAnswers,
//       wrongAnswers,
//       questions: questionsWithSelectedOptions,
//     };

//     setAttemptHistory((prev) => [...prev, newAttempt]);
//     setQuizResults(newAttempt);
//     setQuizSubmitted(true);
//     setQuizStarted(false); // Stop the timer
//   };

//   const handleTabChange = (tab) => {
//     if (tab === 'questions') {
//       if (quizSubmitted) {
//         setSelectedOptions({});
//         setQuizSubmitted(false);
//         setTimeLeft(quizDuration);
//         setQuizResults({ totalPoints: 0, correctAnswers: 0, wrongAnswers: 0 });
//       }
//       if (!quizStarted) {
//         startTimer();
//       }
//     }
//     setActiveTab(tab);
//   };

//   const hasAttempted = attemptHistory.length > 0;

//   return (
//     <div className="flex">
//       <SubjectSideBar />
//       <div className="w-[65%] border-x">
//         <Tabs
//           activeTab={activeTab}
//           setActiveTab={handleTabChange}
//           onTabChange={handleTabChange}
//           quizSubmitted={quizSubmitted}
//           hasAttempted={hasAttempted}
//           quiz={quiz}
//         >
//           {(activeTab) => (
//             <div className='h-full'>
//               {activeTab === 'instructions' && (
//                 <Suspense fallback={<div>Loading...</div>}>
//                   <QuizInstructionSection quiz={quiz} />
//                 </Suspense>
//               )}
//               {activeTab === 'questions' && (
//                 <Suspense fallback={<div>Loading...</div>}>
//                   {!quizSubmitted ? (
//                     <>
//                       <QuizQuestions
//                         questions={quiz.questions}
//                         selectedOptions={selectedOptions}
//                         handleOptionChange={handleOptionChange}
//                       />
//                       <button
//                         onClick={handleSubmit}
//                         className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md"
//                       >
//                         Submit All
//                       </button>
//                     </>
//                   ) : (
//                     <QuizResults questions={quiz.questions} selectedOptions={selectedOptions} />
//                   )}
//                 </Suspense>
//               )}
//             </div>
//           )}
//         </Tabs>
//       </div>
//       <div className="w-[30%]">
//         {activeTab === 'instructions' && <QuizzDetailCard  quiz={quiz} />}
//         {activeTab === 'questions' && !quizSubmitted && (
//           <QuestionDetailCard timeLeft={timeLeft} totalTime={totalTime} quiz={quiz}   />
//         )}
//         {activeTab === 'questions' && quizSubmitted && (
//           <QuizResultSummary 
//             totalPoints={quizResults.totalPoints}
//             correctAnswers={quizResults.correctAnswers}
//             wrongAnswers={quizResults.wrongAnswers}
//             attemptHistory={attemptHistory}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default MainSection;
//------------------------- ☝️ -------------------------------

// import React, { useState, Suspense, useEffect } from 'react';
// import SubjectSideBar from '../../Component/SubjectSideBar';
// import QuizzDetailCard from './Components/QuizzDetailCard';
// import QuizInstructionSection from './Components/QuizInstructionSection';
// import QuizQuestions from './Components/QuizQuestions';
// import QuestionDetailCard from './Components/QuestionDetailCard';
// import QuizResults from './Components/QuizResults';
// import QuizResultSummary from './Components/QuizResultSummary';
// import Tabs from './Components/Tabs';
// import { useParams } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// const MainSection = ({ quiz }) => {
//   console.log("quiz us ",quiz)
//   const  quizId  = quiz._id;
//   console.log("quizId us ",quizId)

//   const { selectedClass, selectedSection, selectedSubject, studentId } = useSelector((state) => state.Common);
//   const [activeTab, setActiveTab] = useState('instructions');
//   const [selectedOptions, setSelectedOptions] = useState({});
//   const [totalTime, setTotalTime] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [quizStarted, setQuizStarted] = useState(false);
//   const [quizSubmitted, setQuizSubmitted] = useState(false);
//   const [quizResults, setQuizResults] = useState({ totalPoints: 0, correctAnswers: 0, wrongAnswers: 0 });
//   const [attemptHistory, setAttemptHistory] = useState([]);
  
//   const { timeLimit } = quiz;
//   const quizDuration = timeLimit * 60;

//   const startTimer = () => {
//     setTimeLeft(quizDuration);
//     setTotalTime(quizDuration);
//     setQuizStarted(true);
//   };

//   useEffect(() => {
//     let timer;
//     if (quizStarted && timeLeft > 0) {
//       timer = setInterval(() => {
//         setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
//       }, 1000);
//     }

//     return () => clearInterval(timer);
//   }, [quizStarted, timeLeft]);

//   useEffect(() => {
//     const fetchAttemptHistory = async () => {
//       try {
//         const token = localStorage.getItem('student:token');
//         if (!token) {
//           throw new Error('Authentication token not found');
//         }

//         const response = await fetch(`http://localhost:8080/student/studentquiz/${quizId}/attempt`, {
//           headers: {
//             'Authorization': token,
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`Failed to fetch attempt history, status: ${response.status}`);
//         }

//         const data = await response.json();
//         if (data.success && data.submission) {
//           setAttemptHistory(data.submission);
//         } else {
//           console.error("No attempt history data or unsuccessful response");
//         }
//       } catch (error) {
//         console.error("Failed to fetch attempt history:", error);
//       }
//     };

//     fetchAttemptHistory();
//   }, [quizId]);

//   const handleOptionChange = (questionIndex, selectedOption) => {
//     setSelectedOptions((prev) => ({
//       ...prev,
//       [questionIndex]: selectedOption,
//     }));
//   };

//   const handleSubmit = () => {
//     let totalPoints = 0;
//     let correctAnswers = 0;
//     let wrongAnswers = 0;
//     const questionsWithSelectedOptions = quiz.questions.map((question, index) => {
//       const correctOption = question.options.find((option) => option.isCorrect);
//       const selectedOption = selectedOptions[index];
//       const isCorrect = correctOption && selectedOption === correctOption.value;

//       if (selectedOption) {
//         if (isCorrect) {
//           correctAnswers += 1;
//           totalPoints += question.points;
//         } else {
//           wrongAnswers += 1;
//         }
//       }

//       return {
//         ...question,
//         selectedOption,
//         isCorrect,
//         correctOption: correctOption ? correctOption.value : null,
//       };
//     });

//     const attemptNumber = attemptHistory.length + 1;
//     const newAttempt = {
//       attemptNumber,
//       totalPoints,
//       correctAnswers,
//       wrongAnswers,
//       questions: questionsWithSelectedOptions,
//     };

//     setAttemptHistory((prev) => [...prev, newAttempt]);
//     setQuizResults(newAttempt);
//     setQuizSubmitted(true);
//     setQuizStarted(false); // Stop the timer
//   };

//   const handleTabChange = (tab) => {
//     if (tab === 'questions') {
//       if (quizSubmitted) {
//         setSelectedOptions({});
//         setQuizSubmitted(false);
//         setTimeLeft(quizDuration);
//         setQuizResults({ totalPoints: 0, correctAnswers: 0, wrongAnswers: 0 });
//       }
//       if (!quizStarted) {
//         startTimer();
//       }
//     }
//     setActiveTab(tab);
//   };

//   const hasAttempted = attemptHistory.length > 0;

//   return (
//     <div className="flex">
//       <SubjectSideBar />
//       <div className="w-[65%] border-x">
//         <Tabs
//           activeTab={activeTab}
//           setActiveTab={handleTabChange}
//           onTabChange={handleTabChange}
//           quizSubmitted={quizSubmitted}
//           hasAttempted={hasAttempted}
//           quiz={quiz}
//         >
//           {(activeTab) => (
//             <div className='h-full'>
//               {activeTab === 'instructions' && (
//                 <Suspense fallback={<div>Loading...</div>}>
//                   <QuizInstructionSection quiz={quiz} />
//                 </Suspense>
//               )}
//               {activeTab === 'questions' && (
//                 <Suspense fallback={<div>Loading...</div>}>
//                   {!quizSubmitted ? (
//                     <>
//                       <QuizQuestions
//                         questions={quiz.questions}
//                         selectedOptions={selectedOptions}
//                         handleOptionChange={handleOptionChange}
//                       />
//                       <button
//                         onClick={handleSubmit}
//                         className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md"
//                       >
//                         Submit All
//                       </button>
//                     </>
//                   ) : (
//                     <QuizResults questions={quiz.questions} selectedOptions={selectedOptions} />
//                   )}
//                 </Suspense>
//               )}
//             </div>
//           )}
//         </Tabs>
//       </div>
//       <div className="w-[30%]">
//         {activeTab === 'instructions' && <QuizzDetailCard quiz={quiz} />}
//         {activeTab === 'questions' && !quizSubmitted && (
//           <QuestionDetailCard timeLeft={timeLeft} totalTime={totalTime} quiz={quiz} />
//         )}
//         {activeTab === 'questions' && quizSubmitted && (
//           <QuizResultSummary
//             totalPoints={quizResults.totalPoints}
//             correctAnswers={quizResults.correctAnswers}
//             wrongAnswers={quizResults.wrongAnswers}
//             attemptHistory={attemptHistory}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default MainSection;

///--------------------   with add attempt number  ----------

import React, { useState, Suspense, useEffect ,useCallback} from 'react';
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

  // useEffect(() => {
  //   let timer;
  //   if (quizStarted && timeLeft > 0) {
  //     timer = setInterval(() => {
  //       setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
  //     }, 1000);
  //   }

  //   return () => clearInterval(timer);
  // }, [quizStarted, timeLeft]);

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

        // Assuming you want to get all attempts, you need to modify the backend to handle fetching all attempts
        // or fetch attempts one by one by looping through the allowed attempts.
        const attemptNumber = 1; // Start with the first attempt for example
        // const response = await fetch(`http://localhost:8080/student/studentquiz/${quizId}/attempt/${attemptNumber}`, {
        const response = await fetch(`http://localhost:8080/student/studentquiz/${quizId}/attempt`, {
          headers: {
            'Authorization': token,
          },
        });
// console.log(`http://localhost:8080/student/studentquiz/${quizId}/attempt/${attemptNumber}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch attempt history, status: ${response.status}`);
        }

        const data = await response.json();


        console.log("atttempt data" ,data)
        if (data.success && data.submission) {
          setAttemptHistory(data.submission);
        } else {
          console.error("No attempt history data or unsuccessful response");
        }
      } catch (error) {
        console.error("Failed to fetch attempt history:", error);
      }
    };

    fetchAttemptHistory();
  }, [quizId]);


  const submitQuiz = async (answers, timeTaken) => {
    console.log("answers⌚⌚",answers)
    console.log("timeTaken",timeTaken)
    try {
     
      const token = localStorage.getItem('student:token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`http://localhost:8080/student/studentquiz/submit/${quizId}`, {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentAnswers: answers, timeTaken }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Quiz submitted successfully:', data);
        setQuizSubmitted(true);
        setQuizResults({
          totalPoints: data.score,
          correctAnswers: data.rightAnswer,
          wrongAnswers: data.wrongAnswer,
        });

        // Update the attempt history with the new submission
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
        console.error('Failed to submit quiz:', data.msg);
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


  // const submitQuiz = async (answers, timeTaken) => {
  //   try {
  //     const token = localStorage.getItem('student:token');
  //     if (!token) {
  //       throw new Error('Authentication token not found');
  //     }

  //     const response = await fetch(`http://localhost:8080/student/studentquiz/submit/${quizId}`, {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': token,
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ studentAnswers: answers, timeTaken }),
  //     });

  //     const data = await response.json();
  //     if (response.ok) {
  //       console.log('Quiz submitted successfully:', data);
  //       setQuizSubmitted(true);
  //       setQuizResults({
  //         totalPoints: data.score,
  //         correctAnswers: data.rightAnswer,
  //         wrongAnswers: data.wrongAnswer,
  //       });
  //     } else {
  //       console.error('Failed to submit quiz:', data.msg);
  //     }
  //   } catch (error) {
  //     console.error('Error submitting quiz:', error);
  //   }
  // };


  // const handleSubmit = () => {

  //   console.log("🔖🔖🔖🔖handlebutton is clcikendd 📌📌📌📌📌📌")
  //   let totalPoints = 0;
  //   let correctAnswers = 0;
  //   let wrongAnswers = 0;
  //   const questionsWithSelectedOptions = quiz.questions.map((question, index) => {
  //     const correctOption = question.options.find((option) => option.isCorrect);
  //     const selectedOption = selectedOptions[index];
  //     const isCorrect = correctOption && selectedOption === correctOption.value;

  //     if (selectedOption) {
  //       if (isCorrect) {
  //         correctAnswers += 1;
  //         totalPoints += question.points;
  //       } else {
  //         wrongAnswers += 1;
  //       }
  //     }
  //     return {
  //       questionId: question._id,
  //       selectedOption,
  //       isCorrect,
  //     };
  //     // return {
  //     //   ...question,
  //     //   selectedOption,
  //     //   isCorrect,
  //     //   correctOption: correctOption ? correctOption.value : null,
  //     // };
  //   });

  //   // const attemptNumber = attemptHistory?.length + 1;
  //   const newAttempt = {
  //     attemptNumber: attemptHistory.length + 1,
  //     totalPoints,
  //     correctAnswers,
  //     wrongAnswers,
  //     questions: questionsWithSelectedOptions,
  //   };
  //   setQuizResults(newAttempt);
  //   setQuizSubmitted(true);
  //   setQuizStarted(false); // Stop the timer
   
    
  //       // Call submitQuiz function with selected options and time taken

  //   submitQuiz(questionsWithSelectedOptions, totalTime - timeLeft);
  //   setAttemptHistory((prev) => [...prev, newAttempt]);

  // };


  const handleSubmit = useCallback(() => {
    console.log('🔖🔖🔖🔖handlebutton is clicked 📌📌📌📌📌📌');
    let totalPoints = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;
    const questionsWithSelectedOptions = quiz.questions.map((question, index) => {
      const correctOption = question.options.find((option) => option.isCorrect);
      console.log("🛜correctOption:🛜", correctOption);

      const selectedOption = selectedOptions[index];
      console.log("🛜selectedOption:🛜", selectedOption);

      // const isCorrect = correctOption && selectedOption === correctOption.value;
      const isCorrect = selectedOption && selectedOption === question.correctAnswer;
      // console.log("Question data💻:", isCorrect);
  
      console.log("🛜isCorrect:🛜", isCorrect);




      if (selectedOption) {
        if (isCorrect) {
          correctAnswers += 1;
          // totalPoints += question.points;
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

  const handleTabChange = useCallback((tab) => {
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
  }, [quizSubmitted, quizDuration, quizStarted]);
  // const handleTabChange = (tab) => {
  //   if (tab === 'questions') {
  //     if (quizSubmitted) {
  //       setSelectedOptions({});
  //       setQuizSubmitted(false);
  //       setTimeLeft(quizDuration);
  //       setQuizResults({ totalPoints: 0, correctAnswers: 0, wrongAnswers: 0 });
  //     }
  //     if (!quizStarted) {
  //       startTimer();
  //     }
  //   }
  //   setActiveTab(tab);
  // };

  const hasAttempted = attemptHistory.length > 0;
  console.log('MainSection Rendered: ', {
    activeTab,
    selectedOptions,
    totalTime,
    timeLeft,
    quizStarted,
    quizSubmitted,
    quizResults,
    attemptHistory,
  });
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



//----------------- upper waala sahi idhar usecall  ---------------------

// import React, { useState, useEffect, useCallback,Suspense } from 'react';
// import SubjectSideBar from '../../Component/SubjectSideBar';
// import QuizzDetailCard from './Components/QuizzDetailCard';
// import QuizInstructionSection from './Components/QuizInstructionSection';
// import QuizQuestions from './Components/QuizQuestions';
// import QuestionDetailCard from './Components/QuestionDetailCard';
// import QuizResults from './Components/QuizResults';
// import QuizResultSummary from './Components/QuizResultSummary';
// import Tabs from './Components/Tabs';
// import { useSelector } from 'react-redux';

// const MainSection = ({ quiz }) => {
//   const quizId = quiz._id;
//   const { selectedClass, selectedSection, selectedSubject, studentId } = useSelector((state) => state.Common);
//   const [activeTab, setActiveTab] = useState('instructions');
//   const [selectedOptions, setSelectedOptions] = useState({});
//   const [totalTime, setTotalTime] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [quizStarted, setQuizStarted] = useState(false);
//   const [quizSubmitted, setQuizSubmitted] = useState(false);
//   const [quizResults, setQuizResults] = useState({ totalPoints: 0, correctAnswers: 0, wrongAnswers: 0 });
//   const [attemptHistory, setAttemptHistory] = useState([]);
  
//   const { timeLimit } = quiz;
//   const quizDuration = timeLimit * 60;

//   const startTimer = () => {
//     setTimeLeft(quizDuration);
//     setTotalTime(quizDuration);
//     setQuizStarted(true);
//   };

//   useEffect(() => {
//     let timer;
//     if (quizStarted && timeLeft > 0) {
//       timer = setInterval(() => {
//         setTimeLeft((prevTime) => {
//           if (prevTime <= 1) {
//             clearInterval(timer);
//             setQuizStarted(false);
//             handleSubmit();  // Automatically submit when timer reaches 0
//             return 0;
//           }
//           return prevTime - 1;
//         });
//       }, 1000);
//     }

//     return () => clearInterval(timer);
//   }, [quizStarted]);

//   useEffect(() => {
//     const fetchAttemptHistory = async () => {
//       try {
//         const token = localStorage.getItem('student:token');
//         if (!token) {
//           throw new Error('Authentication token not found');
//         }

//         const response = await fetch(`http://localhost:8080/student/studentquiz/${quizId}/attempt`, {
//           headers: {
//             'Authorization': token,
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`Failed to fetch attempt history, status: ${response.status}`);
//         }

//         const data = await response.json();

//         if (data.success && data.submission) {
//           setAttemptHistory(data.submission);
//         } else {
//           console.error("No attempt history data or unsuccessful response");
//         }
//       } catch (error) {
//         console.error("Failed to fetch attempt history:", error);
//       }
//     };

//     fetchAttemptHistory();
//   }, [quizId]);

//   const submitQuiz = async (answers, timeTaken) => {
//     try {
//       const token = localStorage.getItem('student:token');
//       if (!token) {
//         throw new Error('Authentication token not found');
//       }

//       const response = await fetch(`http://localhost:8080/student/studentquiz/submit/${quizId}`, {
//         method: 'POST',
//         headers: {
//           'Authorization': token,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ studentAnswers: answers, timeTaken }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         console.log('Quiz submitted successfully:', data);
//         setQuizSubmitted(true);
//         setQuizResults({
//           totalPoints: data.score,
//           correctAnswers: data.rightAnswer,
//           wrongAnswers: data.wrongAnswer,
//         });

//         // Update the attempt history with the new submission
//         setAttemptHistory(prev => [
//           ...prev,
//           {
//             attempts: prev.length + 1,
//             score: data.score,
//             rightAnswer: data.rightAnswer,
//             wrongAnswer: data.wrongAnswer,
//             questions: answers,
//           }
//         ]);
//       } else {
//         console.error('Failed to submit quiz:', data.msg);
//       }
//     } catch (error) {
//       console.error('Error submitting quiz:', error);
//     }
//   };

//   const handleOptionChange = useCallback((questionIndex, selectedOption) => {
//     setSelectedOptions((prev) => ({
//       ...prev,
//       [questionIndex]: selectedOption,
//     }));
//   }, []);

//   const handleSubmit = useCallback(() => {
//     console.log("🔖🔖🔖🔖handlebutton is clcikendd 📌📌📌📌📌📌")

//     let totalPoints = 0;
//     let correctAnswers = 0;
//     let wrongAnswers = 0;
//     const questionsWithSelectedOptions = quiz.questions.map((question, index) => {
//       const correctOption = question.options.find((option) => option.isCorrect);
//       const selectedOption = selectedOptions[index];
//       const isCorrect = correctOption && selectedOption === correctOption.value;

//       if (selectedOption) {
//         if (isCorrect) {
//           correctAnswers += 1;
//           totalPoints += question.points;
//         } else {
//           wrongAnswers += 1;
//         }
//       }
//       return {
//         questionId: question._id,
//         selectedOption,
//         isCorrect,
//       };
//     });

//     const newAttempt = {
//       attemptNumber: attemptHistory.length + 1,
//       totalPoints,
//       correctAnswers,
//       wrongAnswers,
//       questions: questionsWithSelectedOptions,
//     };

//     setAttemptHistory((prev) => [...prev, newAttempt]);
//     setQuizResults(newAttempt);
//     setQuizSubmitted(true);
//     setQuizStarted(false); // Stop the timer
//     submitQuiz(questionsWithSelectedOptions, totalTime - timeLeft);
//   }, [selectedOptions, attemptHistory, quiz.questions, submitQuiz, totalTime, timeLeft]);

//   const handleTabChange = useCallback((tab) => {
//     if (tab === 'questions') {
//       if (quizSubmitted) {
//         setSelectedOptions({});
//         setQuizSubmitted(false);
//         setTimeLeft(quizDuration);
//         setQuizResults({ totalPoints: 0, correctAnswers: 0, wrongAnswers: 0 });
//       }
//       if (!quizStarted) {
//         startTimer();
//       }
//     }
//     setActiveTab(tab);
//   }, [quizSubmitted, quizDuration, quizStarted, startTimer]);

//   const hasAttempted = attemptHistory.length > 0;

//   console.log('MainSection Rendered: ', {
//     activeTab,
//     selectedOptions,
//     totalTime,
//     timeLeft,
//     quizStarted,
//     quizSubmitted,
//     quizResults,
//     attemptHistory,
//   });

//   return (
//     <div className="flex">
//       <SubjectSideBar />
//       <div className="w-[65%] border-x">
//         <Tabs
//           activeTab={activeTab}
//           setActiveTab={handleTabChange}
//           onTabChange={handleTabChange}
//           quizSubmitted={quizSubmitted}
//           hasAttempted={hasAttempted}
//           quiz={quiz}
//         >
//           {(activeTab) => (
//             <div className='h-full'>
//               {activeTab === 'instructions' && (
//                 <Suspense fallback={<div>Loading...</div>}>
//                   <QuizInstructionSection quiz={quiz} />
//                 </Suspense>
//               )}
//               {activeTab === 'questions' && (
//                 <Suspense fallback={<div>Loading...</div>}>
//                   {!quizSubmitted ? (
//                     <>
//                       <QuizQuestions
//                         questions={quiz.questions}
//                         selectedOptions={selectedOptions}
//                         handleOptionChange={handleOptionChange}
//                       />
//                       <button
//                         onClick={handleSubmit}
//                         className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md"
//                       >
//                         Submit All
//                       </button>
//                     </>
//                   ) : (
//                     <QuizResults questions={quiz.questions} selectedOptions={selectedOptions} />
//                   )}
//                 </Suspense>
//               )}
//             </div>
//           )}
//         </Tabs>
//       </div>
//       <div className="w-[30%]">
//         {activeTab === 'instructions' && <QuizzDetailCard quiz={quiz} />}
//         {activeTab === 'questions' && !quizSubmitted && (
//           <QuestionDetailCard timeLeft={timeLeft} totalTime={totalTime} quiz={quiz} />
//         )}
//         {activeTab === 'questions' && quizSubmitted && (
//           <QuizResultSummary
//             totalPoints={quizResults.totalPoints}
//             correctAnswers={quizResults.correctAnswers}
//             wrongAnswers={quizResults.wrongAnswers}
//             attemptHistory={attemptHistory}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default MainSection;


//------------------     With redux  -------------------------------------

// import React, { useEffect, Suspense } from 'react';
// import SubjectSideBar from '../../Component/SubjectSideBar';
// import QuizzDetailCard from './Components/QuizzDetailCard';
// import QuizInstructionSection from './Components/QuizInstructionSection';
// import QuizQuestions from './Components/QuizQuestions';
// import QuestionDetailCard from './Components/QuestionDetailCard';
// import QuizResults from './Components/QuizResults';
// import QuizResultSummary from './Components/QuizResultSummary';
// import Tabs from './Components/Tabs';
// import { useSelector, useDispatch } from 'react-redux';
// import {
//   fetchAttemptHistory,
//   submitQuiz,
//   setSelectedOptions,
//   setQuizStarted,
//   setQuizSubmitted,
//   setTimeLeft,
//   setTotalTime,
//   setActiveTab,
//   addAttemptHistory,
//   setQuizResults,
//   setQuiz,
// } from '../../../../../../Redux/Slices/StudentQuiz/StudentQuizSlice';

// const MainSection = ({ quiz }) => {
//   const quizId = quiz._id;
//   const dispatch = useDispatch();
//   const {
//     attemptHistory,
//     quizResults,
//     selectedOptions,
//     quizSubmitted,
//     quizStarted,
//     timeLeft,
//     totalTime,
//     activeTab,
//   } = useSelector((state) => state.StudentQuiz);

//   const { selectedClass, selectedSection, selectedSubject, studentId } = useSelector((state) => state.Common);
//   const quizDuration = quiz.timeLimit * 60;

//   const startTimer = () => {
//     dispatch(setTimeLeft(quizDuration));
//     dispatch(setTotalTime(quizDuration));
//     dispatch(setQuizStarted(true));
//   };

//   useEffect(() => {
//     let timer;
//     if (quizStarted && timeLeft > 0) {
//       timer = setInterval(() => {
//         dispatch(setTimeLeft(timeLeft > 0 ? timeLeft - 1 : 0));
//       }, 1000);
//     }
//     return () => clearInterval(timer);
//   }, [quizStarted, timeLeft, dispatch]);

//   useEffect(() => {
//     dispatch(fetchAttemptHistory(quizId));
//   }, [quizId, dispatch]);

//   const handleOptionChange = (questionIndex, selectedOption) => {
//     dispatch(setSelectedOptions({ ...selectedOptions, [questionIndex]: selectedOption }));
//   };

//   const handleSubmit = () => {
//     let totalPoints = 0;
//     let correctAnswers = 0;
//     let wrongAnswers = 0;

//     const questionsWithSelectedOptions = quiz.questions.map((question, index) => {
//       const correctOption = question.options.find((option) => option.isCorrect);
//       const selectedOption = selectedOptions[index];
//       const isCorrect = correctOption && selectedOption === correctOption.value;

//       if (selectedOption) {
//         if (isCorrect) {
//           correctAnswers += 1;
//           totalPoints += question.points;
//         } else {
//           wrongAnswers += 1;
//         }
//       }
//       return {
//         questionId: question._id,
//         selectedOption,
//         isCorrect,
//       };
//     });

//     const newAttempt = {
//       attemptNumber: attemptHistory.length + 1,
//       totalPoints,
//       correctAnswers,
//       wrongAnswers,
//       questions: questionsWithSelectedOptions,
//     };

//     dispatch(addAttemptHistory(newAttempt));
//     dispatch(setQuizResults(newAttempt));
//     dispatch(setQuizSubmitted(true));
//     dispatch(setQuizStarted(false));

//     dispatch(submitQuiz({ quizId, answers: questionsWithSelectedOptions, timeTaken: totalTime - timeLeft }));
//   };

//   const handleTabChange = (tab) => {
//     if (tab === 'questions') {
//       if (quizSubmitted) {
//         dispatch(setSelectedOptions({}));
//         dispatch(setQuizSubmitted(false));
//         dispatch(setTimeLeft(quizDuration));
//         dispatch(setQuizResults({ totalPoints: 0, correctAnswers: 0, wrongAnswers: 0 }));
//       }
//       if (!quizStarted) {
//         startTimer();
//       }
//     }
//     dispatch(setActiveTab(tab));
//   };

//   const hasAttempted = attemptHistory.length > 0;

//   return (
//     <div className="flex">
//       <SubjectSideBar />
//       <div className="w-[65%] border-x">
//         <Tabs
//           activeTab={activeTab}
//           setActiveTab={handleTabChange}
//           onTabChange={handleTabChange}
//           quizSubmitted={quizSubmitted}
//           hasAttempted={hasAttempted}
//           quiz={quiz}
//         >
//           {(activeTab) => (
//             <div className='h-full'>
//               {activeTab === 'instructions' && (
//                 <Suspense fallback={<div>Loading...</div>}>
//                   <QuizInstructionSection quiz={quiz} />
//                 </Suspense>
//               )}
//               {activeTab === 'questions' && (
//                 <Suspense fallback={<div>Loading...</div>}>
//                   {!quizSubmitted ? (
//                     <>
//                       <QuizQuestions
//                         questions={quiz.questions}
//                         selectedOptions={selectedOptions}
//                         handleOptionChange={handleOptionChange}
//                       />
//                       <button
//                         onClick={handleSubmit}
//                         className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md"
//                       >
//                         Submit All
//                       </button>
//                     </>
//                   ) : (
//                     <QuizResults questions={quiz.questions} selectedOptions={selectedOptions} />
//                   )}
//                 </Suspense>
//               )}
//             </div>
//           )}
//         </Tabs>
//       </div>
//       <div className="w-[30%]">
//         {activeTab === 'instructions' && <QuizzDetailCard quiz={quiz} />}
//         {activeTab === 'questions' && !quizSubmitted && (
//           <QuestionDetailCard timeLeft={timeLeft} totalTime={totalTime} quiz={quiz} />
//         )}
//         {activeTab === 'questions' && quizSubmitted && (
//           <QuizResultSummary
//             totalPoints={quizResults.totalPoints}
//             correctAnswers={quizResults.correctAnswers}
//             wrongAnswers={quizResults.wrongAnswers}
//             attemptHistory={attemptHistory}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// const MainSection = ({ quiz }) => {
//   const dispatch = useDispatch();
  
//   const {
//     attemptHistory,
//     quizResults,
//     selectedOptions,
//     quizSubmitted,
//     quizStarted,
//     timeLeft,
//     totalTime,
//     activeTab,
//     quiz: reduxQuiz,
//   } = useSelector((state) => state.StudentQuiz);

//   useEffect(() => {
//     dispatch(setQuiz(quiz)); // Set the quiz in the Redux store
//   }, [dispatch, quiz]);

//   useEffect(() => {
//     if (reduxQuiz) {
//       dispatch(fetchAttemptHistory(reduxQuiz._id));
//     }
//   }, [reduxQuiz, dispatch]);

//   const quizDuration = reduxQuiz ? reduxQuiz.timeLimit * 60 : 0;

//   const startTimer = () => {
//     dispatch(setTimeLeft(quizDuration));
//     dispatch(setTotalTime(quizDuration));
//     dispatch(setQuizStarted(true));
//   };

//   // useEffect(() => {
//   //   let timer;
//   //   if (quizStarted && timeLeft > 0) {
//   //     timer = setInterval(() => {
//   //       dispatch(setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0))));
//   //     }, 1000);
//   //   }
//   //   return () => clearInterval(timer);
//   // }, [quizStarted, timeLeft, dispatch]);
// useEffect(()=>{
// let timer
// if(quizStarted && timeLeft > 0){
// timer=setInterval(()=>{
//   dispatch(setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0)))
// },1000)

// }
// },[quizStarted, timeLeft, dispatch])
//   const handleOptionChange = (questionIndex, selectedOption) => {
//     dispatch(setSelectedOptions({ ...selectedOptions, [questionIndex]: selectedOption }));
//   };

//   const handleSubmit = () => {
//     let totalPoints = 0;
//     let correctAnswers = 0;
//     let wrongAnswers = 0;

//     const questionsWithSelectedOptions = reduxQuiz.questions.map((question, index) => {
//       const correctOption = question.options.find((option) => option.isCorrect);
//       const selectedOption = selectedOptions[index];
//       const isCorrect = correctOption && selectedOption === correctOption.value;

//       if (selectedOption) {
//         if (isCorrect) {
//           correctAnswers += 1;
//           totalPoints += question.points;
//         } else {
//           wrongAnswers += 1;
//         }
//       }
//       return {
//         questionId: question._id,
//         selectedOption,
//         isCorrect,
//       };
//     });

//     const newAttempt = {
//       attemptNumber: attemptHistory.length + 1,
//       totalPoints,
//       correctAnswers,
//       wrongAnswers,
//       questions: questionsWithSelectedOptions,
//     };

//     dispatch(addAttemptHistory(newAttempt));
//     dispatch(setQuizResults(newAttempt));
//     dispatch(setQuizSubmitted(true));
//     dispatch(setQuizStarted(false));

//     dispatch(submitQuiz({ quizId: reduxQuiz._id, answers: questionsWithSelectedOptions, timeTaken: totalTime - timeLeft }));
//   };

//   const handleTabChange = (tab) => {
//     if (tab === 'questions') {
//       if (quizSubmitted) {
//         dispatch(setSelectedOptions({}));
//         dispatch(setQuizSubmitted(false));
//         dispatch(setTimeLeft(quizDuration));
//         dispatch(setQuizResults({ totalPoints: 0, correctAnswers: 0, wrongAnswers: 0 }));
//       }
//       if (!quizStarted) {
//         startTimer();
//       }
//     }
//     dispatch(setActiveTab(tab));
//   };

//   const hasAttempted = attemptHistory.length > 0;

//   if (!reduxQuiz) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="flex">
//       <SubjectSideBar />
//       <div className="w-[65%] border-x">
//         <Tabs
//           activeTab={activeTab}
//           setActiveTab={handleTabChange}
//           onTabChange={handleTabChange}
//           quizSubmitted={quizSubmitted}
//           hasAttempted={hasAttempted}
//           quiz={reduxQuiz}
//         >
//           {(activeTab) => (
//             <div className='h-full'>
//               {activeTab === 'instructions' && (
//                 <Suspense fallback={<div>Loading...</div>}>
//                   <QuizInstructionSection quiz={reduxQuiz} />
//                 </Suspense>
//               )}
//               {activeTab === 'questions' && (
//                 <Suspense fallback={<div>Loading...</div>}>
//                   {!quizSubmitted ? (
//                     <>
//                       <QuizQuestions
//                         questions={reduxQuiz.questions}
//                         selectedOptions={selectedOptions}
//                         handleOptionChange={handleOptionChange}
//                       />
//                       <button
//                         onClick={handleSubmit}
//                         className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md"
//                       >
//                         Submit All
//                       </button>
//                     </>
//                   ) : (
//                     <QuizResults questions={reduxQuiz.questions} selectedOptions={selectedOptions} />
//                   )}
//                 </Suspense>
//               )}
//             </div>
//           )}
//         </Tabs>
//       </div>
//       <div className="w-[30%]">
//         {activeTab === 'instructions' && <QuizzDetailCard quiz={reduxQuiz} />}
//         {activeTab === 'questions' && !quizSubmitted && (
//           <QuestionDetailCard timeLeft={timeLeft} totalTime={totalTime} quiz={reduxQuiz} />
//         )}
//         {activeTab === 'questions' && quizSubmitted && (
//           <QuizResultSummary />
//         )}
//       </div>
//     </div>
//   );
// };


// export default MainSection;


//-------------------------------------------------------

// /------- using  usememo and callnacl-----


// import React, { useState, Suspense, useEffect, useMemo, useCallback } from 'react';
// import SubjectSideBar from '../../Component/SubjectSideBar';
// import QuizzDetailCard from './Components/QuizzDetailCard';
// import QuizInstructionSection from './Components/QuizInstructionSection';
// import QuizQuestions from './Components/QuizQuestions';
// import QuestionDetailCard from './Components/QuestionDetailCard';
// import QuizResults from './Components/QuizResults';
// import QuizResultSummary from './Components/QuizResultSummary';
// import Tabs from './Components/Tabs';

// const MainSection = ({ quiz }) => {


//   const { timeLimit } = quiz; // Extract timeLimit from quiz
//   const quizDuration = useMemo(() => timeLimit * 60, [timeLimit]); // Convert timeLimit to seconds and memoize it

//   const [activeTab, setActiveTab] = useState('instructions');
//   const [selectedOptions, setSelectedOptions] = useState({});
//   const [totalTime, setTotalTime] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [quizStarted, setQuizStarted] = useState(false);
//   const [quizSubmitted, setQuizSubmitted] = useState(false);
//   const [quizResults, setQuizResults] = useState({ totalPoints: 0, correctAnswers: 0, wrongAnswers: 0 });
//   const [attemptHistory, setAttemptHistory] = useState([]);
//   console.log("quiz in main sectib 1",quiz)

//   const startTimer = useCallback(() => {
//     setTimeLeft(quizDuration);
//     setTotalTime(quizDuration);
//     setQuizStarted(true);
//   }, [quizDuration]);

//   useEffect(() => {
//     let timer;
//     if (quizStarted && timeLeft > 0) {
//       timer = setInterval(() => {
//         setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
//       }, 1000);
//     }

//     return () => clearInterval(timer);
//   }, [quizStarted, timeLeft]);

//   const handleOptionChange = useCallback((questionIndex, selectedOption) => {
//     setSelectedOptions((prev) => ({
//       ...prev,
//       [questionIndex]: selectedOption,
//     }));
//   }, []);

//   const handleSubmit = useCallback(() => {
//     let totalPoints = 0;
//     let correctAnswers = 0;
//     let wrongAnswers = 0;
//     const questionsWithSelectedOptions = quiz.questions.map((question, index) => {
//       const correctOption = question.options.find((option) => option.isCorrect);
//       const selectedOption = selectedOptions[index];
//       const isCorrect = selectedOption === correctOption.value;

//       if (selectedOption) {
//         if (isCorrect) {
//           correctAnswers += 1;
//           totalPoints += question.points;
//         } else {
//           wrongAnswers += 1;
//         }
//       }

//       return {
//         ...question,
//         selectedOption,
//       };
//     });

//     const attemptNumber = attemptHistory.length + 1;
//     const newAttempt = {
//       attemptNumber,
//       totalPoints,
//       correctAnswers,
//       wrongAnswers,
//       questions: questionsWithSelectedOptions,
//     };

//     setAttemptHistory((prev) => [...prev, newAttempt]);
//     setQuizResults(newAttempt);
//     setQuizSubmitted(true);
//     setQuizStarted(false); // Stop the timer
//   }, [quiz.questions, selectedOptions, attemptHistory.length]);

//   const handleTabChange = useCallback((tab) => {
//     if (tab === 'questions') {
//       if (quizSubmitted) {
//         setSelectedOptions({});
//         setQuizSubmitted(false);
//         setTimeLeft(quizDuration);
//         setQuizResults({ totalPoints: 0, correctAnswers: 0, wrongAnswers: 0 });
//       }
//       if (!quizStarted) {
//         startTimer();
//       }
//     }
//     setActiveTab(tab);
//   }, [quizSubmitted, quizDuration, quizStarted, startTimer]);

//   const hasAttempted = useMemo(() => attemptHistory.length > 0, [attemptHistory.length]);

//   return (
//     <div className="flex">
//       <SubjectSideBar />
//       <div className="w-[65%] border-x">
//         <Tabs
//           activeTab={activeTab}
//           setActiveTab={handleTabChange}
//           onTabChange={handleTabChange}
//           quizSubmitted={quizSubmitted}
//           hasAttempted={hasAttempted}
//           quiz={quiz}
//         >
//           {(activeTab) => (
//             <div className='h-full'>
//               {activeTab === 'instructions' && (
//                 <Suspense fallback={<div>Loading...</div>}>
//                   <QuizInstructionSection quiz={quiz} />
//                 </Suspense>
//               )}
//               {activeTab === 'questions' && (
//                 <Suspense fallback={<div>Loading...</div>}>
//                   {!quizSubmitted ? (
//                     <>
//                       <QuizQuestions
//                         questions={quiz.questions}
//                         selectedOptions={selectedOptions}
//                         handleOptionChange={handleOptionChange}
//                       />
//                       <button
//                         onClick={handleSubmit}
//                         className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md"
//                       >
//                         Submit All
//                       </button>
//                     </>
//                   ) : (
//                     <QuizResults questions={quiz.questions} selectedOptions={selectedOptions} />
//                   )}
//                 </Suspense>
//               )}
//             </div>
//           )}
//         </Tabs>
//       </div>
//       <div className="w-[30%]">
//         {activeTab === 'instructions' && <QuizzDetailCard quiz={quiz} />}
//         {activeTab === 'questions' && !quizSubmitted && (
//           <QuestionDetailCard timeLeft={timeLeft} totalTime={totalTime} quiz={quiz} />
//         )}
//         {activeTab === 'questions' && quizSubmitted && (
//           <QuizResultSummary
//             totalPoints={quizResults.totalPoints}
//             correctAnswers={quizResults.correctAnswers}
//             wrongAnswers={quizResults.wrongAnswers}
//             attemptHistory={attemptHistory}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default MainSection;
