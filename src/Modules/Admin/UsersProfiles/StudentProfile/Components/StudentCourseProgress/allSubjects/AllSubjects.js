import React, { useEffect, useState } from 'react'
import SubjectsSlider from './SubjectsSlider';
import { useParams } from 'react-router-dom';
import { baseUrl } from '../../../../../../../config/Common';
import { useSelector } from 'react-redux';
import axios from 'axios';

const subjects = [
    {
      name: "Bangla 1st paper",
      startDate: "01-05-2024",
      totalModules: 25,
      completedModules: 17,
      progress: 85
    },
    {
      name: "Bangla 2nd paper",
      startDate: "01-05-2024",
      totalModules: 25,
      completedModules: 17,
      progress: 85
    },
    {
      name: "Bangla 2nd paper",
      startDate: "01-05-2024",
      totalModules: 25,
      completedModules: 17,
      progress: 85
    },
    {
      name: "Bangla 2nd paper",
      startDate: "01-05-2024",
      totalModules: 25,
      completedModules: 17,
      progress: 85
    },
    {
      name: "Bangla 2nd paper",
      startDate: "01-05-2024",
      totalModules: 25,
      completedModules: 17,
      progress: 85
    },
    // More subjects...
  ];
 
const AllSubjects = () => {
  const [studentSubjects,setStudentSubjects] = useState([]);
  const role = useSelector((store) => store.Auth.role);
  const {cid} = useParams()
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const token = localStorage.getItem(`${role}:token`);
        if (!token) {
          throw new Error('Authentication token not found');
        }
        const response = await axios.get(`${baseUrl}/api/studentDashboard/subjects/${cid}`, {
          headers: { Authentication: token }
        });

        setStudentSubjects(response.data.subjects);
        console.log(response.data.subjects);
      } catch (err) {
        console.error('Error fetching subjects:', err);
      }
    };

    fetchSubjects();
  }, []);
  return (
    <div className="px-4">
      <SubjectsSlider subjects={studentSubjects} />
    </div>
  )
}

export default AllSubjects