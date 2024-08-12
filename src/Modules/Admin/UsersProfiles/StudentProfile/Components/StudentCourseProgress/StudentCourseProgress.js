import React, { useEffect, useState } from 'react'
import Module from './Module/Module'
import AllSubjects from './allSubjects/AllSubjects'
import MainSection from './Module/MainSection'
import axios from 'axios'
import { baseUrl } from '../../../../../../config/Common'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import SubjectCard from './allSubjects/SubjectCard'
import { FiLoader } from 'react-icons/fi'
const StudentCourseProgress = ({student}) => {
  const [studentSubjects,setStudentSubjects] = useState([]);
  const [selectedSubjectId,setSelectedSubjectId] = useState();
  const [loading,setLoading] = useState(false)
  const role = useSelector((store) => store.Auth.role);
  const {cid} = useParams()
  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem(`${role}:token`);
        if (!token) {
          throw new Error('Authentication token not found');
        }
        const response = await axios.get(`${baseUrl}/api/studentDashboard/subjects/${cid}`, {
          headers: { Authentication: token }
        });

        setStudentSubjects(response.data.subjects);
        setSelectedSubjectId(response.data.subjects[0]?._id)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching subjects:', err);
        setLoading(false)
      }
    };

    fetchSubjects();
  }, []);
  return (
    <>
  {loading?<div className='w-full h-[50vh] flex items-center justify-center'>
    <FiLoader className="animate-spin mr-2 w-[2rem] h-[2rem]  " />
    <p className="text-gray-800 text-sm ">Loading...</p>
  </div>:
    <div className='py-2 max-w-[68vw]'>
    <div className='pb-2'>
      <div className='flex flex-row gap-2 p-4  overflow-x-auto max-w-full '>
        {studentSubjects.map((subject, index) => (
          <div key={index} className='min-w-max' onClick={()=>setSelectedSubjectId(subject._id)}>
            <SubjectCard subject={subject} i={index} />
          </div>
        ))}
      </div>
    </div>
    <div className='border-t-2'>
      <MainSection student={student} selectedSubjectId={selectedSubjectId} />
    </div>
  </div>
  }</>
  )
}

export default StudentCourseProgress