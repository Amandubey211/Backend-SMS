import React from "react";
import AttendanceGraph from "./AttendanceGraph";
import StudentGradePieChart from "./StudentGradePieChart";
import TaskChart from "./TaskChart";
import AllSubjects from "../StudentCourseProgress/allSubjects/AllSubjects";

const StudentOverView = () => {
  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-1 flex-col">
          <span>My Course</span>
          <span>Total 5 course remainng </span>
        </div>

        <div className="" >
          <AllSubjects />
        </div>
        
        <div className="mt-4 w-full h-96 p-5 justify-center items-center flex self-center  ">
          <AttendanceGraph />
        </div>
        
        <div className="flex flex-row h-[300px] bg-white ">
        <StudentGradePieChart/>
        <TaskChart />

        </div>

        
      </div>
    </>
  );
};

export default StudentOverView;
