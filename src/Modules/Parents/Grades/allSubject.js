import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FiLoader } from 'react-icons/fi'
import { GoAlertFill } from 'react-icons/go'
import SubjectCard from '../../Admin/UsersProfiles/StudentProfile/Components/StudentCourseProgress/allSubjects/SubjectCard'
import { baseUrl } from '../../../config/Common'
import MainSection from './MainSection.js'
const AllSubject = ({studentId}) => {
    const students = JSON.parse(localStorage.getItem('childrenData'));
    const student = students?.find((i)=>i.id == studentId ) 
  const [studentSubjects,setStudentSubjects] = useState([]);
  const [selectedSubjectId,setSelectedSubjectId] = useState();
  const [loading,setLoading] = useState(false)
  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem(`parent:token`);
        if (!token) {
          throw new Error('Authentication token not found');
        }
        const response = await axios.get(`${baseUrl}/api/studentDashboard/subjects/${studentId}`, {
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
    <div className='py-2 w-full '>
    <div className='pb-2 flex w-full flex-row'>
      <div className='flex flex-col gap-2 p-4 w-[25%]  '>
        {studentSubjects.length > 0?
        studentSubjects.map((subject, index) => (
          <div key={index} className={`w-[270px] ${subject._id == selectedSubjectId?'border border-black rounded-lg':''}`} onClick={()=>setSelectedSubjectId(subject._id)}>
            <SubjectCard subject={subject} i={index} />
          </div>
        )):<div className="flex w-full h-full text-gray-500  items-center justify-center flex-col text-xl">
        <GoAlertFill className="text-[3rem]" />
        No  Data Found
        </div>
      }
      </div>
      <div className='border-t-2 w-[75%]'>
      <MainSection student={student} selectedSubjectId={selectedSubjectId} />
    </div> 
    </div>
     
  </div>
  }</>
  )
}

export default AllSubject