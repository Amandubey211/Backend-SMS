import React, { useState } from 'react';
import { assignmentData } from './MockData';

import AddRubricModal from '../../Rubric/Components/AddRubricModal';
import Sidebar from '../../../../../../Components/Common/Sidebar';

import AssignmentDetail from '../../../Component/AssignmentDetail';
import DateDetail from '../../../Component/DateDetail';
import SpeedGradeButton from '../../../Component/SpeedGradeButton';
import ButtonsGroup from '../../../Component/ButtonsGroup';
import RubricButton from './RubricButton';
import AddNewCriteriaForm from '../../Rubric/Components/AddNewCriteriaForm';

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
