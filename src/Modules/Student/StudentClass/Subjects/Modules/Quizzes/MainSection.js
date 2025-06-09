/* src/Modules/Student/StudentClass/Subjects/Quizzes/MainSection.jsx */
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Alert, Steps, Button, message } from "antd"; // ⬅️ added `message`
import { motion } from "framer-motion";

import SubjectSideBar from "../../Component/SubjectSideBar";
import Tabs from "./Components/Tabs";
import QuizInstructionSection from "./Components/QuizInstructionSection";
import QuizzDetailCard from "./Components/QuizzDetailCard";
import QuestionDetailCard from "./Components/QuestionDetailCard";
import QuizResultSummary from "./Components/QuizResultSummary";

import { fetchAllAttemptHistory } from "../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Quizes/quizes.action";

const { Step } = Steps;

/* ---------------------------- sub-component ----------------------------- */
const QuizInstructions = ({ acknowledged, onAcknowledge, onTakeQuiz }) => (
  <Card title="Before Starting" bordered={false}>
    <Alert
      message="Important"
      description="Please read all instructions carefully before starting the quiz."
      type="info"
      showIcon
      className="mb-6"
    />

    <Steps direction="vertical" current={acknowledged ? 1 : 0} className="mb-6">
      <Step
        title="Read instructions"
        description="Make sure you understand all the rules and requirements."
      />
      <Step
        title="Acknowledge"
        description="Confirm that you're ready to begin."
      />
    </Steps>

    <Button
      block
      type="primary"
      size="large"
      disabled={!acknowledged}
      onClick={onTakeQuiz}
    >
      Start Quiz
    </Button>

    {!acknowledged && (
      <Button block size="large" className="mt-2" onClick={onAcknowledge}>
        I Acknowledge
      </Button>
    )}
  </Card>
);

/* --------------------------------- MAIN --------------------------------- */
export default function MainSection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cid, sid, qid: quizId } = useParams();

  const { itemDetails, activeTab, attemptHistory } = useSelector(
    (s) => s.student.studentQuiz
  );

  /* local */
  const [acknowledged, setAcknowledged] = useState(false);

  const hasRemainingAttempts = useCallback(() => {
    if (itemDetails?.allowNumberOfAttempts === null) return true;
    return attemptHistory?.length < itemDetails?.allowNumberOfAttempts;
  }, [itemDetails?.allowNumberOfAttempts, attemptHistory]);

  /* fetch attempt history on mount / id change */
  useEffect(() => {
    dispatch(fetchAllAttemptHistory({ quizId }));
  }, [dispatch, quizId]);

  /* handler */
  const goToTakeQuiz = () => {
    if (!hasRemainingAttempts()) {
      message.warning("You have no remaining attempts for this quiz.");
      return;
    }
    navigate(`/student_class/${cid}/${sid}/${quizId}/take_quiz`);
  };

  return (
    <div className="flex min-h-screen">
      <SubjectSideBar />

      {/* -------- content area -------- */}
      <div className="flex-1 flex border-x">
        <div className="flex-1 ">
          <Tabs
            quizSubmitted={false}
            hasAttempted={attemptHistory?.length > 0}
            hasRemainingAttempts={hasRemainingAttempts()}
            attemptHistory={attemptHistory}
          >
            {(tab) => (
              <div className="h-full p-6">
                {tab === "instructions" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <QuizInstructionSection />
                  </motion.div>
                )}

                {tab === "questions" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <QuizInstructions
                      acknowledged={acknowledged}
                      onAcknowledge={() => setAcknowledged((p) => !p)}
                      onTakeQuiz={goToTakeQuiz}
                    />
                  </motion.div>
                )}
              </div>
            )}
          </Tabs>
        </div>

        {/* -------- side bar -------- */}
        <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
          {activeTab === "instructions" && (
            <div className="space-y-6">
              <QuizzDetailCard />
              <QuizResultSummary />
            </div>
          )}

          {activeTab === "questions" && (
            <div className="space-y-6">
              <QuestionDetailCard hideTime />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
