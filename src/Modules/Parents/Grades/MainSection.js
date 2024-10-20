import React, { useEffect, useState } from "react";
import axios from "axios";
import { GoAlertFill } from "react-icons/go";
import Chapter from "../../Admin/UsersProfiles/StudentProfile/Components/StudentCourseProgress/Module/Components/Chapter";
import ModuleCard from "../../Admin/UsersProfiles/StudentProfile/Components/StudentCourseProgress/Module/Components/ModuleCard";
import { baseUrl } from '../../../config/Common'; // Ensure the correct base URL is used

const MainSection = ({ student, selectedSubjectId, role}) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState(null);

  useEffect(() => {
    if (!student || !selectedSubjectId) {
      console.log('Missing student ID or subject ID');
      return;
    }
    console.log('API Call Params:', student, selectedSubjectId);
  
    const fetchModulesAndChapters = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('parent:token');
        if (!token) throw new Error('Authentication token not found');
  
        const response = await axios.get(`${baseUrl}/admin/course/progress/student/${student}/subject/${selectedSubjectId}`, {
          headers: { Authentication: token },
        });
  
        if (response.data && response.data.data) {
          setModules(response.data.data.module);
        } else {
          setModules([]);
        }
  
        setLoading(false);
      } catch (err) {
        console.error('Error fetching modules:', err);
        setError('Failed to fetch modules.');
        setLoading(false);
      }
    };
  
    fetchModulesAndChapters();
  }, [student, selectedSubjectId]); // Notice student as string
  

  const selectModule = (module) => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const handleToggle = (id) => {
    setExpandedChapters((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex min-h-screen my-2">
      <div className="w-[65%] bg-white p-2 border-l">
        <div className="bg-white p-2 rounded-lg">
          {/* Show loading or error state */}
          {loading ? (
            <div className="flex justify-center items-center my-20 h-full w-full">
              <p className="text-gray-500">Loading data...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center my-20 h-full w-full">
              <p className="text-gray-500">Error loading data: {error}</p>
            </div>
          ) : modules?.length > 0 ? (
            modules?.map((module, index) => (
              <Chapter
                key={index}
                id={module?.moduleId}
                title={module?.name}
                chapterNumber={index + 1}
                imageUrl={module?.thumbnail}
                assignments={module?.chapters?.assignments || []}
                quizzes={module?.chapters?.quizzes || []}
                isExpanded={expandedChapters}
                onToggle={() => handleToggle(module?.moduleId)}
                role={role}
              />
            ))
          ) : (
            <div className="flex justify-center items-center font-bold text-gray-500 my-20 h-full w-full">
              <div className="flex items-center justify-center flex-col text-2xl">
                <GoAlertFill className="text-[5rem] text-gray-500" />
                No Data Found
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar for Subject and Module Info */}
      <div className="w-[35%] p-2 border-l-2">
        <div className="bg-white p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">All Modules</h2>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {modules?.length > 0 ? (
              modules?.map((module, index) => (
                <div
                  key={index}
                  onClick={() => selectModule(module)}
                  className={`cursor-pointer p-2 rounded-lg shadow-md transition-all duration-200 ${
                    module?.moduleId === expandedChapters ? "bg-purple-100" : "hover:bg-gray-50"
                  }`}
                >
                  <ModuleCard
                    title={module?.name}
                    moduleNumber={index + 1}
                    imageUrl={module?.thumbnail}
                    isCompleted={module?.isCompleted}
                    role={role}
                  />
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center font-bold text-gray-500 my-20 h-full w-full">
                <div className="flex items-center justify-center flex-col text-2xl">
                  <GoAlertFill className="text-[5rem] text-gray-500" />
                  No Modules Found
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainSection;
