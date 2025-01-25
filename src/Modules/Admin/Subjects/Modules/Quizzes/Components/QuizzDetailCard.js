import React, { useEffect, useState } from "react";
import DateDetail from "../../../Component/DateDetail";
import AssignmentDetail from "../../../Component/AssignmentDetail";
import ButtonsGroup from "../../../Component/ButtonsGroup";
import SpeedGradeButton from "../../../Component/SpeedGradeButton";
import RubricButton from "../../Assignments/AssignmentComponents/RubricButton";
import AddRubricModal from "../../Rubric/Components/AddRubricModal";
import { useSelector } from "react-redux";
import ProtectedAction from "../../../../../../Routes/ProtectedRoutes/ProtectedAction";

const QuizzDetailCard = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [criteriaList, setCriteriaList] = useState([]);
  const [existingRubricId, setExistingRubricId] = useState(null);
  const { quizzDetail: quiz, updateLoading } = useSelector(
    (store) => store.admin.quizzes
  );

  const quizDetails = [
    {
      label: "Quiz Point",
      value: `${quiz?.totalPoints || 0} Points`,
      type: "quizz",
    },
    { label: "Quiz Type", value: quiz?.quizType || "N/A", type: "quizz" },
    { label: "Quiz Score", value: "0 out of 10", type: "quizz" },
    {
      label: "Allowed Attempts",
      value: quiz?.allowNumberOfAttempts
        ? quiz?.allowNumberOfAttempts
        : "Unlimited",
      type: "quizz",
    },
    { label: "Submitting date", value: "20-5-2024", type: "quizz" },
    {
      label: "One Question at a time",
      value: quiz?.showOneQuestionOnly ? "Yes" : "No",
      type: "quizz",
    },
    {
      label: "Time Limit",
      value: quiz?.timeLimit ? `${quiz.timeLimit} Minutes` : "No Time Limit",
      type: "quizz",
    },
    {
      label: "This Quiz Is For",
      value: quiz?.assignTo || "N/A",
      type: "quizz",
    },
    {
      label: "Student See The correct Answer",
      value: quiz?.showAnswerDate
        ? new Date(quiz?.showAnswerDate).toLocaleDateString()
        : "DD/MM/YYYY",
      type: "quizz",
    },
    {
      label: "Available From",
      value: quiz?.availableFrom
        ? new Date(quiz?.availableFrom).toLocaleDateString()
        : "DD/MM/YYY",
      type: "date",
    },
    {
      label: "Due Date",
      value: quiz?.dueDate
        ? new Date(quiz?.dueDate).toLocaleDateString()
        : "DD/MM/YYY",
      type: "date",
    },
  ];
  const handleViewRubric = () => {
    setModalOpen(true);
  };
  return (
    <div className="p-3 bg-white" aria-label="Quiz Card">
      <ButtonsGroup
        type="Quiz"
        data={quiz}
        loading={updateLoading}
        requiredPermission="modification need here " //Aman
      />
      {/* <p className="text-center text-green-500 italic font-semibold pb-3 border-b">
        Submitted Students : 50/100{" "}
      </p> */}
      <ProtectedAction requiredPermission="grade Quiz">
        <SpeedGradeButton
          type="Quiz"
          sgid={quiz?._id}
          name={quiz?.name}
          isPublish={quiz?.publish}
        />
      </ProtectedAction>

      <div className="ps-3 ">
        {quizDetails?.map((detail, index) => {
          if (detail.type === "quizz") {
            return (
              <AssignmentDetail
                key={index}
                label={detail.label}
                value={detail.value}
              />
            );
          } else if (detail.type === "date") {
            return (
              <DateDetail
                key={index}
                label={detail.label}
                value={detail.value}
              />
            );
          }
          return null;
        })}
      </div>
      <RubricButton onClick={handleViewRubric} />
      <AddRubricModal
        type="quiz"
        QuizId={quiz?._id}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        criteriaList={criteriaList}
        setCriteriaList={setCriteriaList}
        setExistingRubricId={setExistingRubricId}
        readonly={true} // Set readonly to true
      />
    </div>
  );
};

export default QuizzDetailCard;
