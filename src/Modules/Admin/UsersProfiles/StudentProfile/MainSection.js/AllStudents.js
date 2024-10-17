import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import profileIcon from '../../../../../Assets/DashboardAssets/profileIcon.png';
import SingleStudent from './SingleStudent';
import Layout from '../../../../../Components/Common/Layout';
import DashLayout from '../../../../../Components/Admin/AdminDashLayout';
import { useDispatch, useSelector } from 'react-redux';
import { GoAlertFill } from 'react-icons/go';
import { FiLoader } from 'react-icons/fi';
import { fetchAllStudents } from '../../../../../Store/Slices/Admin/Users/Students/student.action';
import { CiUser } from 'react-icons/ci';
import { HiMiniCheckBadge } from 'react-icons/hi2';
import { fetchAllClasses } from '../../../../../Store/Slices/Admin/Class/actions/classThunk';
import StudentsFilter from './StudentsFilter';
import Spinner from '../../../../../Components/Common/Spinner';

const AllStudents = () => {
  const { allStudents, loading } = useSelector((store) => store.admin.all_students);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchAllStudents());
    dispatch(fetchAllClasses());
  }, [dispatch]);

  const [filters, setFilters] = useState({
    classId: '',
    sectionId: '',
    groupId:''
  });

  // Fetch students whenever filters change
  useEffect(() => {
    dispatch(fetchAllStudents(filters));
  }, [filters, dispatch]);

  const handleFilterChange = (name, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const colors = [
    'bg-yellow-300',
    'bg-blue-300',
    'bg-green-300',
    'bg-red-300',
    'bg-purple-300',
    'bg-pink-300',
  ];

  const hashCode = (str) => {
    let hash = 0;
    if (str?.length === 0) return hash;
    for (let i = 0; i < str?.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };

  const bgColor = (studentId) => {
    const colorIndex = hashCode(studentId) % colors.length;
    return colors[colorIndex];
  };

  return (
    <Layout title="All students">
      <DashLayout>
        <div className="w-[80vw] px-6">
          <StudentsFilter onFilterChange={handleFilterChange} filters={filters} />
        </div>
        {loading ? (
          <div className="flex w-full h-[80vh] flex-col items-center justify-center">
            <Spinner/>
            <p className="text-gray-800 text-lg">Loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {allStudents?.length > 0 ? (
              allStudents?.map((student) => (
                <div key={student?._id} className={`${bgColor(student?._id)} p-6 rounded-lg shadow-md text-white relative`}>
                  <div className="absolute top-4 right-4 bg-white rounded-full">
                    <HiMiniCheckBadge className="text-green-500 text-2xl" />
                  </div>
                  <NavLink to={`/users/students/${student?._id}`}>
                    <div className="mb-4">
                      <h2 className="text-lg font-semibold">{student?.firstName}</h2>
                      <p className="text-sm">{student?.email}</p>
                      <div className="flex items-center mt-2 text-sm">
                        <p>Contact: {student?.contactNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center mt-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white flex justify-center items-center bg-white text-gray-800">
                        {student?.profile ? (
                          <img src={student?.profile} alt="Student" className="w-full h-full object-cover" />
                        ) : (
                          <CiUser size={24} />
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">ID: {student?.admissionNumber}</p>
                        <p className="text-sm">Parent: {student?.parentsName}</p>
                      </div>
                    </div>
                  </NavLink>
                </div>
              ))
            ) : (
              <div className="flex w-[80vw] text-gray-500 h-[90vh] items-center justify-center flex-col text-2xl">
                <GoAlertFill className="text-[5rem]" />
                No Student Found
              </div>
            )}
          </div>
        )}
      </DashLayout>
    </Layout>
  );
};

export default AllStudents;
