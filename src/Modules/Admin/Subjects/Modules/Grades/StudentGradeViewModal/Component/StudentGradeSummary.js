import React from "react";

const StudentGradeSummary = ({ studentGrade }) => {
  console.log('--',studentGrade);
  
  const {
    student,
    totalScoreOfSubmitAssignments,
    totalQuizCompletedScore,
    total,
    attendance,
    totalGroupAssignmentScore,
    submittedGroupAssignmentScore,
    totalGroupQuizScore,
    submittedGroupQuizScore,
    totalScoreOfAllAssignments,
    totalScoreOfAllQuizzes,
  } = studentGrade;
  return (
    <div className="flex-none w-1/4 border-l">
      <div className="text-center border-b p-4">
        <img
          className="w-24 h-24 rounded-full mx-auto"
          src={
            student?.profile
          }
          alt="Profile"
        />
        <h2 className="mt-4 text-lg font-semibold">{student?.firstName}</h2>
        <p className="text-gray-500">{student?.sectionName || "Section A"}</p>
      </div>
      <div className="mt-4 p-3">
        <h3 className="text-md font-semibold mb-4">Grade Summary</h3>
        <div className="flex justify-between mb-2">
          <p className="text-sm">Assignment</p>
          {/* <p className="text-sm">{assignment} / 1000</p> */}
          <p className="text-sm">{totalScoreOfSubmitAssignments} / { totalScoreOfAllAssignments}</p>
        </div>
        <div className="flex justify-between mb-2">
          <p className="text-sm">Group Assignment</p>
          <p className="text-sm">{submittedGroupAssignmentScore} / {totalGroupAssignmentScore}</p>
        </div>
        <div className="flex justify-between mb-2">
          <p className="text-sm">Quiz</p>
          <p className="text-sm">{totalQuizCompletedScore} / {totalScoreOfAllQuizzes}</p>
        </div>
        <div className="flex justify-between mb-2">
          <p className="text-sm">Group Quiz</p>
          <p className="text-sm">{submittedGroupQuizScore} / {totalGroupQuizScore}</p>
        </div>
        <div className="flex justify-between mb-2">
          <p className="text-sm">Attendance</p>
          <p className="text-sm">{attendance} DAY</p>
        </div>
      </div>
      <div className="border-t mt-4 flex p-3 justify-between px-4 gap-1">
        <p className="text-lg font-semibold">Total Score:</p>
        <p className="text-pink-500 text-xl font-semibold">
          {
            total
          }
        </p>
      </div>
    </div>
  );
};

export default StudentGradeSummary;
