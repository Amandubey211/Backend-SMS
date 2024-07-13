// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import ChapterItem from "./ChapterItem";
// import { useSelector } from "react-redux";

// const ModuleDetails = ({ isExpanded, classId, studentId }) => {
//   const [moduleDetails, setModuleDetails] = useState([]);
//   const [loading, setLoading] = useState(true);
//   console.log("classId is",classId)

//   const selectedClass = useSelector(state => state.Common.selectedClass);
//   const selectedSubject = useSelector(state => state.Common.selectedSubject);
//   const selectedSection = useSelector(state => state.Common.selectedSection);
//   const selectedStudent = useSelector(state => state.Common.studentId);
//   useEffect(() => {
//     if (isExpanded) {
//       const fetchModuleDetails = async () => {
//         try {
//             const token = localStorage.getItem("student:token");
//             if (!token) {
//               throw new Error("Authentication token not found");
//             }
//           // const response = await fetch(`http://localhost:8080/admin/modules/${classId}/${studentId}`,{
//    const response = await fetch(`http://localhost:8080/admin/student/classes/${selectedClass}/modules/${selectedSubject}`, {

//             headers: {
//                 // Authorization: token,
//                  // 'Authorization': token,
            
//             'Authentication': token

//               },

//           });
//           if (!response.ok) {
//             throw new Error(`Error: ${response.status}`);
//           }
//           const data = await response.json();
//           console.log("moduledetails data",data)
//           setModuleDetails(data.modules.modules || []);
//         } catch (error) {
//           console.error("Failed to fetch module details:", error);
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchModuleDetails();
//     }
//   }, [isExpanded, classId, studentId]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       {moduleDetails.map((module, index) => (
//         <div key={index}>
//           <h2 className="font-semibold text-lg">{module.title}</h2>
//           {module.chapters.map((chapter, chapterIndex) => (
//             <div key={chapterIndex} className="ml-10 py-2">
//               <h3 className="font-semibold text-md">{chapter.title}</h3>
//               {chapter.assignments.map((assignment, assignmentIndex) => (
//                 <ChapterItem
//                   key={assignmentIndex}
//                   type="assignment"
//                   title={assignment.title}
//                   id={assignment._id}
//                   isPublished={assignment.completed}
//                 />
//               ))}
//               {chapter.quizzes.map((quiz, quizIndex) => (
//                 <ChapterItem
//                   key={quizIndex}
//                   type="quiz"
//                   title={quiz.title}
//                   id={quiz._id}
//                   isPublished={quiz.completed}
//                 />
//               ))}

//               {/* discussion */}

//               {/* {chapter.discussions.map((discussion, discussionIndex) => (
//                 <ChapterItem
//                   key={discussionIndex}
//                   type="discussions"
//                   title={discussion.title}
//                   id={discussion._id}
//                   isPublished={discussion.completed}
//                 />
//               ))} */}

//               {/* page */}

//               {/* {chapter.pages.map((page, pageIndex) => (
//                 <ChapterItem
//                   key={pageIndex}
//                   type="page"
//                   title={page.title}
//                   id={page._id}
//                   isPublished={page.completed}
//                 />
//               ))} */}
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ModuleDetails;


import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ChapterItem from "./ChapterItem";
import { useSelector } from "react-redux";
import { toast } from 'react-hot-toast';

const ModuleDetails = ({ isExpanded, classId, studentId }) => {
  const [moduleDetails, setModuleDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectedClass = useSelector(state => state.Common.selectedClass);
  const selectedSubject = useSelector(state => state.Common.selectedSubject);
  const selectedSection = useSelector(state => state.Common.selectedSection);
  const selectedStudent = useSelector(state => state.Common.studentId);

  useEffect(() => {
    if (isExpanded) {
      const fetchModuleDetails = async () => {
        try {
          const token = localStorage.getItem("student:token");
          if (!token) {
            throw new Error("Authentication token not found");
          }

          // const response = await fetch(`http://localhost:8080/admin/student/classes/${selectedClass}/modules/${selectedSubject}`, {
            const response = await fetch(`http://localhost:8080/admin/student/classes/${selectedClass}/modules/${selectedSubject}`, {

          headers: {
              'Authentication': token
            }
          });

          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }

          const data = await response.json();
          console.log("moduledetails data", data);
          setModuleDetails(data.data.modules || []);
        } catch (error) {
          console.error("Failed to fetch module details:", error);
          toast.error("Failed to fetch module details: " + error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchModuleDetails();
    }
  }, [isExpanded, selectedClass, selectedSubject]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {moduleDetails.map((module, index) => (
        <div key={index}>
          <h2 className="font-semibold text-lg">{module.moduleName}</h2>
          {module.chapters.map((chapter, chapterIndex) => (
            <div key={chapterIndex} className="ml-10 py-2">
              <h3 className="font-semibold text-md">{chapter.name}</h3>
              {chapter.assignments.map((assignment, assignmentIndex) => (
                <ChapterItem
                  key={assignmentIndex}
                  type="assignment"
                  title={assignment.name}
                  id={assignment._id}
                  isPublished={assignment.isPublished}
                />
              ))}
              {chapter.quizzes.map((quiz, quizIndex) => (
                <ChapterItem
                  key={quizIndex}
                  type="quiz"
                  title={quiz.name}
                  id={quiz._id}
                  isPublished={quiz.isPublished}
                />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ModuleDetails;
