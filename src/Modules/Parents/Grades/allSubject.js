import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiLoader } from 'react-icons/fi';
import { GoAlertFill } from 'react-icons/go';
import SubjectCard from '../../Admin/UsersProfiles/StudentProfile/Components/StudentCourseProgress/allSubjects/SubjectCard';
import { baseUrl } from '../../../config/Common';
import MainSection from './MainSection.js';

const AllSubject = ({ studentId }) => {
  const students = JSON.parse(localStorage.getItem('childrenData')) || [];
  const student = students?.find((i) => i.id == studentId);
  console.log('Student ID:', studentId);
  const [studentSubjects, setStudentSubjects] = useState([]); // Initialize with an empty array
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching
      try {
        const token = localStorage.getItem('parent:token');
        if (!token) {
          throw new Error('Authentication token not found');
        }

        // Fetch subjects from the API
        const response = await axios.get(`${baseUrl}/admin/course/subjects/student/${studentId}`, {
          headers: { Authentication: token }
        });

        if (response.data && response.data.data && response.data.data.length > 0) {
          setStudentSubjects(response.data.data); // Set subjects from the response
          setSelectedSubjectId(response.data.data[0]?.subjectId || null); // Set the first subjectId
        } else {
          setStudentSubjects([]); // Set empty if no subjects found
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching subjects:', err);
        setError('Failed to fetch subjects');
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [studentId]);

  return (
    <>
      {loading ? (
        <div className='w-full h-[50vh] flex items-center justify-center'>
          <FiLoader className="animate-spin mr-2 w-[2rem] h-[2rem]" />
          <p className="text-gray-800 text-sm">Loading...</p>
        </div>
      ) : error ? (
        <div className="flex w-full h-full text-gray-500 items-center justify-center flex-col text-xl">
          <GoAlertFill className="text-[3rem]" />
          {error}
        </div>
      ) : (
        <div className='py-2 w-full'>
          <div className='pb-2 flex w-full flex-row'>
            <div className='flex flex-col gap-2 p-4 w-[25%]'>
              {/* Safeguard against null/undefined and map subjects */}
              {studentSubjects && studentSubjects.length > 0 ? (
                studentSubjects.map((subject, index) => (
                  <div
                    key={index}
                    className={`w-[270px] transition-all duration-300 transform 
    ${subject.subjectId === selectedSubjectId ? 'bg-gray-100 shadow-lg scale-105' : 'bg-white shadow-md rounded-lg'}`}
                    onClick={() => {
                      setSelectedSubjectId(subject.subjectId);
                      console.log('Selected Subject ID:', subject.subjectId);  // Log the selected subject ID
                    }}
                  >
                    <SubjectCard subject={subject} i={index} />
                  </div>



                ))
              ) : (
                <div className="flex w-full h-full text-gray-500 items-center justify-center flex-col text-xl">
                  <GoAlertFill className="text-[3rem]" />
                  No Data Found
                </div>
              )}
            </div>
            <div className='border-t-2 w-[75%]'>
              {console.log("This is studentID: ", studentId, "This is select Subject id: ", selectedSubjectId)}
              <MainSection student={studentId} selectedSubjectId={selectedSubjectId} />

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AllSubject;
