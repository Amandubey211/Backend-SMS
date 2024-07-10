import React, { useState, Suspense, useEffect } from "react";
import SubjectSideBar from "../../Component/SubjectSideBar";
import QuizzDetailCard from "./Components/QuizzDetailCard";
import QuizInstructionSection from "./Components/QuizInstructionSection";
import Tabs from "./Components/Tabs";
import QuizQuestions from "./Components/QuizQuestions";
import QuestionDetailCard from "./Components/QuestionDetailCard";
import useFetchQuizById from "../../../../../Hooks/AuthHooks/Staff/Admin/Quiz/useFetchQuizById";
import { useParams } from "react-router-dom";

const MainSection = () => {
  const [activeTab, setActiveTab] = useState("instructions");
  const { qid } = useParams();
  const { error, fetchQuizById, loading, quiz } = useFetchQuizById();

  useEffect(() => {
    fetchQuizById(qid);
  }, [qid, fetchQuizById]);

  return (
    <div className="flex">
      <SubjectSideBar />
      <div className="w-[65%] border-x">
        <Tabs
          onTabChange={setActiveTab}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          title={quiz?.name}
          availableFrom={quiz?.availableFrom}
        >
          {(activeTab) => (
            <div className="h-full">
              {activeTab === "instructions" && (
                <Suspense fallback={<div>Loading...</div>}>
                  {loading ? (
                    <div>Loading...</div>
                  ) : (
                    <QuizInstructionSection content={quiz?.content} />
                  )}
                </Suspense>
              )}
              {activeTab === "questions" && (
                <Suspense fallback={<div>Loading...</div>}>
                  {loading ? (
                    <div>Loading...</div>
                  ) : (
                    <QuizQuestions questions={quiz?.questions} />
                  )}
                </Suspense>
              )}
            </div>
          )}
        </Tabs>
      </div>
      <div className="w-[30%]">
        <QuizzDetailCard quiz={quiz} />
      </div>
    </div>
  );
};

export default MainSection;
