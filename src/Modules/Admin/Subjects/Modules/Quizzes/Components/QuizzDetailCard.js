import React, { useState } from "react";
import DateDetail from "../../../Component/DateDetail";
import AssignmentDetail from "../../../Component/AssignmentDetail";
import ButtonsGroup from "../../../Component/ButtonsGroup";
import SpeedGradeButton from "../../../Component/SpeedGradeButton";
import AddRubricModal from "../../Rubric/Components/AddRubricModal";
import { useSelector } from "react-redux";
import ProtectedAction from "../../../../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../../../../config/permission";

const QuizzDetailCard = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [criteriaList, setCriteriaList] = useState([]);
  const [existingRubricId, setExistingRubricId] = useState(null);
  const { quizzDetail: quiz, updateLoading } = useSelector(
    (store) => store.admin.quizzes
  );

  // Build quizDetails conditionally
  const quizDetails = [];
  if (quiz) {
    quizDetails.push({
      label: "Quiz Point",
      value: `${quiz.totalPoints || 0} Points`,
      type: "quizz",
    });
    quizDetails.push({
      label: "Quiz Type",
      value: quiz.quizType || "N/A",
      type: "quizz",
    });
    quizDetails.push({
      label: "Quiz Score",
      value: "0 out of 10",
      type: "quizz",
    });
    quizDetails.push({
      label: "Allowed Attempts",
      value: quiz.allowNumberOfAttempts
        ? quiz.allowNumberOfAttempts
        : "Unlimited",
      type: "quizz",
    });
    quizDetails.push({
      label: "Submitting date",
      value: "20-5-2024",
      type: "quizz",
    });
    quizDetails.push({
      label: "One Question at a time",
      value: quiz.showOneQuestionOnly ? "Yes" : "No",
      type: "quizz",
    });
    quizDetails.push({
      label: "Time Limit",
      value: quiz.timeLimit ? `${quiz.timeLimit} Minutes` : "No Time Limit",
      type: "quizz",
    });
    quizDetails.push({
      label: "This Quiz Is For",
      value: quiz.assignTo || "N/A",
      type: "quizz",
    });
    if (quiz.showAnswerDate) {
      quizDetails.push({
        label: "Student See The correct Answer",
        value: new Date(quiz.showAnswerDate).toLocaleDateString(),
        type: "quizz",
      });
    }
    if (quiz.availableFrom) {
      quizDetails.push({
        label: "Available From",
        value: new Date(quiz.availableFrom).toLocaleDateString(),
        type: "date",
      });
    }
    if (quiz.dueDate) {
      quizDetails.push({
        label: "Due Date",
        value: new Date(quiz.dueDate).toLocaleDateString(),
        type: "date",
      });
    }
    if (quiz.resultsPublishDate) {
      quizDetails.push({
        label: "Results Publish Date",
        value: new Date(quiz.resultsPublishDate).toLocaleDateString(),
        type: "date",
      });
    }
  }

  const handleViewRubric = () => {
    setModalOpen(true);
  };

  return (
    <div className="p-3 bg-white border-l" aria-label="Quiz Card">
      <ButtonsGroup
        type="Quiz"
        data={quiz}
        loading={updateLoading}
        requiredPermission={[
          PERMISSIONS.UPDATE_QUIZ,
          PERMISSIONS.UPDATE_QUIZ,
          PERMISSIONS.DELETE_QUIZ,
        ]}
      />
      <ProtectedAction requiredPermission={PERMISSIONS.ASSIGN_QUIZ_GRADE}>
        <SpeedGradeButton
          type="Quiz"
          sgid={quiz?._id}
          name={quiz?.name}
          isPublish={quiz?.publish}
        />
      </ProtectedAction>

      <div className="ps-3">
        {quizDetails.map((detail, index) => {
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

      <AddRubricModal
        type="quiz"
        QuizId={quiz?._id}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        criteriaList={criteriaList}
        setCriteriaList={setCriteriaList}
        setExistingRubricId={setExistingRubricId}
        readonly={true}
      />
    </div>
  );
};

export default QuizzDetailCard;
