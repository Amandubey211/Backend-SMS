import React from "react";
import AttendanceGraph from "./AttendanceGraph";
import StudentGradePieChart from "./StudentGradePieChart";
import TaskChart from "./TaskChart";
import AllSubjects from "../StudentCourseProgress/allSubjects/AllSubjects";

const StudentOverView = () => {

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-1 flex-col p-4">
          <span className="font-bold text-gray-900">My Courses</span>
          <span className="text-gray-500">Total 5 course remainng </span>
        </div>

        <div className="" >
          <AllSubjects />
        </div>
        
        <div className="mt-4 w-full h-96 p-5 justify-center items-center flex self-center border-t-2 flex-col  ">
          <h1 className="mb-4 font-bold">Attendance</h1>
          <AttendanceGraph />
        </div>
        <div className='flex justify-between  w-[100%]  border-t-2'> 
        <p className="px-4 w-[50%] font-bold text-gray-500" >Student Grade (dummy data)</p>
        <p className=" flex-1 text-left font-bold text-gray-500 px-10" >Task (dummy data)</p>
        </div>
        <div className="flex flex-row h-[300px] bg-white  h-[20rem]">
       
        <StudentGradePieChart/>
        <TaskChart />

        </div>

        
      </div>
    </>
  );
};

export default StudentOverView;
