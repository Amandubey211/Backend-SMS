import React from 'react';
import { FaCheckCircle, FaTimesCircle, FaDoorOpen } from 'react-icons/fa';

const AttendanceSummary = ({ present, absent, leave }) => {
  return (
    <div className="flex justify-around px-4  space-x-4">
      <div className="flex items-center bg-green-100 p-4 pl-10 rounded-lg w-1/3">
        <div className='bg-white rounded-full p-4'>
          <FaCheckCircle className="text-3xl text-green-500" />
        </div>
        <div className="flex flex-col items-start ml-4">
          <span className="text-3xl text-gray-700">{present}</span>
          <span className="mt-1 text-green-600">Total Present</span>
        </div>
      </div>
      <div className="flex items-center bg-red-100 p-4 rounded-lg w-1/3">
        <div className='bg-white rounded-full p-4'>
          <FaTimesCircle className="text-3xl text-red-500" />
        </div>
        <div className="flex flex-col items-start ml-4">
          <span className="text-3xl text-gray-700">{absent}</span>
          <span className="mt-1 text-red-600">Total Absent</span>
        </div>
      </div>
      <div className="flex items-center bg-purple-100 p-4 rounded-lg w-1/3">
        <div className='bg-white rounded-full p-4'>
          <FaDoorOpen className="text-3xl text-purple-500" />
        </div>
        <div className="flex flex-col items-start ml-4">
          <span className="text-3xl text-gray-700">{leave}</span>
          <span className="mt-1 text-purple-600">Total Leave</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSummary;
