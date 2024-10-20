import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentGrades } from "../../../Store/Slices/Admin/Users/Students/student.action";
import { useParams } from "react-router-dom";
import GradeAccordionItem from './GradeAccordionItem'
const StudentGradesAccordion = () => {
  const {grades,loading} = useSelector((store) => store.admin.all_students);
  const { children} = useSelector((state) => state?.Parent?.children || {});
  const {studentId} = useParams();
  const Child = children?.filter((i)=>i.id ==studentId )
  const dispatch = useDispatch();
  const getStudentGrades = async(subjectId,moduleId,chapterId,arrangeBy)=>{
      const params = {};
        if (subjectId) params.subjectId = subjectId;
        if (moduleId) params.moduleId   = moduleId;
        if (chapterId) params.chapterId = chapterId;
        if (arrangeBy) params.arrangeBy = arrangeBy;
        dispatch(fetchStudentGrades({params,studentId:studentId,studentClassId:Child[0]?.presentClassId}));
    }
    useEffect(()=>{
      getStudentGrades();
      
    },[dispatch])
  return (
    <>
      <div className="flex flex-row w-[100%]"> 
        <div  className="w-[75%] ">
            <GradeAccordionItem getData={(subjectId)=>getStudentGrades(subjectId)}  />
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
