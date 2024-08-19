import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { GoAlertFill } from "react-icons/go";
import { baseUrl } from "../../../config/Common";
import Chapter from "../../Admin/UsersProfiles/StudentProfile/Components/StudentCourseProgress/Module/Components/Chapter";
import ModuleCard from "../../Admin/UsersProfiles/StudentProfile/Components/StudentCourseProgress/Module/Components/ModuleCard";


const MainSection = ({ student, selectedSubjectId }) => {
  const [expandedChapters, setExpandedChapters] = useState(null);
  const [modules, setModules] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [studentSubjects, setStudentSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState();
  const role = useSelector((store) => store.Auth.role);

  // Memoize the fetchModules function to prevent unnecessary re-creations
  const fetchModules = useCallback(async (subjectId) => {
    try {
      const token = localStorage.getItem(`${role}:token`);
      if (!token) {
        throw new Error('Authentication token not found');
      }
      const response = await axios.get(`${baseUrl}/admin/parent/classes/${student.presentClassId}/modules/${subjectId}/studentId/${student.id}`, {
        headers: { Authentication: token },

      });
      const modulesData = response.data.data.modules;
      setModules(modulesData);
      setChapters(modulesData[0]?.chapters || []);
      console.log('Modules fetched:', modulesData);
    } catch (err) {
      console.error('Error fetching modules:', err);
    }
  }, [role, student.presentClassId, student.id]);

  // Fetch modules only when selectedSubjectId changes
  useEffect(() => {
    if (selectedSubjectId) {
      fetchModules(selectedSubjectId);
    }
  }, [selectedSubjectId, fetchModules]);

  const selectModule = (module) => {
    setChapters(module?.chapters || []);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const token = localStorage.getItem(`parent:token`);
        if (!token) {
          throw new Error('Authentication token not found');
        }
        const response = await axios.get(`${baseUrl}/api/studentDashboard/subjects/${student.id}`, {
          headers: { Authentication: token },
        });

        const subjects = response.data.subjects;
        setStudentSubjects(subjects);
        if (subjects?.length > 0) {
          const firstSubjectId = subjects[0]._id;
          setSelectedSubject(firstSubjectId);
        }
      } catch (err) {
        console.error('Error fetching subjects:', err);
      }
    };

    fetchSubjects();
  }, [student.id]);

  const handleToggle = (id) => {
    setExpandedChapters((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex min-h-screen my-2">
      <div className="w-[65%] bg-white p-2 border-l">
        <div className="bg-white p-2 rounded-lg">
          <div className="flex justify-between items-center mb-5">
            {/* Add Chapter Button (if needed) */}
          </div>
          {chapters.length > 0 ? (
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
            ))
          ) : (
            <div className="flex justify-center items-center font-bold text-gray-500 my-20 h-full w-full">
              <div className="flex items-center justify-center flex-col text-2xl ">
                <GoAlertFill className="text-[5rem] text-gray-500" />
                No Data Found
              </div>
            </div>
          )}
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
              <div
                key={index}
                onClick={() => selectModule(module)}
                className={`cursor-pointer ${
                  module?.chapters[0]?._id === chapters[0]?._id
                    ? 'border border-stone-900 rounded-lg'
                    : ''
                }`}
              >
                <ModuleCard
                  title={module.moduleName}
                  moduleNumber={module.moduleNumber}
                  imageUrl={module.thumbnail}
                  isCompleted={module.isCompleted}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainSection;
