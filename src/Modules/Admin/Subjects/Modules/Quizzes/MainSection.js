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
import ProtectedSection from "../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../config/permission";

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

  return (
    <div className="flex h-full w-full">
      <SubjectSideBar />
      <div className="w-[65%] border-l min-h-screen">
        <Tabs
          onTabChange={setActiveTab}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
        >
          {(activeTab) => (
            <div className="h-full">
              {activeTab === "instructions" &&
                (loading ? (
                  <Spinner />
                ) : (
                  <ProtectedSection
                    title="Quiz Instruction"
                    requiredPermission={PERMISSIONS.QUIZ_BY_ID}
                  >
                    <QuizInstructionSection />
                  </ProtectedSection>
                ))}
              {activeTab === "questions" &&
                (loading ? (
                  <Spinner />
                ) : (
                  <ProtectedSection
                    title="Quiz Question"
                    requiredPermission={PERMISSIONS.QUIZ_BY_ID}
                  >
                    <QuizQuestions />
                  </ProtectedSection>
                ))}
            </div>
          )}
        </Tabs>
      </div>
      <div className="w-[30%] ">
        <ProtectedSection
          title="Quiz Detail"
          requiredPermission={PERMISSIONS.QUIZ_BY_ID}
        >
          <QuizzDetailCard />
        </ProtectedSection>
      </div>
    </div>
  );
};

export default MainSection;
