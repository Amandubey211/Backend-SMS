import React, { useEffect, useState } from "react";
import GradeAccordionItem from "./GradeAccordionItem";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { baseUrl } from "../../../../../../config/Common";
import toast from "react-hot-toast";
import { FiLoader } from "react-icons/fi";
const StudentGradesAccordion = ({student}) => {
  const [grades,setGrades] = useState();
  const [loading,setLoading] = useState();
  const { role } = useSelector((store) => store.Auth);
  const fetchStudentGrades = async(subjectId,moduleId,chapterId,arrangeBy)=>{
      const params = {};
        if (moduleId) params.moduleId = moduleId;
        if (chapterId) params.chapterId = chapterId;
        if (arrangeBy) params.arrangeBy = arrangeBy;
      setLoading(true);
      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.get(
          `${baseUrl}/admin/grades/student/${student._id}/class/${student.presentClassId}/?subjectId=${subjectId}`,
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
    </>
  );
};

export default StudentGradesAccordion;
