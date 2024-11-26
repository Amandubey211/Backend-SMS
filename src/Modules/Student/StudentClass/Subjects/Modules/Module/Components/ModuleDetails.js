// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import ChapterItem from "./ChapterItem";
// import { useSelector } from "react-redux";
// import { toast } from 'react-hot-toast';
// import { baseUrl } from "../../../../../../../config/Common";
// import Spinner from "../../../../../../../Components/Common/Spinner";

// const Dummy = [
//   {
//     "moduleName": "Business Planning System",
//     "chapters": [
//       {
//         "name": "Chapter 1",
//         "assignments": [
//           {
//             "name": "How to grow your business",
//             "_id": "assignment1",
//             "isPublished": true
//           }
//         ],
//         "quizzes": [
//           {
//             "name": "Business Planning",
//             "_id": "quiz1",
//             "completed": true
//           }
//         ]
//       }
//     ]
//   }
// ]



// const ModuleDetails = ({ isExpanded, classId, studentId }) => {
//   const [moduleDetails, setModuleDetails] = useState(Dummy);
//   const [loading, setLoading] = useState(true);
//   console.log("classId is", classId)
//   const selectedClass = useSelector(state => state.Common.selectedClass);
//   const selectedSubject = useSelector(state => state.Common.selectedSubject);
//   useEffect(() => {
//     if (isExpanded) {
//       const fetchModuleDetails = async () => {
//         try {
//           const token = localStorage.getItem("student:token");
//           if (!token) {
//             throw new Error("Authentication token not found");
//           }
//           const response = await fetch(`${baseUrl}/admin/modules/${classId}/${studentId}`, {
//             headers: {
//               Authentication: token,
//             },

//           });

//           if (!response.ok) {
//             throw new Error(`Error: ${response.status}`);
//           }

//           const data = await response.json();
//           console.log("moduledetails data", data)
//           setModuleDetails(data.modules.modules || []);
//         } catch (error) {
//           console.error("Failed to fetch module details:", error);
//           toast.error("Failed to fetch module details: " + error.message);
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchModuleDetails();
//     }
//   }, [isExpanded, selectedClass, selectedSubject]);

//   if (loading) {
//     return (
//       <>
//         <Spinner/>
//       </>
//     )
//   }

//   return (
//     <div>
//       {moduleDetails.map((module, index) => (
//         <div key={index}>
//           {/* <h2 className="font-semibold text-lg">{module.moduleName}</h2> */}
//           {module.chapters.map((chapter, chapterIndex) => (
//             <div key={chapterIndex} className="ml-10 py-2">
//               {/* <h3 className="font-semibold text-md">{chapter.name}</h3> */}
//               {chapter.assignments.map((assignment, assignmentIndex) => (
//                 <ChapterItem
//                   key={assignmentIndex}
//                   type="assignment"
//                   title={assignment.name}
//                   id={assignment._id}
//                   isPublished={assignment.isPublished}
//                 />
//               ))}
//               {chapter.quizzes.map((quiz, quizIndex) => (
//                 <ChapterItem
//                   key={quizIndex}
//                   type="quiz"
//                   title={quiz.name}
//                   id={quiz._id}
//                   isPublished={quiz.completed}
//                 />
//               ))}

//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ModuleDetails;
