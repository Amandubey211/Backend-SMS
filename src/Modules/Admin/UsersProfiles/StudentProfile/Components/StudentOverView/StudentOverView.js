import React, { useEffect } from "react";
 import AttendanceGraph from "./AttendanceGraph";
 import StudentGradePieChart from "./StudentGradePieChart";
import TaskChart from "./TaskChart";
import AllSubjects from "../StudentCourseProgress/allSubjects/AllSubjects";
import { fetchAttendanceData} from "../../../../../../Store/Slices/Admin/Users/Students/student.action";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

const StudentOverView = () => {
  const {cid} = useParams()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchAttendanceData(cid))
  }, [dispatch])
  return (
    <>
       <div className="flex flex-col">
        <div className="" >
          <AllSubjects />
        </div>
        
         <div className="mt-4 w-full h-96 p-5 justify-center items-center flex self-center border-t-2 flex-col  ">
          <h1 className="mb-4 font-bold">Attendance</h1>
          <AttendanceGraph />
        </div> 
        <div className='flex justify-between  w-[100%]  border-t-2'> 
        <p className="px-4 w-[50%] font-bold text-gray-500" >Student Grade </p>
        <p className=" flex-1 text-left font-bold text-gray-500 px-10" >Task</p>
        </div>



        <div className="flex flex-row bg-white  h-[20rem] w-full">

       
        <StudentGradePieChart/>
        <TaskChart />

        </div>

        
      </div> 
    </>
  );
};

export default StudentOverView;
