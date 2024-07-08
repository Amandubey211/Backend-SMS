<<<<<<< HEAD
import React, { useState } from 'react';
import { assignmentData } from './MockData';

import AddRubricModal from '../../Rubric/Components/AddRubricModal';
import Sidebar from '../../../../../../Components/Common/Sidebar';

import AssignmentDetail from '../../../Component/AssignmentDetail';
import DateDetail from '../../../Component/DateDetail';
import SpeedGradeButton from '../../../Component/SpeedGradeButton';
import ButtonsGroup from '../../../Component/ButtonsGroup';
import RubricButton from './RubricButton';
import AddNewCriteriaForm from '../../Rubric/Components/AddNewCriteriaForm ';

const AssignmentCard = () => {
  const {
    assignmentPoint,
    allowedAttempts,
    submittingBy,
    assignmentFor,
    dueDate,
    availableFrom,
    until
  } = assignmentData;

  const [isModalOpen, setModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Manage sidebar state

  return (
    <div className="max-w-sm p-4 bg-white" aria-label="Assignment Card">
      <ButtonsGroup />
      <SpeedGradeButton />
      <AssignmentDetail label="Assignment Point" value={`${assignmentPoint} Point`} />
      <AssignmentDetail label="Allowed Attempts" value={`${allowedAttempts.toString().padStart(2, '0')} Time`} />
      <AssignmentDetail label="Submitting By" value={submittingBy} />
      <AssignmentDetail label="This Assignment For" value={assignmentFor} />
      <DateDetail label="Due Date" value={dueDate} />
      <DateDetail label="Available From" value={availableFrom} />
      <DateDetail label="Until" value={until} />
      <RubricButton onClick={() => setModalOpen(true)} />
      
      <AddRubricModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onAddCriteria={() => setSidebarOpen(true)} // Pass down function to open sidebar
      />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)} // Pass down function to close sidebar
        title="Add New Criteria"
      >
        <AddNewCriteriaForm />
      </Sidebar>
    </div>
  );
};

export default AssignmentCard;
=======
import React, { useState } from "react";
import AddRubricModal from "../../Rubric/Components/AddRubricModal";
import Sidebar from "../../../../../../Components/Common/Sidebar";
import AssignmentDetail from "../../../Component/AssignmentDetail";
import DateDetail from "../../../Component/DateDetail";
import SpeedGradeButton from "../../../Component/SpeedGradeButton";
import ButtonsGroup from "../../../Component/ButtonsGroup";
import RubricButton from "./RubricButton";
import AddNewCriteriaForm from "../../Rubric/Components/AddNewCriteriaForm";

const AssignmentDetailCard = ({ assignment, loading, error }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  if (!assignment) return null;

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
      <ButtonsGroup />
      <SpeedGradeButton />
      <AssignmentDetail label="Assignment Points" value={`${points} Points`} />
      <AssignmentDetail
        label="Allowed Attempts"
        value={`${allowNumberOfAttempts ? allowNumberOfAttempts : 0} Times`}
      />
      <AssignmentDetail label="Submitting By" value={submissionType} />
      <AssignmentDetail label="This Assignment For" value={assignTo} />
      <DateDetail
        label="Due Date"
        value={new Date(dueDate).toLocaleDateString()}
      />
      <DateDetail
        label="Available From"
        value={new Date(availableFrom).toLocaleDateString()}
      />
      <RubricButton onClick={() => setModalOpen(true)} />

      <AddRubricModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onAddCriteria={() => setSidebarOpen(true)}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        title="Add New Criteria"
      >
        <AddNewCriteriaForm />
      </Sidebar>
    </div>
  );
};

export default AssignmentDetailCard;
>>>>>>> main
