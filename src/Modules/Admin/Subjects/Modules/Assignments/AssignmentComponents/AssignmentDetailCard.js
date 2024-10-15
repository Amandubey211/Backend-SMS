import React, { useState, useEffect } from "react";
import AddRubricModal from "../../Rubric/Components/AddRubricModal";
import AssignmentDetail from "../../../Component/AssignmentDetail";
import DateDetail from "../../../Component/DateDetail";
import SpeedGradeButton from "../../../Component/SpeedGradeButton";
import ButtonsGroup from "../../../Component/ButtonsGroup";
import RubricButton from "./RubricButton";
import Spinner from "../../../../../../Components/Common/Spinner";
import NoDataFound from "../../../../../../Components/Common/NoDataFound";
import { useSelector } from "react-redux";

const AssignmentDetailCard = () => {
  const {
    assignmentDetails: assignment,
    loading,
    error,
  } = useSelector((store) => store.admin.assignments);
  const [isModalOpen, setModalOpen] = useState(false);
  const [criteriaList, setCriteriaList] = useState([]);
  const [existingRubricId, setExistingRubricId] = useState(null);

  const handleViewRubric = () => {
    setModalOpen(true);
  };
  const isPublish = assignment?.publish;
  if (loading) return <Spinner />;
  if (error || !assignment) return <NoDataFound />;

  const {
    points,
    allowedAttempts,
    allowNumberOfAttempts,
    submissionType,
    assignTo,
    dueDate,
    availableFrom,
  } = assignment;

  return (
    <div className="max-w-sm p-4 bg-white" aria-label="Assignment Card">
      <ButtonsGroup type="Assignment" data={assignment} loading={loading} />

      <SpeedGradeButton
        type="Assignment"
        sgid={assignment._id}
        name={assignment.name}
        isPublish={isPublish}
      />

      <AssignmentDetail
        label="Assignment Points"
        value={`${points || "N/A"} Points`}
      />
      <AssignmentDetail
        label="Allowed Attempts"
        value={`${allowNumberOfAttempts ? allowNumberOfAttempts : 0} Times`}
      />
      <AssignmentDetail label="Submitting By" value={submissionType} />
      <AssignmentDetail label="This Assignment For" value={assignTo} />
      <DateDetail
        label="Due Date"
        value={dueDate ? new Date(dueDate).toLocaleDateString() : "DD/MM/YY"}
      />
      <DateDetail
        label="Available From"
        value={
          availableFrom
            ? new Date(availableFrom).toLocaleDateString()
            : "DD/MM/YY"
        }
      />
      <RubricButton onClick={handleViewRubric} />

      <AddRubricModal
        type="assignment"
        AssignmentId={assignment?._id}
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

export default AssignmentDetailCard;
