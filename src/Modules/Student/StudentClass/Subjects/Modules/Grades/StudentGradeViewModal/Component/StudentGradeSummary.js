import React from "react";
//import profileIcon from "../../../Assets/DashboardAssets/profileIcon.png";
import profileIcon from "../../../../../../../../Assets/DashboardAssets/profileIcon.png";

const StudentGradeSummary = ({ studentGrade }) => {
  const {
    avatar,
    name,
    section,
    assignment,
    groupAssignment,
    quiz,
    groupQuiz,
    attendance,
    totalScore,
    totalGroupAssignmentScore,
    totalGroupQuizScore,
    totalQuizCompletedScore,
    total,
    totalAssignmentScore,
  } = studentGrade;

  return (
    <>
      <div className="flex flex-col p-3 ">
        <div>
          <div className="text-center border-b p-4">
            <img
              className="w-24 h-24 rounded-full mx-auto shadow-lg border"
              src={avatar ? avatar : profileIcon}
              alt="Profile"
            />
            <h2 className="mt-4 text-lg font-semibold">{name}</h2>
            <p className="text-gray-500">{section}</p>
          </div>
        </div>
        <div>
          <div className=" p-3">
            <h3 className="text-md font-semibold mb-4">Grade Summary</h3>
            <div className="flex justify-between mb-2">
              <p className="text-sm">Assignment</p>
              {/* <p className="text-sm">{assignment} / 1000</p> */}
              <p className="text-sm">
                {totalAssignmentScore ? totalAssignmentScore : 0} / {assignment ? assignment : 0}
              </p>
            </div>
            <div className="flex justify-between mb-2">
              <p className="text-sm">Group Assignment</p>
              <p className="text-sm">
                {groupAssignment ? groupAssignment : 0} / {totalGroupAssignmentScore ? totalGroupAssignmentScore : 0}
              </p>
            </div>
            <div className="flex justify-between mb-2">
              <p className="text-sm">Quiz</p>
              <p className="text-sm">
                {totalQuizCompletedScore ? totalQuizCompletedScore : 0} / {quiz ? quiz : 0}
              </p>
            </div>
            <div className="flex justify-between mb-2">
              <p className="text-sm">Group Quiz</p>
              <p className="text-sm">
                {groupQuiz ? groupQuiz : 0} / {totalGroupQuizScore ? totalGroupQuizScore : 0}{" "}
              </p>
            </div>
            <div className="flex justify-between mb-2">
              <p className="text-sm">Attendance</p>
              <p className="text-sm">{attendance ? attendance : "0 Days"} </p>
            </div>
          </div>
        </div>
        <div>
          <div className="border-t mt-4 flex p-3 justify-between px-4 gap-1">
            <p className="text-lg font-semibold">Total Score:</p>
            <p className="text-pink-500 text-xl font-semibold">{total ? total : 0}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentGradeSummary;
