import React, { useState, Suspense } from 'react';
import SubjectSideBar from '../../Component/SubjectSideBar';
import QuizzDetailCard from './Components/QuizzDetailCard';
import QuizInstructionSection from './Components/QuizInstructionSection';
import CreateQuizHeader from './Components/CreateQuizHeader';
import Tabs from './Components/Tabs';
import QuizQuestions from './Components/QuizQuestions';
import QuestionDetailCard from './Components/QuestionDetailCard';

const MainSection = () => {
  const [activeTab, setActiveTab] = useState('instructions');

  return (
    <div className="flex">
      <SubjectSideBar />
      <div className="w-[65%] border-x">
        <CreateQuizHeader />
        <Tabs onTabChange={setActiveTab}>
          {(activeTab) => (
            <>
              {activeTab === 'instructions' && (
                <Suspense fallback={<div>Loading...</div>}>
                  <QuizInstructionSection />
                </Suspense>
              )}
              {activeTab === 'questions' && (
                <Suspense fallback={<div>Loading...</div>}>
                  <QuizQuestions />
                </Suspense>
              )}
            </>
          )}
        </Tabs>
      </div>
      <div className="w-[30%]">
        {activeTab === 'instructions' && <QuizzDetailCard />}
        {activeTab === 'questions' && <QuestionDetailCard/>}
      </div>
    </div>
  );
};

export default MainSection;
