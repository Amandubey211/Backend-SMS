import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { GoAlertFill } from "react-icons/go";
import Chapter from "./Components/Chapter";
import ModuleCard from "./Components/ModuleCard";
import { baseUrl } from '../../../config/Common';

const MainSection = ({ selectedSubjectId }) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null); // Track selected module

  // Fetch childrenData and presentClassId from Redux
  const childrenData = useSelector((state) => state.Parent.children.children);
  const presentClassId = childrenData && childrenData[0]?.presentClassId;
  const studentId = childrenData && childrenData[0]?.id; // Assuming 'id' is the field for student ID

  console.log("Children Data:", childrenData);
  console.log("Student ID:", studentId);

  // Fetch modules and chapters
  useEffect(() => {
    if (!selectedSubjectId) {
      setModules([]);  // Clear previous modules
      setSelectedModule(null); // Clear selected module
      setError(null); // Clear any errors
      console.log("Missing presentClassId or selectedSubjectId:", { selectedSubjectId });
      return;
    }
  
    const fetchModulesAndChapters = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("parent:token");
        if (!token) throw new Error("Authentication token not found");
  
        const response = await axios.get(
          `${baseUrl}/admin/course/progress/student/${studentId}/subject/${selectedSubjectId}`,
          {
            headers: { Authentication: token },
          }
        );
  
        if (response.data && response.data.data) {
          setModules(response.data.data.module);

          // Automatically select the first module and load its chapters
          if (response.data.data.module.length > 0) {
            setSelectedModule(response.data.data.module[0]);  // Auto-select the first module
          }
        } else {
          setModules([]); // If no modules found, reset the data
        }
  
        setLoading(false);
      } catch (err) {
        console.error("Error fetching modules:", err);
        setError("Failed to fetch modules.");
        setModules([]);  // Reset modules on error
        setLoading(false);
      }
    };
  
    fetchModulesAndChapters();
  }, [presentClassId, selectedSubjectId, studentId]); // Dependencies ensure that it reloads when subject changes
  

  const selectModule = (module) => {
    setSelectedModule(module); // Set the selected module when clicked
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
          ) : selectedModule ? (
            selectedModule.chapters.map((chapter, index) => (
              <Chapter
                key={index}
                id={chapter?.chapterId}
                title={chapter?.name}
                chapterNumber={index + 1}
                imageUrl={chapter?.thumbnail}
                assignments={chapter?.assignments || []}
                quizzes={chapter?.quizzes || []}
                isExpanded={expandedChapters === chapter?.chapterId}
                onToggle={() => handleToggle(chapter?.chapterId)}
              />
            ))
          ) : (
            <div className="flex justify-center items-center font-bold text-gray-500 my-20 h-full w-full">
              <div className="flex items-center justify-center flex-col text-2xl">
                <GoAlertFill className="text-[5rem] text-gray-500" />
                No Module Selected
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
              modules.map((module, index) => (
                <div
                  key={index}
                  onClick={() => selectModule(module)}
                  className={`cursor-pointer p-2 rounded-lg shadow-md transition-all duration-200 ${
                    selectedModule?.moduleId === module.moduleId
                      ? "bg-purple-100"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <ModuleCard
                    title={module?.name}
                    moduleNumber={index + 1}
                    imageUrl={module?.thumbnail}
                    isCompleted={module?.isCompleted}
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
