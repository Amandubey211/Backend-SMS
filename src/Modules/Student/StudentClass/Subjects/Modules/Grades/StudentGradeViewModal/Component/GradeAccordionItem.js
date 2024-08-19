



// import React, { useState } from "react";
// import {
//   MdOutlineQuiz,
//   MdAssignment,
//   MdKeyboardArrowUp,
//   MdKeyboardArrowDown,
// } from "react-icons/md";

// const GradeAccordionItem = ({ grade }) => {
//   const [isOpen, setIsOpen] = useState(true);
//   console.log("gradesss",grade)

//   const toggleOpen = () => setIsOpen(!isOpen);

//   const getIconForType = (type) => {
//     switch (type.toLowerCase()) {
//       case "quiz":
//         return (
//           <MdOutlineQuiz  className="text-blue-500" />
//         );
//       case "assignment":
//         return (
//           <MdAssignment  className="text-green-500" />
//         );
//       default:
//         return (
//           <MdAssignment  className="text-green-500" />
//         );
//     }
//   };

//   const getColorForStatus = (status) => {
//     return status.toLowerCase() === "submit"
//       ? "text-green-500"
//       : status.toLowerCase() === "excused"
//       ? "text-yellow-500"
//       : status.toLowerCase() === "missing"
//       ? "text-red-500"
//       : "text-gray-500";
//   };

//   return (
//     <>
//       <div className="border-b p-3">
//         <div
//           className="cursor-pointer py-3 px-5 flex items-center justify-between"
//           onClick={toggleOpen}
//         >
//           <div className="flex justify-center items-center gap-3">
//             <img
//               src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTd10fPMHFBu-XhWisAZQlfta8xhF9e_AZ71w&s"
//               className="h-10 w-10 rounded-full"
//               alt="Profile"
//             />
//             <span className="font-bold">Grades</span>
//           </div>
//           <span>
//             {isOpen ? (
//               <MdKeyboardArrowUp className="border rounded text-black" />
//             ) : (
//               <MdKeyboardArrowDown />
//             )}
//           </span>
//         </div>
//         {isOpen && (
//           <div className="p-3">
//             <table className="min-w-full py-3 px-5 bg-white rounded-lg overflow-hidden">
//               <thead className="border-b">
//                 <tr className="text-left">
//                   <th className="px-5 py-2">Name</th>
//                   <th className="px-5 py-2">Module</th>
//                   <th className="px-5 py-2">Due Date</th>
//                   <th className="px-5 py-2">Submit </th>
//                   <th className="px-5 py-2">Status</th>
//                   <th className="px-5 py-2">Score</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {grade.map((evalItem, idx) => (
//                   <tr key={idx} className="bg-white hover:bg-gray-100 transition-shadow duration-200 shadow-md rounded-lg mb-2">
//                   <td className="px-5 py-2 flex flex-col">
//                       {/* {getIconForType(evalItem.type)} */}
//                       <span>{evalItem.Name}</span>
//                       <span className="text-xs">{evalItem.type}</span>
//                     </td>
                   

//                     <td className="px-5 py-2">
//                       <div className="flex flex-col">
//                         <span>{evalItem.moduleName}</span>
//                         <span className="text-xs text-green-700">
//                           {evalItem.chapterId}
//                         </span>
//                       </div>
//                     </td>

//                     <td className="px-5 py-2">{evalItem.dueDate.slice(0,10)}</td>
//                     <td className="px-5 py-2">{evalItem.submittedDate.slice(0,10)}</td>
//                     <td className="px-5 py-2">
//                       <span
//                         className={`${getColorForStatus(
//                           evalItem.status
//                         )} font-medium`}
//                       >
//                         {evalItem.status}
//                       </span>
//                     </td>
//                     <td className="px-5 py-2">{evalItem.score}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default GradeAccordionItem;


import React, { useState } from "react";
import {
  MdOutlineQuiz,
  MdAssignment,
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
} from "react-icons/md";

const GradeAccordionItem = ({ grade }) => {
  console.log("grade isss",grade)
  const [isOpen, setIsOpen] = useState(true);

  const toggleOpen = () => setIsOpen(!isOpen);

  // Sort grades by the most recent submission date
  const sortedGrades = grade.sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate));

  const getColorForStatus = (status) => {
    return status.toLowerCase() === "submit"
      ? "text-green-500"
      : status.toLowerCase() === "excused"
      ? "text-yellow-500"
      : status.toLowerCase() === "missing"
      ? "text-red-500"
      : "text-gray-500";
  };

  return (
    <>
      <div className="border-b p-3">
        <div
          className="cursor-pointer py-3 px-5 flex items-center justify-between"
          onClick={toggleOpen}
        >
          <div className="flex justify-center items-center gap-3">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTd10fPMHFBu-XhWisAZQlfta8xhF9e_AZ71w&s"
              className="h-10 w-10 rounded-full"
              alt="Profile"
            />
            <span className="font-bold">Grades</span>
          </div>
          <span>
            {isOpen ? (
              <MdKeyboardArrowUp className="border rounded text-black" />
            ) : (
              <MdKeyboardArrowDown />
            )}
          </span>
        </div>
        {isOpen && (
          <div className="p-3">
            <table className="min-w-full py-3 px-5 bg-white rounded-lg overflow-hidden">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="px-5 py-2">Name</th>
                  <th className="px-5 py-2">Module</th>
                  <th className="px-5 py-2">Due Date</th>
                  <th className="px-5 py-2">Submit Date</th>
                  <th className="px-5 py-2">Status</th>
                  <th className="px-5 py-2">Score</th>
                </tr>
              </thead>
              <tbody>
                {sortedGrades.map((evalItem, idx) => (
                  <tr key={idx} className="bg-white hover:bg-gray-100 transition-shadow duration-200 shadow-md rounded-lg mb-2">
                    <td className="px-5 py-2 flex flex-col">
                      <span>{evalItem.Name}</span>
                      <span className="text-xs">{evalItem.type}</span>
                    </td>

                    <td className="px-5 py-2">
                      <div className="flex flex-col">
                        <span>{evalItem.moduleName}</span>
                        <span className="text-xs text-green-700">
                          {evalItem.chapterName}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-2">{evalItem.dueDate.slice(0, 10)}</td>
                    <td className="px-5 py-2">{evalItem.submittedDate.slice(0, 10)}</td>
                    <td className="px-5 py-2">
                      <span
                        className={`${getColorForStatus(
                          evalItem.status
                        )} font-medium`}
                      >
                        {evalItem.status}
                      </span>
                    </td>
                    <td className="px-5 py-2">{evalItem.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default GradeAccordionItem;
