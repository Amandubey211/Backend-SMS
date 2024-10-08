import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import SubjectCard from './allSubjects/SubjectCard'
import { FiLoader } from 'react-icons/fi'
import { GoAlertFill } from 'react-icons/go'
import { fetchCourseProgress, fetchStudentSubjectProgress } from '../../../../../../Store/Slices/Admin/Users/Students/student.action'
import MainSection from './Module/MainSection'
const StudentCourseProgress = ({student}) => {
  const {cid} = useParams()
  const {studentSubjectProgress,loading} = useSelector((store) => store.admin.all_students);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchStudentSubjectProgress(cid)).then(()=>{
      dispatch(
        fetchCourseProgress({ studentId: cid, subjectId: studentSubjectProgress[0]?.subjectId })
      )
    });
  }, []);

  const fetchModules = (subjectId)=>{
    dispatch(
      fetchCourseProgress({ studentId: cid, subjectId: subjectId })
    )
  }
  return (
    <>
  {loading?<div className='w-full h-[50vh] flex items-center justify-center'>
    <FiLoader className="animate-spin mr-2 w-[2rem] h-[2rem]  " />
    <p className="text-gray-800 text-sm ">Loading...</p>
  </div>:
    <div className='py-2 max-w-[68vw]'>
    <div className='pb-2'>
      <div className='flex flex-row gap-2 p-4  overflow-x-auto max-w-full '>
        {studentSubjectProgress.length > 0?
        studentSubjectProgress.map((subject, index) => (
          <div key={index} className='min-w-max' onClick={()=>fetchModules(subject.subjectId)}>
            <SubjectCard subject={subject} i={index} />
          </div>
        )):<div className="flex w-full h-full text-gray-500  items-center justify-center flex-col text-xl">
        <GoAlertFill className="text-[3rem]" />
        No  Data Found
        </div>
      }
      </div>
    </div>
    <div className='border-t-2'>
       <MainSection /> 
    </div>
  </div>
  }</>
  )
}

export default StudentCourseProgress