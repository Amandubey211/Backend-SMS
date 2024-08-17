import React, { useState, useEffect } from 'react';
import { Card, Avatar } from 'antd';
import { gradeSummary } from '../../../Modules/Parents/GradeChild/DummyData/grade';
import Spinner from '../../../Components/Common/Spinner';
import { FaExclamationTriangle } from 'react-icons/fa';

const GradeSummary = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate an API call to fetch grade summary data
    setTimeout(() => {
      // Check if gradeSummary data exists, else set error
      if (!gradeSummary) {
        setError('Unable to fetch grades');
      }
      setLoading(false);
    }, 1000); // Simulate loading time
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <FaExclamationTriangle className="text-6xl text-gray-400 mb-4" />
        <p className="text-gray-500">Unable to Fetch Grades</p>
      </div>
    );
  }

  if (!gradeSummary) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <FaExclamationTriangle className="text-6xl text-gray-400 mb-4" />
        <p className="text-gray-500">No Data Yet</p>
      </div>
    );
  }

  return (
    <Card className="p-6 max-w-sm mx-auto rounded-lg shadow-lg">
      <div className="flex flex-col items-center mb-8">
        <Avatar size={64} src="https://via.placeholder.com/150" className="mb-4" />
        <h2 className="text-2xl font-medium text-gray-800">{gradeSummary.name}</h2>
        <p className="text-gray-500">Section: {gradeSummary.section}</p>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Assignment:</span>
          <span className="font-semibold text-gray-800">{gradeSummary.assignment} / 1000</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Group Assignment:</span>
          <span className="font-semibold text-gray-800">{gradeSummary.groupAssignment} / 500</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Quiz:</span>
          <span className="font-semibold text-gray-800">{gradeSummary.quiz} / 250</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Group Quiz:</span>
          <span className="font-semibold text-gray-800">{gradeSummary.groupQuiz} / 330</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Attendance:</span>
          <span className="font-semibold text-gray-800">{gradeSummary.attendance} / 135 DAY</span>
        </div>
      </div>
      <h3 className="mt-8 text-2xl font-bold text-gradient">
        Total Score: {gradeSummary.totalScore.toFixed(2)}
      </h3>
    </Card>
  );
};

export default GradeSummary;
