import React from 'react'
import Module from './Module/Module'
import AllSubjects from './allSubjects/AllSubjects'
import MainSection from './Module/MainSection'
const StudentCourseProgress = () => {
  return (
    <div className='py-2'>
      <div className='pb-2'>
      <p className='p-4 font-semibold'>All Subjects</p>
      <AllSubjects/>
      </div>
       <div className=' border-t-2'>
       <MainSection/>
       </div>

    </div>
  )
}

export default StudentCourseProgress