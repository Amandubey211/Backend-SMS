import React, { useEffect, useState } from "react";
import Chapter from "./Components/Chapter";
import ModuleCard from "./Components/ModuleCard";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GoAlertFill } from "react-icons/go";
import { fetchCourseProgress } from "../../../../../../../Store/Slices/Admin/Users/Students/student.action";
import { FaCheckCircle } from "react-icons/fa";

const MainSection = () => {
  const [expandedChapters, setExpandedChapters] = useState(null);
  const [modules, setModules] = useState([]);
  const [chapters, setChapters] = useState([]);
  const { cid } = useParams();
  const {courseProgress} = useSelector((store)=>store.admin.all_students)
  const dispatch  = useDispatch()

  useEffect(() => {
        setModules(courseProgress?.module || []);
        setChapters(courseProgress?.module?.chapters || []);
  }, [courseProgress]);
  

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
              <div onClick={() => selectModule(module)} className={`cursor-pointer ${module?.chapters[0]?._id ?module?.chapters[0]?._id == chapters[0]?._id  ? 'border border-stone-900 rounded-lg' : null:null}`} >
                <div className="relative mb-4 border-gradient bg-white rounded-lg shadow-md">
      <img src={module?.thumbnail} alt={module?.name} className="w-full h-36 object-cover rounded-t-lg" />
      <div className="p-4">
        <h2 className="font-semibold text-lg">{module?.name}</h2>
        <div className="flex justify-between items-center mt-2">
          <p className="bg-gradient-to-r from-pink-100 to-purple-200 font-semibold rounded-full py-1 px-4">    <span className="text-gradient"> Module {index+1}</span>  </p>
          <div className="flex items-center space-x-2">
              <FaCheckCircle className="text-green-500" />
          </div>
        </div>
      </div>
    </div>
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainSection;
