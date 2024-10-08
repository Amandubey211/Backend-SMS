import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SubjectSideBar from "../../Component/SubjectSideBar";
import GradeAccordionItem from "./StudentGradeViewModal/Component/GradeAccordionItem";
import StudentGradeSummary from "./StudentGradeViewModal/Component/StudentGradeSummary";
import Spinner from "../../../../../../Components/Common/Spinner";
import NoDataFound from "../../../../../../Components/Common/NoDataFound";
import { useParams } from "react-router-dom";
import { fetchStudentGrades } from "../../../../../../Store/Slices/Admin/Users/Students/student.action";

const MainSection = () => {
const {sid,cid} = useParams();
const {grades,loading} = useSelector((store) => store.admin.all_students);
const {userDetails,classInfo} = useSelector((store) => store.common.user);
const dispatch = useDispatch();
const getStudentGrades = ()=>{
    const params = {};
      if (sid){
        params.subjectId = sid;
        dispatch(fetchStudentGrades({params,studentId:userDetails?.userId
          ,studentClassId:cid}));
      } 
  }
  useEffect(()=>{
    getStudentGrades();
    console.log(userDetails,classInfo);
    
  },[dispatch])

  let content;
  if (loading) {
    content = (
      <div className="flex justify-center items-center w-full h-full">
        <Spinner />
      </div>
    );
  } else if (
    !grades
) {
    content = <NoDataFound title="Grades" />;
  } else {
    const studentData = {
      avatar: grades?.student?.profile,
      name: grades?.student?.fullName,
      //need section name in userdetails
      section: 'section',
      assignment: grades?.totalScoreOfAllAssignments,
      groupAssignment: grades?.totalGroupAssignmentScore,
      quiz: grades?.totalScoreOfAllQuizzes,
      groupQuiz: grades?.totalGroupQuizScore,
      attendance: grades?.attendance,
      totalGroupAssignmentScore: grades?.submittedGroupAssignmentScore,
      totalAssignmentScore: grades?.totalScoreOfSubmitAssignments,
      totalGroupQuizScore: grades?.submittedGroupQuizScore,
      totalQuizCompletedScore: grades?.totalQuizCompletedScore,
      total: grades?.total,
    };

    content = (
      <div className="flex flex-row w-full h-full">
        <div className="w-[70%] p-4 min-h-full">
          <GradeAccordionItem grade={grades?.grades} />
        </div>
        <div className="w-[30%] h-full border-l border-gray-200">
          <StudentGradeSummary studentGrade={studentData} />
        </div>
      </div>
    );
  }
  return (
    <div className="flex w-full h-full">
      <SubjectSideBar />
      <div className="flex-grow p-4 border-l h-full">
        {content}
        </div>
    </div>
  );
};

export default MainSection;
