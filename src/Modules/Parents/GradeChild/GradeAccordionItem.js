// import React, { useState } from "react";
// import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
// import { GoAlertFill } from "react-icons/go";
// import { useSelector } from "react-redux";
// import { Button, Modal, Skeleton } from "antd";
// import { FaBook } from "react-icons/fa";

// const GradeAccordionItem = ({
//   getData,
//   semesters,
//   selectedSemester,
//   setSelectedSemester,
// }) => {
//   const [isOpen, setIsOpen] = useState(null);
//   const [semesterModalVisible, setSemesterModalVisible] = useState(false);

//   // Admin side: subject data
//   const { studentSubjects } = useSelector((store) => store.admin.all_students);
//   // Parent side: grade data
//   const { grades, loading } = useSelector((store) => store.Parent.grades);

//   // Toggle open/close each subject
//   const toggleOpen = (index, subjectId) => {
//     if (isOpen !== index) {
//       getData(subjectId); // fetch grades for this subject
//     }
//     setIsOpen(isOpen === index ? null : index);
//   };

//   // If user picks a new semester from the modal
//   const handleSemesterSelect = (sem) => {
//     setSelectedSemester(sem._id);
//     setSemesterModalVisible(false);
//     // Re-fetch with newly selected semester
//     getData(null, sem._id);
//   };

//   // Color helper for status
//   const getColorForStatus = (status) =>
//     status === "Submit" ? "text-green-500" : "text-red-500";

//   return (
//     <div className="w-full bg-white rounded-lg overflow-hidden px-4 py-2">
//       {/* Semester Select Button */}
//       <div className="mb-4">
//         <Button
//           type="default"
//           onClick={() => setSemesterModalVisible(true)}
//           className="border border-pink-400 bg-white text-black rounded-lg font-semibold text-sm 
//                      hover:bg-pink-400 hover:text-pink-900 transition-colors duration-200"
//         >
//           {(() => {
//             if (!selectedSemester) return "Select Semester";
//             const found = semesters.find((s) => s._id === selectedSemester);
//             return found ? found.title : "Select Semester";
//           })()}
//         </Button>
//       </div>

//       {/* Subject Accordions */}
//       {studentSubjects?.map((subject, index) => {
//         // Fallback icon if no thumbnail
//         const subjectThumbnail =
//           subject?.thumbnail || subject?.modules?.[0]?.thumbnail || null;

//         // The parent side might be returning the "grades" array
//         // relevant to the last fetch. If the server truly returns
//         // only this subject's data, we can show them directly:
//         const subjectGrades = grades?.grades || [];

//         return (
//           <div key={subject._id} className="border-b last:border-none">
//             {/* Accordion Header */}
//             <button
//               className="w-full flex items-center justify-between p-4 focus:outline-none hover:bg-gray-50 transition-colors"
//               onClick={() => toggleOpen(index, subject._id)}
//             >
//               <div className="flex items-center gap-3">
//                 {subjectThumbnail ? (
//                   <img
//                     src={subjectThumbnail}
//                     alt={subject?.name}
//                     className="w-10 h-10 object-cover rounded-full border"
//                   />
//                 ) : (
//                   <FaBook className="text-pink-400 text-2xl" />
//                 )}
//                 <span className="text-gray-700 font-semibold text-lg">
//                   {subject?.name}
//                 </span>
//               </div>
//               <span>
//                 {isOpen === index ? (
//                   <MdKeyboardArrowUp className="text-xl text-gray-600 transition-transform transform rotate-180" />
//                 ) : (
//                   <MdKeyboardArrowDown className="text-xl text-gray-600 transition-transform" />
//                 )}
//               </span>
//             </button>

//             {/* Accordion Content */}
//             <div
//               className={`bg-white overflow-hidden transition-all duration-300 ${
//                 isOpen === index ? "max-h-[1000px] py-4" : "max-h-0"
//               }`}
//             >
//               <table className="w-full table-auto">
//                 <thead>
//                   <tr className="bg-gray-100 text-left">
//                     <th className="px-5 py-2 text-gray-600 font-semibold">Name</th>
//                     <th className="px-5 py-2 text-gray-600 font-semibold">Due</th>
//                     <th className="px-5 py-2 text-gray-600 font-semibold">
//                       Submitted
//                     </th>
//                     <th className="px-5 py-2 text-gray-600 font-semibold">Status</th>
//                     <th className="px-5 py-2 text-gray-600 font-semibold">
//                       Score / Max
//                     </th>
//                   </tr>
//                 </thead>
//                 {loading ? (
//                   <tbody>
//                     <tr>
//                       <td className="p-5" colSpan={5}>
//                         <Skeleton active />
//                       </td>
//                     </tr>
//                   </tbody>
//                 ) : (
//                   <tbody>
//                     {subjectGrades.length > 0 ? (
//                       subjectGrades.map((item, idx) => (
//                         <tr
//                           key={idx}
//                           className="border-b hover:bg-gray-50 transition-colors last:border-none"
//                         >
//                           <td className="px-5 py-3 text-gray-700">{item?.Name}</td>
//                           <td className="px-5 py-3 text-gray-700">
//                             {item?.dueDate?.slice(0, 10)}
//                           </td>
//                           <td className="px-5 py-3 text-gray-700">
//                             {item?.submittedDate?.slice(0, 10)}
//                           </td>
//                           <td className="px-5 py-3">
//                             <span
//                               className={`${getColorForStatus(item?.status)} font-medium`}
//                             >
//                               {item?.status}
//                             </span>
//                           </td>
//                           <td className="px-5 py-3 text-gray-700 text-center">
//                             {item?.score} / {item?.maxMarks ?? 0}
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td className="px-5 py-5 text-center" colSpan={5}>
//                           <div className="flex flex-col items-center text-gray-500">
//                             <GoAlertFill className="text-3xl mb-2 text-gray-400" />
//                             <span className="font-medium text-sm">
//                               No Data Found
//                             </span>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 )}
//               </table>
//             </div>
//           </div>
//         );
//       })}

//       {/* Semester Selection Modal */}
//       <Modal
//         open={semesterModalVisible}
//         onCancel={() => setSemesterModalVisible(false)}
//         footer={null}
//         title="Select Semester"
//         bodyStyle={{ padding: "1rem" }}
//         destroyOnClose
//       >
//         {semesters.length > 0 ? (
//           semesters.map((sem) => (
//             <Button
//               key={sem._id}
//               onClick={() => handleSemesterSelect(sem)}
//               className={`w-full mb-2 text-left border rounded-md transition-colors duration-200 ${
//                 selectedSemester === sem._id
//                   ? "bg-purple-100 border-purple-400"
//                   : "bg-white hover:bg-purple-50"
//               }`}
//             >
//               {sem.title}
//             </Button>
//           ))
//         ) : (
//           <p className="text-center">No semesters available.</p>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default GradeAccordionItem;
