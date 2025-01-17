import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import SubjectCard from './allSubjects/SubjectCard'
import { FiLoader } from 'react-icons/fi'
import { GoAlertFill } from 'react-icons/go'
import { fetchCourseProgress, fetchStudentSubjectProgress } from '../../../../../../Store/Slices/Admin/Users/Students/student.action'
import MainSection from './Module/MainSection'
import Spinner from '../../../../../../Components/Common/Spinner'
import ProtectedSection from '../../../../../../Routes/ProtectedRoutes/ProtectedSection'
const StudentCourseProgress = ({student}) => {
  const {cid} = useParams()
  const {studentSubjectProgress,loading} = useSelector((store) => store.admin.all_students);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchStudentSubjectProgress(cid)).then(()=>{
      if(studentSubjectProgress?.length > 0){
      dispatch(
        fetchCourseProgress({ studentId: cid, subjectId: studentSubjectProgress[0]?.subjectId })
      )}
    });
  }, []);
  const fetchModules = (subjectId)=>{
    dispatch(
      fetchCourseProgress({ studentId: cid, subjectId: subjectId })
    )
  }
  return (
    <>
  {loading?<div className='w-full h-[90vh] flex items-center justify-center text-gray-600'>
    <Spinner/>
  </div>:
  <ProtectedSection requiredPermission={"viewstudentprogress"}>
    <div className='py-2 max-w-[68vw]'>
    <div className='pb-2'>
      <div className='flex flex-row gap-2 p-4  overflow-x-auto max-w-full '>
        {studentSubjectProgress?.length > 0?
        studentSubjectProgress?.map((subject, index) => (
          <div key={index} className='min-w-max' onClick={()=>fetchModules(subject.subjectId)}>
            <SubjectCard subject={subject} i={index} />
          </div>
        )):<div className="flex w-full h-full text-gray-500  items-center justify-center flex-col text-xl">
        <GoAlertFill className="text-[3rem]" />
        No  Module Found
        </div>
      }
      </div>
    </div>
    <div className='border-t-2'>
       <MainSection /> 
    </div>
  </div></ProtectedSection>
  }</>
  )
}

export default StudentCourseProgress