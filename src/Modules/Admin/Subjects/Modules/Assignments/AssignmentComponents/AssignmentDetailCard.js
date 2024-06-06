import React, { useState } from 'react';
import { FaRegCalendarAlt, FaBan } from 'react-icons/fa';
import { AiOutlineEdit, AiOutlineRight } from 'react-icons/ai';
import { BsLightningFill } from 'react-icons/bs';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { assignmentData } from './MockData';
import { NavLink } from 'react-router-dom';
import AddRubricModal from '../../Rubric/Components/AddRubricModal';
import Sidebar from '../../../../../../Components/Common/Sidebar';
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
    <div className="max-w-sm p-4    bg-white" aria-label="Assignment Card">
      <div className="flex justify-center gap-4 items-center w-full p-2 text-gray-700">
        <button
          className="flex items-center space-x-1 px-4 py-2 border rounded-md border-gray-300 text-gray-600 hover:bg-gray-100 transition"
          aria-label="Publish Assignment"
        >
          <FaBan aria-hidden="true" />
          <span>Publish</span>
        </button>
        <button
          className="flex items-center space-x-1 px-4 py-2 border rounded-md border-gray-300 text-green-600 hover:bg-gray-100 transition"
          aria-label="Edit Assignment"
        >
          <AiOutlineEdit aria-hidden="true" />
          <span>Edit</span>
        </button>
        <button
          className="flex items-center space-x-1 px-4 py-2 border rounded-full border-gray-300 text-gray-600 hover:bg-gray-100 transition"
          aria-label="More Options"
        >
          <HiOutlineDotsVertical aria-hidden="true" />
        </button>
      </div>
      <button
        className="flex items-center justify-center w-full mt-4 py-2 text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
        aria-label="Speed Grade"
      >
        <BsLightningFill className="mr-2" aria-hidden="true" />
        <span>Speed Grade</span>
        <AiOutlineRight className="ml-2" aria-hidden="true" />
      </button>
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-600">Assignment Point</p>
        <p className="text-lg font-bold text-gray-900">{assignmentPoint} <span className="text-sm font-normal text-gray-600">Point</span></p>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-600">Allowed Attempts</p>
        <p className="text-lg font-bold text-gray-900">{allowedAttempts.toString().padStart(2, '0')} <span className="text-sm font-normal text-gray-600">Time</span></p>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-600">Submitting By</p>
        <p className="text-lg font-normal text-gray-900">{submittingBy}</p>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-600">This Assignment For</p>
        <p className="text-lg font-normal text-gray-900">{assignmentFor}</p>
      </div>
      <div className="mt-4">
        <div className="flex items-center px-4 justify-between p-3 border rounded-full border-gray-300 text-gray-600">
          <div className="flex items-center">
            <FaRegCalendarAlt className="mr-2" aria-hidden="true" />
            <p className="text-sm font-medium">Due Date :</p>
          </div>
          <p className="text-sm font-normal text-gray-900">{dueDate}</p>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between p-3  px-4 border rounded-full border-gray-300 text-gray-600">
          <div className="flex items-center">
            <FaRegCalendarAlt className="mr-2" aria-hidden="true" />
            <p className="text-sm font-medium">Available From :</p>
          </div>
          <p className="text-sm font-normal text-gray-900">{availableFrom}</p>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between p-3 px-4 border rounded-full border-gray-300 text-gray-600">
          <div className="flex items-center">
            <FaRegCalendarAlt className="mr-2" aria-hidden="true" />
            <p className="text-sm font-medium">Until :</p>
          </div>
          <p className="text-sm font-normal text-gray-900">{until}</p>
        </div>
      </div>
      <button onClick={() => setModalOpen(true)} className="mt-4 flex text-2xl gap-1  items-center">
        <span className="text-gradient text-4xl -mt-1 ">+</span>
        <span className="text-gradient font-semibold border-b  border-red-600">Rubric</span>
      </button>
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
