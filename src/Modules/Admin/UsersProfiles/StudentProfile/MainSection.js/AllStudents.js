import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import profileIcon  from '../../../../../Assets/DashboardAssets/profileIcon.png'
import { dummyStudentsList } from '../dummyData/dummyData'; // Ensure this path is correct
// import Layout from '../../../../Components/Common/Layout';
// import DashLayout from '../../../../Components/Admin/AdminDashLayout';
import SingleStudent from './SingleStudent';
import Layout from '../../../../../Components/Common/Layout';
import DashLayout from '../../../../../Components/Admin/AdminDashLayout';
import useGetAllStudents from '../../../../../Hooks/AuthHooks/Staff/Admin/Students/useGetAllStudents';
import { useSelector } from 'react-redux';
// Layout DashLayout

const AllStudents = () => {
  const { fetchAllStudents } = useGetAllStudents();
  const students = useSelector((store) => store.Students.allStudent);
  useEffect(() => {
    fetchAllStudents();
    // fetchSubjects(cid);
    console.log(students);
  }, []);
 
  
  return (
    <Layout title="All students">
      <DashLayout>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
    {students.map((student) => (
      <NavLink 
        key={student.id} 
        to={`/user/${student?._id}`} 
        className="block p-6 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition border items-center justify-center"
      >
   <div className='flex w-full items-center'>
   <img src={student.profile || profileIcon} alt='' className='w-[3rem] h-[3rem] rounded-full bg-gray-200 border'/>
   </div>
        <div className='flex flex-row w-full items-center gap-4'>
          <div className='flex flex-col w-[50%] gap-[-10px]'>
          <p className=" font-bold">{student.firstName}</p>
            <p className="text-gray-600 w-[50%]"><span className="font-medium">ID:</span>{student.admissionNumber}</p> 
          </div>
         
        <p className="text-gray-600"><span className="font-medium">Parents:</span> {student.fatherName} & {student.motherName}</p>
        </div>
        
      </NavLink>
    ))}
  </div>
  </DashLayout>
    </Layout>
  );
};

export default AllStudents;
