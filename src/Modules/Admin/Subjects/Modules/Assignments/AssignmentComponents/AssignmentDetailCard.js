import React from 'react';
import { FaRegCalendarAlt, FaBan } from 'react-icons/fa';
import { AiOutlineEdit, AiOutlineRight } from 'react-icons/ai';
import { BsLightningFill } from 'react-icons/bs';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { assignmentData } from './MockData';

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

  return (
    <div className="max-w-sm p-4 border rounded-lg shadow-md bg-white" aria-label="Assignment Card">
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
        <p className="text-xl font-bold text-gray-900">{assignmentPoint} <span className="text-sm font-normal text-gray-600">Point</span></p>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-600">Allowed Attempts</p>
        <p className="text-xl font-bold text-gray-900">{allowedAttempts.toString().padStart(2, '0')} <span className="text-sm font-normal text-gray-600">Time</span></p>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-600">Submitting By</p>
        <p className="text-md font-normal text-gray-900">{submittingBy}</p>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-600">This Assignment For</p>
        <p className="text-md font-normal text-gray-900">{assignmentFor}</p>
      </div>
      <div className="mt-4 flex items-center">
        <FaRegCalendarAlt className="mr-2 text-gray-600" aria-hidden="true" />
        <p className="text-sm font-medium text-gray-600">Due Date:</p>
        <p className="text-sm font-normal text-gray-900 ml-2">{dueDate}</p>
      </div>
      <div className="mt-4 flex items-center">
        <FaRegCalendarAlt className="mr-2 text-gray-600" aria-hidden="true" />
        <p className="text-sm font-medium text-gray-600">Available From:</p>
        <p className="text-sm font-normal text-gray-900 ml-2">{availableFrom}</p>
      </div>
      <div className="mt-4 flex items-center">
        <FaRegCalendarAlt className="mr-2 text-gray-600" aria-hidden="true" />
        <p className="text-sm font-medium text-gray-600">Until:</p>
        <p className="text-sm font-normal text-gray-900 ml-2">{until}</p>
      </div>
      <button
        className="mt-4 w-full py-2 text-pink-500 border border-pink-500 rounded-lg"
        aria-label="View Rubric"
      >
        Rubric
      </button>
    </div>
  );
};

export default AssignmentCard;
