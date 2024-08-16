import React, { useState, useEffect } from "react";
import AddRubricModal from "../../Rubric/Components/AddRubricModal";
import Sidebar from "../../../../../../Components/Common/Sidebar";
import AssignmentDetail from "../../../Component/AssignmentDetail";
import DateDetail from "../../../Component/DateDetail";
import SpeedGradeButton from "../../../Component/SpeedGradeButton";
import ButtonsGroup from "../../../Component/ButtonsGroup";
import RubricButton from "./RubricButton";
import AddNewCriteriaForm from "../../Rubric/Components/AddNewCriteriaForm";
import Spinner from "../../../../../../Components/Common/Spinner";
import NoDataFound from "../../../../../../Components/Common/NoDataFound";

const AssignmentDetailCard = ({
  assignment,
  loading,
  error,
  onRefresh,
  isPublish,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [criteriaList, setCriteriaList] = useState([]);
  const [existingRubricId, setExistingRubricId] = useState(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState("");

  useEffect(() => {
    if (assignment && assignment._id) {
      setSelectedAssignmentId(assignment._id);
    }
  }, [assignment]);

  const handleViewRubric = () => {
    setModalOpen(true);
  };

  if (loading) return <Spinner />;
  if (error) return <NoDataFound />;

  if (!assignment) return <NoDataFound />;

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
      <ButtonsGroup
        type="Assignment"
        data={assignment}
        onRefresh={onRefresh} // Pass the refresh callback
      />

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
        AssignmentId={selectedAssignmentId} // Pass the selected assignment ID
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onAddCriteria={() => setSidebarOpen(true)}
        criteriaList={criteriaList}
        setCriteriaList={setCriteriaList}
        setExistingRubricId={setExistingRubricId}
        readonly={true} // Set readonly to true
      />
      {/* <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        title="Add New Criteria"
      >
        <AddNewCriteriaForm />
      </Sidebar> */}
    </div>
  );
};

export default AssignmentDetailCard;
