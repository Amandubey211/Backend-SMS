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
import { GoAlertFill } from 'react-icons/go';
import { FiLoader } from 'react-icons/fi';
// Layout DashLayout

const AllStudents = () => {
  const { fetchAllStudents,loading } = useGetAllStudents();
  const students = useSelector((store) => store.Students.allStudent);
  useEffect(() => {
    fetchAllStudents();
    // fetchSubjects(cid);
    console.log(students);
  }, []);
 
  
  return (
    <Layout title="All students">
      <DashLayout>
      {loading?<div className="flex w-full h-[90vh] flex-col items-center justify-center">
    <FiLoader className="animate-spin mr-2 w-[3rem] h-[3rem] " />
    <p className="text-gray-800 text-lg">Loading...</p>
    </div>:
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
    {
      students.length > 0 ?
    students.map((student) => (
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
         <div className='flex flex-col w-[50%]'>
        <p className="text-gray-600"><span className="font-medium">Parents:</span> {student?.fatherName.slice(0,7)}..</p>
        <p className="text-gray-600">  & {student?.motherName}  </p>
         </div>

        </div>
        
      </NavLink>
    )):  <div>
    <div className="flex w-[80vw] text-gray-500 h-[90vh] items-center justify-center flex-col text-2xl">
<GoAlertFill className="text-[5rem]" />
No  Data Found
</div>
</div>}
  </div>}
  </DashLayout>
    </Layout>
  );
};

export default AllStudents;
