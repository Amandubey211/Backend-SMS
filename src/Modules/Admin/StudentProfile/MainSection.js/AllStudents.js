import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { dummyStudentsList } from '../dummyData/dummyData'; // Ensure this path is correct
import Layout from '../../../../Components/Common/Layout';
import DashLayout from '../../../../Components/Admin/AdminDashLayout';
import SingleStudent from './SingleStudent';


const AllStudents = () => {
  return (
    <Layout title="All students">
      <DashLayout>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
    {dummyStudentsList.map((student) => (
      <NavLink 
        key={student.id} 
        to={`/user/${student.id}`} 
        className="block p-6 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition"
      >
        <h3 className="text-2xl font-semibold mb-2">{student.name}</h3>
        <p className="text-gray-600"><span className="font-medium">ID:</span> {student.id}</p>
        <p className="text-gray-600"><span className="font-medium">Parents:</span> {student.information.parents.fatherName} & {student.information.parents.motherName}</p>
      </NavLink>
    ))}
  </div>
  </DashLayout>
    </Layout>
  );
};

export default AllStudents;
