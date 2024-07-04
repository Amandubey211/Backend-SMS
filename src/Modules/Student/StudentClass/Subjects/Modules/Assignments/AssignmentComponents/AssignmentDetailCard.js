import React, { useState } from 'react';
import { assignmentData } from './MockData';

import AddRubricModal from '../../Rubric/Components/AddRubricModal';
// import Sidebar from '../../../../../../Components/Common/Sidebar';

import AssignmentDetail from '../../../Component/AssignmentDetail';
import DateDetail from '../../../Component/DateDetail';
import SpeedGradeButton from '../../../Component/SpeedGradeButton';
import ButtonsGroup from '../../../Component/ButtonsGroup';
import RubricButton from './RubricButton';
import Sidebar from '../../../../../../../Components/Common/Sidebar';
import AddNewCriteriaForm from '../../../../../../Admin/Subjects/Modules/Rubric/Components/AddNewCriteriaForm';
// import AddNewCriteriaForm from '../../Rubric/Components/AddNewCriteriaForm ';
import { NavLink, useParams } from "react-router-dom";
import { RiListCheck3, RiAddFill } from "react-icons/ri";
import Editor from '../../../Component/Editor';
import CreateAssignmentHolder from './CreateAssignmentHolder';

const AssignmentCard = ({ isSubmitted }) => {
  const { sid, cid } = useParams();

  const {
    assignmentPoint,
    allowedAttempts,
    alreadyAttempted,
    submittingBy,
    assignmentFor,
    dueDate,
    availableFrom,
    until
  } = assignmentData;

  const [isModalOpen, setModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Manage sidebar state
  const handleAssignment=()=>{
  setSidebarOpen(true)
}
const handleFormSubmit = () => {
  setSidebarOpen(false); // Close the sidebar when the form is submitted
};
  return (

<div className="max-w-sm p-4 bg-white shadow-md rounded-lg" aria-label="Assignment Card">
      <div className={`p-2 mb-4 text-center text-lg font-semibold rounded-md ${isSubmitted ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        <span>Submit Status : {isSubmitted ? "Submitted" : "Not submitted"}</span>
      </div>
      <span>Grade : </span>

      <DateDetail label="Due Date" value={dueDate} />
      {/* <button
        onClick={handleAssignment}
        className="bg-gradient-to-r from-purple-400 to-pink-400 text-white p-4 fixed rounded-full shadow-md bottom-4 right-4"
      >
        <RiAddFill size={24} />
      </button> */}
      <AssignmentDetail label="Assignment Point" value={`${assignmentPoint} Point`} />
      <AssignmentDetail label="Allowed Attempts" value={`${allowedAttempts.toString().padStart(2, '0')} Time`} />
      <AssignmentDetail label="Submitting By" value={submittingBy} />

      <AddRubricModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onAddCriteria={() => setSidebarOpen(true)} // Pass down function to open sidebar
      />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)} // Pass down function to close sidebar
        title="Start Assignment"
      >
        <CreateAssignmentHolder onSubmit={handleFormSubmit} />
      </Sidebar>
    </div>

  );
};

export default AssignmentCard;
