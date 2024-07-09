import React from 'react'
import { NavLink, useParams } from 'react-router-dom'

const AssignmentHeader = () => {
    const {sid,cid} = useParams()
  return (
    <div className='flex justify-between p-4 items-center border-b'>
        <h1 className='text-lg'>All Assignment</h1>
        <NavLink
        to={`/class/${cid}/${sid}/createassignment`}
              className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-4 py-2 rounded-md shadow"
            >
              + Add New Assignment
            </NavLink>
    </div>
  )
}

export default AssignmentHeader
