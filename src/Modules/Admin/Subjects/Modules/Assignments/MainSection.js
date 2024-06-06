import React from 'react'
import SubjectSideBar from '../../Component/SubjectSideBar'
import AssignmentDetailCard from './AssignmentComponents/AssignmentDetailCard'

const MainSection = () => {
  return (
    <div className='flex gap-1 '>
        <SubjectSideBar/>
        <div className='w-[60%]'>

        </div>
        <div className='w-[35%]'>
          <AssignmentDetailCard/>
        </div>
      
    </div>
  )
}

export default MainSection
