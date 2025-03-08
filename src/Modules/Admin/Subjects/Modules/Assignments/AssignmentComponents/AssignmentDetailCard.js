import React, { useState } from "react";
import AddRubricModal from "../../Rubric/Components/AddRubricModal";
import AssignmentDetail from "../../../Component/AssignmentDetail";
import DateDetail from "../../../Component/DateDetail";
import SpeedGradeButton from "../../../Component/SpeedGradeButton";
import ButtonsGroup from "../../../Component/ButtonsGroup";
import RubricButton from "./RubricButton";
import Spinner from "../../../../../../Components/Common/Spinner";
import NoDataFound from "../../../../../../Components/Common/NoDataFound";
import { useSelector } from "react-redux";
import ProtectedAction from "../../../../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../../../../config/permission";

const AssignmentDetailCard = () => {
  const {
    assignmentDetails: assignment,
    loading,
    error,
  } = useSelector((store) => store.admin.assignments);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleViewRubric = () => {
    setModalOpen(true);
  };

  if (loading) return <Spinner />;
  if (error || !assignment) return <NoDataFound />;

  // Build the assignment details array conditionally
  const assignmentDetails = [];

  // Always render basic details
  assignmentDetails.push({
    label: "Assignment Points",
    value: assignment.points ? `${assignment.points} Points` : "N/A",
    type: "assignment",
  });
  assignmentDetails.push({
    label: "Allowed Attempts",
    value: assignment.allowNumberOfAttempts
      ? `${assignment.allowNumberOfAttempts} Times`
      : "Unlimited",
    type: "assignment",
  });
  assignmentDetails.push({
    label: "Submitting By",
    value: assignment.submissionType || "N/A",
    type: "assignment",
  });
  assignmentDetails.push({
    label: "This Assignment For",
    value: assignment.assignTo || "N/A",
    type: "assignment",
  });

  // Conditionally add date details only if they exist
  if (assignment.availableFrom) {
    assignmentDetails.push({
      label: "Available From",
      value: new Date(assignment.availableFrom).toLocaleDateString(),
      type: "date",
    });
  }
  if (assignment.dueDate) {
    assignmentDetails.push({
      label: "Due Date",
      value: new Date(assignment.dueDate).toLocaleDateString(),
      type: "date",
    });
  }
  if (assignment.resultsPublishDate) {
    assignmentDetails.push({
      label: "Results Publish Date",
      value: new Date(assignment.resultsPublishDate).toLocaleDateString(),
      type: "date",
    });
  }

  return (
    <div className="max-w-sm p-4 bg-white" aria-label="Assignment Card">
      <ButtonsGroup
        type="Assignment"
        data={assignment}
        loading={loading}
        requiredPermission={[
          PERMISSIONS.UPDATE_ASSIGNMENT,
          PERMISSIONS.UPDATE_ASSIGNMENT,
          PERMISSIONS.DELETE_ASSIGNMENT,
        ]}
      />

      <ProtectedAction
        requiredPermission={PERMISSIONS.ASSIGN_GRADE_TO_A_STUDENT}
      >
        <SpeedGradeButton
          type="Assignment"
          sgid={assignment._id}
          name={assignment.name}
          isPublish={assignment.publish}
        />
      </ProtectedAction>

      <div className="ps-3">
        {assignmentDetails.map((detail, index) => {
          if (detail.type === "assignment") {
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

      {/* Optionally, you can render the Rubric modal if needed */}
      {/* <RubricButton onClick={handleViewRubric} /> */}
      {/* {isModalOpen && <AddRubricModal readonly={true} />} */}
    </div>
  );
};

export default AssignmentDetailCard;
