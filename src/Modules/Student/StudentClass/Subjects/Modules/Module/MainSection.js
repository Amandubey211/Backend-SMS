


///_________________



import React, { useState, useEffect } from "react";
import SubjectSideBar from "../../Component/SubjectSideBar";
import Chapter from "./Components/Chapter";
import ModuleCard from "./Components/ModuleCard";
import { useSelector } from "react-redux";

const MainSection = () => {
  const [expandedChapters, setExpandedChapters] = useState([]);
  const [classData, setClassData] = useState(null);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const token = localStorage.getItem('student:token');
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await fetch('http://localhost:8080/student/my_class', {
          headers: {
            'Authentication': token,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch class data, status: ${response.status}`);
        }

        const data = await response.json();
        console.log("data in mainsection module", data)
        if (data.status && data.data) {
          setClassData(data.data);
        } else {
          console.error("No class data or unsuccessful response");
        }
      } catch (error) {
        console.error("Failed to fetch class data:", error);
      }
    };

    fetchClassData();
  }, []);

  const handleToggle = (chapterId) => {
    setExpandedChapters((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId]
    );
  };
  const selectedClass = useSelector(state => state.Common.selectedClass);
  const selectedSubjectId = useSelector(state => state.Common.selectedSubject);
  const selectedSection = useSelector(state => state.Common.selectedSection);
  const studentId = useSelector(state => state.Common.studentId);
  console.log("Selected Subject ID from Redux:", selectedSubjectId);
  console.log("Selected  section from Redux:", selectedSection);
  console.log("studentId from Redux:", studentId);

  if (!classData) {
    return <div>Loading...</div>;
  }
  console.log("classData._id is", selectedClass)

  // const { subjects } = classData;

  const selectedSubject = classData.subjects.find(subject => subject.subjectId === selectedSubjectId);

  if (!selectedSubject) {
    return <div>No subject selected or subject data not available</div>;
  }

  return (
    <div className="flex min-h-screen">
      <SubjectSideBar />
      <div className="w-[60%] bg-white p-2 border-l">
        <div className="bg-white p-2 rounded-lg">
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-md font-semibold">{selectedSubject.subjectName || "Subject"}</h1>
            {/* <h1 className="text-md font-semibold">{subjects[0]?.subjectName || "Subject"}</h1> */}
          </div>
          {/* {subjects[0]?.modules.map((module, index) => (
            <Chapter
              key={index}
              title={module.name}
              chapterNumber={index + 1}
              imageUrl={module.thumbnail}
              items={module.chapters}
              isExpanded={expandedChapters.includes(module._id)}
              onToggle={() => handleToggle(module._id)}
            />
          ))} */}

          {selectedSubject.modules.map((module, index) => (
            <Chapter
              key={index}
              title={module.name}
              chapterNumber={index + 1}
              imageUrl={module.thumbnail}
              items={module.chapters}
              isExpanded={expandedChapters.includes(module._id)}
              onToggle={() => handleToggle(module._id)}
              classId={selectedClass}
              studentId={studentId}
            />
          ))}

        </div>
      </div>
      <div className="w-[35%] p-2 border">
        <div className="bg-white p-4 rounded-lg">
          <div className="flex items-center gap-1 mb-2">
            <h1 className="text-xl font-semibold">All Modules</h1>
            <p className="bg-gradient-to-r from-pink-100 to-purple-200 font-semibold rounded-full p-1 px-2">
              {" "}
              {/* <span className="text-gradient">{subjects[0]?.moduleCount || 0}</span>{" "} */}
              <span className="text-gradient">{selectedSubject.moduleCount || 0}</span>
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {selectedSubject.modules.map((module, index) => (
              <ModuleCard
                key={index}
                title={module.name}
                moduleNumber={index + 1}
                imageUrl={module.thumbnail}
                isCompleted={module.isPublished}
              />
            ))}
            {/* {subjects[0]?.modules.map((module, index) => (
              <ModuleCard
                key={index}
                title={module.name}
                moduleNumber={index + 1}
                imageUrl={module.thumbnail}
                isCompleted={module.isPublished}
              />
            ))} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainSection;
