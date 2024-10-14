import React, { useState, useEffect } from "react";
import SubjectSideBar from "../../Component/SubjectSideBar";
import QuizzDetailCard from "./Components/QuizzDetailCard";
import QuizInstructionSection from "./Components/QuizInstructionSection";
import Tabs from "./Components/Tabs";
import QuizQuestions from "./Components/QuizQuestions";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuizByIdThunk } from "../../../../../Store/Slices/Admin/Class/Quiz/quizThunks"; // Use the thunk
import { useParams } from "react-router-dom";
import Spinner from "../../../../../Components/Common/Spinner";

const MainSection = () => {
  const [activeTab, setActiveTab] = useState("instructions");
  const { qid } = useParams();
  const dispatch = useDispatch();
  const { loading, quizzDetail: quiz } = useSelector(
    (state) => state.admin.quizzes
  );

  useEffect(() => {
    dispatch(fetchQuizByIdThunk(qid)); // Fetch quiz by ID
  }, [qid, dispatch]);

  const onRefresh = () => {
    dispatch(fetchQuizByIdThunk(qid)); // Refetch quiz
  };

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
              {activeTab === "instructions" &&
                (loading ? (
                  <Spinner />
                ) : (
                  <QuizInstructionSection content={quiz?.content} />
                ))}
              {activeTab === "questions" &&
                (loading ? (
                  <Spinner />
                ) : (
                  <QuizQuestions questions={quiz?.questions} />
                ))}
            </div>
          )}
        </Tabs>
      </div>
      <div className="w-[30%]">
        <QuizzDetailCard
          quiz={quiz}
          onRefresh={onRefresh}
          isPublish={quiz?.publish}
        />
      </div>
    </div>
  );
};

export default MainSection;
