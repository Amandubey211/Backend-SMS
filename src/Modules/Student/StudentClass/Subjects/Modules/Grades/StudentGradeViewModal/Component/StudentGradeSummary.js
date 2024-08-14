import React from "react";

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
    total

  } = studentGrade;

  return (

    // <div className="flex-none w-1/4 border-l flex flex-col   items-center">
      // <div className="text-center border-b p-4">
      //   <img
      //     className="w-24 h-24 rounded-full mx-auto"
      //     src={avatar}
      //     alt="Profile"
      //   />
      //   <h2 className="mt-4 text-lg font-semibold">{name}</h2>
      //   <p className="text-gray-500">{section}</p>
      // </div>
      // <div className=" mt-4 p-3">
      //   <h3 className="text-md font-semibold mb-4">Grade Summary</h3>
      //   <div className="flex justify-between mb-2">
      //     <p className="text-sm">Assignment</p>
      //     {/* <p className="text-sm">{assignment} / 1000</p> */}
      //     <p className="text-sm">720 / 1000</p>
      //   </div>
      //   <div className="flex justify-between mb-2">
      //     <p className="text-sm">Group Assignment</p>
      //     <p className="text-sm">{groupAssignment || "0"} / 500</p>
      //   </div>
      //   <div className="flex justify-between mb-2">
      //     <p className="text-sm">Quiz</p>
      //     <p className="text-sm">{quiz || "0"} / 250</p>
      //   </div>
      //   <div className="flex justify-between mb-2">
      //     <p className="text-sm">Group Quiz</p>
      //     <p className="text-sm">{groupQuiz || "0"} / 330</p>
      //   </div>
      //   <div className="flex justify-between mb-2">
      //     <p className="text-sm">Attendance</p>
      //     <p className="text-sm">{attendance} / 135 DAY</p>
      //   </div>
      // </div>
      // <div className="border-t mt-4 flex p-3 justify-between px-4 gap-1">
      //   <p className="text-lg font-semibold">Total Score:</p>
      //   <p className="text-pink-500 text-xl font-semibold">
      //     {totalScore || "1480.00"}
      //   </p>
      // </div>
    // </div>

    <>
     <div className="flex flex-col p-3 ">
      <div>
      <div className="text-center border-b p-4">
        <img
          className="w-24 h-24 rounded-full mx-auto"
          src={avatar}
          alt="Profile"
        />
        <h2 className="mt-4 text-lg font-semibold">{name}</h2>
        <p className="text-gray-500">{section}</p>
      </div>

      </div>
      <div>
        <div className=" mt-4 p-3">
        <h3 className="text-md font-semibold mb-4">Grade Summary</h3>
        <div className="flex justify-between mb-2">
          <p className="text-sm">Assignment</p>
          {/* <p className="text-sm">{assignment} / 1000</p> */}
          <p className="text-sm">{totalScore} /{assignment} </p>
        </div>
        <div className="flex justify-between mb-2">
          <p className="text-sm">Group Assignment</p>
          <p className="text-sm">{groupAssignment} /{totalGroupAssignmentScore} </p>
        </div>
        <div className="flex justify-between mb-2">
          <p className="text-sm">Quiz</p>
          <p className="text-sm">{totalQuizCompletedScore } /{quiz}</p>
        </div>
        <div className="flex justify-between mb-2">
          <p className="text-sm">Group Quiz</p>
          <p className="text-sm">{groupQuiz } /{totalGroupQuizScore} </p>
        </div>
        <div className="flex justify-between mb-2">
          <p className="text-sm">Attendance</p>
          <p className="text-sm">{attendance} </p>
        </div>
      </div>
      </div>
      <div>
      <div className="border-t mt-4 flex p-3 justify-between px-4 gap-1">
        <p className="text-lg font-semibold">Total Score:</p>
        <p className="text-pink-500 text-xl font-semibold">
          {total }
        </p>
      </div>
      </div>
      </div> 

    </>
  );
};

export default StudentGradeSummary;
