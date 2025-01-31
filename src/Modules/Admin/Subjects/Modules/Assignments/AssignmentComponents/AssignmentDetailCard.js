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

  const assignmentDetails = [
    {
      label: "Assignment Points",
      value: `${assignment?.points || "N/A"} Points`,
      type: "assignment",
    },
    {
      label: "Allowed Attempts",
      value: `${
        assignment?.allowNumberOfAttempts
          ? assignment.allowNumberOfAttempts
          : "Unlimited"
      } Times`,
      type: "assignment",
    },
    {
      label: "Submitting By",
      value: assignment?.submissionType || "N/A",
      type: "assignment",
    },
    {
      label: "This Assignment For",
      value: assignment?.assignTo || "N/A",
      type: "assignment",
    },
    {
      label: "Available From",
      value: assignment?.availableFrom
        ? new Date(assignment.availableFrom).toLocaleDateString()
        : "DD/MM/YY",
      type: "date",
    },
    {
      label: "Due Date",
      value: assignment?.dueDate
        ? new Date(assignment.dueDate).toLocaleDateString()
        : "DD/MM/YY",
      type: "date",
    },
  ];

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
          isPublish={assignment?.publish}
        />
      </ProtectedAction>

      <div className="ps-3 ">
        {assignmentDetails?.map((detail, index) => {
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

      {/* <RubricButton onClick={handleViewRubric} /> */}

      {/* {isModalOpen && <AddRubricModal readonly={true} />} */}
    </div>
  );
};

export default AssignmentDetailCard;
