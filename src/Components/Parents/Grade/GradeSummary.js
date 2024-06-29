import React from 'react';
import { Card, Avatar } from 'antd';
import { gradeSummary } from '../../../Modules/Parents/GradeChild/DummyData/grade';

const GradeSummary = () => (
  <Card className="shadow-md p-6 max-w-sm mx-auto">

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

export default GradeSummary;
