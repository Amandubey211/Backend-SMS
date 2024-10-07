import React, { useEffect, useState } from "react";
import Chapter from "./Components/Chapter";
import ModuleCard from "./Components/ModuleCard";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../../../config/Common";
import { GoAlertFill } from "react-icons/go";

const MainSection = ({ student,selectedSubjectId }) => {
  const [expandedChapters, setExpandedChapters] = useState(null);
  const [modules, setModules] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [studentSubjects, setStudentSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState();
  const { cid } = useParams();
  const role = useSelector((store) => store.Auth.role);

  const fetchModules = async (subjectId) => {
    try {
      const token = localStorage.getItem(`${role}:token`);
      if (!token) {
        throw new Error('Authentication token not found');
      }
      const response = await axios.get(`${baseUrl}/admin/student/classes/${student.presentClassId}/modules/${selectedSubjectId}`, {
        headers: { Authentication: token }
      });
      setModules(response.data.data.modules);
      setChapters(response.data.data.modules[0]?.chapters || []);
      console.log('Modules fetched:', response.data.data);
    } catch (err) {
      console.error('Error fetching modules:', err);
    }
  };
  useEffect(()=>{
    fetchModules(selectedSubjectId);
  },[selectedSubjectId])

  const selectModule = (module) => {
    setChapters(module?.chapters || []);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }
  const handleToggle = (id) => {
    if (expandedChapters == id) {
      setExpandedChapters(null)
    } else {
      setExpandedChapters(id)
    }




  };

  return (
    <div className="flex min-h-screen my-2">
      <div className="w-[65%] bg-white p-2 border-l">
        <div className="bg-white p-2 rounded-lg">
          <div className="flex justify-between items-center mb-5">
            {/* Add Chapter Button (if needed) */}
          </div>
          {chapters.length > 0 ?
            chapters.map((chapter, index) => (
              <Chapter
                key={index}
                id={chapter._id}
                title={chapter?.name}
                chapterNumber={index + 1}
                imageUrl={chapter?.thumbnail}
                assignments={chapter.assignments}
                quizzes={chapter.quizzes}
                isExpanded={expandedChapters}
                onToggle={() => handleToggle(chapter._id)}
              />
            )) : <div className="flex justify-center items-center font-bold text-gray-500 my-20 h-full w-full">
               <div className="flex  items-center justify-center flex-col text-2xl ">
        <GoAlertFill className="text-[5rem] text-gray-500" />
       No  Data Found
      </div>
              </div>}
        </div>
      </div>
      <div className="w-[35%] p-2 border-l-2">
        <div className="bg-white p-4 rounded-lg">
          <div className="flex items-center gap-1 mb-2">
            <p className="bg-gradient-to-r from-pink-100 to-purple-200 font-semibold rounded-full p-1 px-2">
              <span className="text-gradient">{modules?.length}</span>
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {modules?.map((module, index) => (
              <div onClick={() => selectModule(module)} className={`cursor-pointer ${module?.chapters[0]?._id == chapters[0]?._id ? 'border border-stone-900 rounded-lg' : null}`} >
                <ModuleCard
                  key={index}
                  title={module.moduleName}
                  moduleNumber={module.moduleNumber}
                  imageUrl={module.thumbnail}
                  isCompleted={module.isCompleted}
                /> </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainSection;
