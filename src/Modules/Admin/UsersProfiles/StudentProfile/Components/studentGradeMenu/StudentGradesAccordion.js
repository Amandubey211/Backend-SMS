import React, { useEffect, useState } from "react";
import GradeAccordionItem from "./GradeAccordionItem";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { baseUrl } from "../../../../../../config/Common";
import toast from "react-hot-toast";

const StudentGradesAccordion = ({ student }) => {
  const [studentGrades,setStudentGrades] = useState()
const dispatch = useDispatch();

    const role = useSelector((store) => store.Auth.role);

  const getgrades = async(subjectId) => {

      try {
        const token = localStorage.getItem(`${role}:token`);
        const data  = await axios.get(`${baseUrl}/admin/grades/student/6b1bb0463300d030889b1b2/class/667a538515f88ca8fc97d489/?subject/${subjectId}`, {
          headers: { Authentication: token },
        });
    setStudentGrades(data.data);
    
      } catch (error) {
        const errorMessage =
          error.response?.data?.msg || "Something went wrong. Please try again.";
        toast.error(errorMessage);
        console.log(error);
      }
  };
  useEffect(()=>{
  getgrades()
  },[])

  return (
    <>
      <div className="flex flex-row w-[100%]"> 
        <div  className="w-[80%] ">
      
            <GradeAccordionItem  getData={(subjectId)=>getgrades(subjectId)} grades={studentGrades?.grades} />
        </div>
        <div className="w-[30%] h-[100vh] border-l-2">
        <div className=" mt-4 p-3">
        <h3 className="text-md font-semibold mb-4">Grade Summary</h3>
        <div className="flex justify-between mb-2">
          <p className="text-sm">Assignment</p>
          <p className="text-sm">{studentGrades?.totalScoreOfSubmitAssignments} / {studentGrades?.totalScoreOfAllAssignments || 0}</p>
        </div>
        {/* <div className="flex justify-between mb-2">
          <p className="text-sm">Group Assignment</p>
          <p className="text-sm">{ "0"} / {totalScoreOfAllAssignment}</p>
        </div> */}
        <div className="flex justify-between mb-2">
          <p className="text-sm">Quiz</p>
          <p className="text-sm">{ studentGrades?.totalQuizCompletedScore} / {studentGrades?.totalScoreOfAllQuizzes || 0}</p>
        </div>
        {/* <div className="flex justify-between mb-2">
          <p className="text-sm">Group Quiz</p>
          <p className="text-sm">{ "0"} / 330</p>
        </div> */}
        <div className="flex justify-between mb-2">
          <p className="text-sm">Attendance</p>
          <p className="text-sm">09 / 135 DAY</p>
        </div>
      </div>
      <div className="border-t mt-4 flex p-3 justify-between px-4 gap-1">
        <p className="text-lg font-semibold">Total Score:</p>
        <p className="text-pink-500 text-xl font-semibold">
          {studentGrades?.total }
        </p>
      </div>
          </div>
      </div>
    </>
  );
};

export default StudentGradesAccordion;
