import React from 'react'
import SubjectsSlider from './SubjectsSlider';

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
  return (
    <div className="p-4 ">
      <SubjectsSlider subjects={subjects} />
    </div>
  )
}

export default AllSubjects