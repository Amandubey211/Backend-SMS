import React from "react";

const StudentGradeSummary = ({ grades,studentData }) => {
  return (
    <div className="flex-none w-1/4 border-l">
      <div className="text-center border-b p-4">
        <img
          className="w-24 h-24 rounded-full mx-auto"
          src={
            studentData?.profile
          }
          alt="Profile"
        />
        <h2 className="mt-4 text-lg font-semibold">{studentData?.fullName}</h2>
        {/* <p className="text-gray-500">{studentData?.sectionName}</p> */}
      </div>
      <div className="mt-4 p-3  border-l-2">
        <h3 className="text-md font-semibold mb-4">Grade Summary</h3>
        <div className="flex justify-between mb-2">
          <p className="text-sm">Assignment</p>
          {/* <p className="text-sm">{assignment} / 1000</p> */}
          <p className="text-sm">{grades?.totalScoreOfSubmitAssignments} / { grades?.totalScoreOfAllAssignments}</p>
        </div>
        <div className="flex justify-between mb-2">
          <p className="text-sm">Group Assignment</p>
          <p className="text-sm">{grades?.submittedGroupAssignmentScore} / {grades?.totalGroupAssignmentScore}</p>
        </div>
        <div className="flex justify-between mb-2">
          <p className="text-sm">Quiz</p>
          <p className="text-sm">{grades?.totalQuizCompletedScore} / {grades?.totalScoreOfAllQuizzes}</p>
        </div>
        <div className="flex justify-between mb-2">
          <p className="text-sm">Group Quiz</p>
          <p className="text-sm">{grades?.submittedGroupQuizScore} / {grades?.totalGroupQuizScore}</p>
        </div>
        <div className="flex justify-between mb-2">
          <p className="text-sm">Attendance</p>
          <p className="text-sm">{grades?.attendance} DAY</p>
        </div>
        <div className="border-t mt-4 flex p-3 justify-between px-4 gap-1">
        <p className="text-lg font-semibold">Total Score:</p>
        <p className="text-pink-500 text-xl font-semibold">
          {
            grades?.total
          }
        </p>
      </div>
      </div>
    </div>
  );
};

export default StudentGradeSummary;
