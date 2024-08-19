import React, { useEffect, useState } from "react";
import GradeAccordionItem from "./GradeAccordionItem";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { FiLoader } from "react-icons/fi";
import { baseUrl } from "../../../config/Common";
import { useParams } from "react-router-dom";
const StudentGradesAccordion = () => {
    const {studentId} = useParams()
    const students = JSON.parse(localStorage.getItem('childrenData'));
    const student = students?.find((i)=>i.id == studentId ) 
  const [grades,setGrades] = useState();
  const [loading,setLoading] = useState();
  const fetchStudentGrades = async(subjectId,moduleId,chapterId,arrangeBy)=>{
      const params = {};
        if (moduleId) params.moduleId = moduleId;
        if (chapterId) params.chapterId = chapterId;
        if (arrangeBy) params.arrangeBy = arrangeBy;
      setLoading(true);
      try {
        const token = localStorage.getItem(`parent:token`);
        const response = await axios.get(
          `${baseUrl}/admin/grades/student/${student.id}/class/${student.presentClassId}/?subjectId=${subjectId}`,
          {
            headers: { Authentication: token },
            params:params
          }
        );
        if (response.data.success) {
          setGrades(response.data);
        }
        setLoading(false);
      } catch (err) {
        console.log(err.response?.data?.message );
       setLoading(false);
      }
    }
    useEffect(()=>{
      fetchStudentGrades()
    },[])
  return (
    <>
      <div className="flex flex-row w-[100%]"> 
        <div  className="w-[75%] ">
    
            <GradeAccordionItem  getData={(subjectId)=>fetchStudentGrades(subjectId)} grades={grades?.grades} loading={loading} />
          
        </div>
        <div className="mt-4 p-3 w-[25%] border-l-2">
        <div className="flex flex-col items-center mb-8">
        <img src={student?.profile} alt="image" className="w-[5rem] h-[5rem] rounded-full"/>
        <h2 className="text-2xl font-medium text-gray-800">{student?.name}</h2>
        <p className="text-gray-500">Section: {student?.section}</p>
      </div>
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
        <div className="border-t mt-4 flex p-3 justify-between  gap-1">
        <p className="text-lg font-semibold">Total Score:</p>
        <p className="text-pink-500 text-xl font-semibold">
          {
            grades?.total
          }
        </p>
      </div>
      </div>
     
      </div>
    </>
  );
};

export default StudentGradesAccordion;
