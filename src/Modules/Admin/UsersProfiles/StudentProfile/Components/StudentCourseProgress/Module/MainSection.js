import React, { useEffect, useState } from "react";
// import SubjectSideBar from "../../../../";
import Chapter from "./Components/Chapter";
import dummyData from "./Components/Data/DummyData";
import ModuleCard from "./Components/ModuleCard";
import dummyModules from "./Components/Data/DummyModules";
import { PiPlusThin } from "react-icons/pi";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../../../config/Common";
import axios from "axios";
import { useParams } from "react-router-dom";

const MainSection = () => {
  const [expandedChapters, setExpandedChapters] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState(null);
  const [modules,setModules] = useState([]);
  const [chapters,setChapters] = useState([]);
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
        setModules(response.data.subjects[6].modules);
        setChapters(response.data.subjects[6].modules[0].chapters)
        console.log(response.data.subjects[6].modules[0].chapters);
      } catch (err) {
        console.error('Error fetching subjects:', err);
      }
    };

    fetchSubjects();
  }, []);
  const handleToggle = () => {
    setExpandedChapters(true)
  };



  return (
    <div className="flex  min-h-screen my-2">
      {/* <SubjectSideBar /> */}
      <div className="w-[65%] bg-white p-2  border-l">
        <div className="bg-white p-2 rounded-lg">
          <div className="flex justify-between items-center mb-5">

            {/* <button
              onClick={openAddChapter}
              className="px-4 py-2 rounded-md  bg-gradient-to-r from-pink-100 to-purple-200"
            >
              <span className="text-gradient"> + Add Chapter</span>
            </button> */}
          </div>
          {chapters.map((chapter, index) => (
            <Chapter
              key={index}
              title={chapter?.title}
              chapterNumber={index+1}
              imageUrl={chapter?.imageUrl}
              items={chapters}
              isExpanded={expandedChapters}
              onToggle={() => handleToggle()}
            />
          ))}
        </div>
      </div>
      <div className="w-[35%] p-2 border-l-2 ">
        <div className="bg-white p-4 rounded-lg">
          <div className="flex items-center gap-1 mb-2">
            {/* <h1 className="text-xl font-semibold">All Modules</h1> */}
            
            <p className="bg-gradient-to-r from-pink-100 to-purple-200 font-semibold rounded-full p-1 px-2 ">    <span className="text-gradient">     06 </span>  </p>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {modules.map((module, index) => (
              <ModuleCard
                key={index}
                title={module.title}
                moduleNumber={module.moduleNumber}
                imageUrl={module.imageUrl}
                isCompleted={module.isCompleted}
              />
            ))}
          </div>
        </div>
        {/* <button
          onClick={openAddModule}
          className="bg-gradient-to-r from-purple-400 to-pink-400 text-white p-4 fixed rounded-full shadow-md bottom-4 right-4"
        >
          <PiPlusThin />
        </button> */}
        {/* {isSidebarOpen && (
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={handleSidebarClose}
            title={
              sidebarContent === "chapter"
                ? "Add New Chapter"
                : "Add New Module"
            }
          >
            {sidebarContent === "chapter" ? <AddChapter /> : <AddModule />}
          </Sidebar>
        )} */}
      </div>
    </div>
  );
};

export default MainSection;
