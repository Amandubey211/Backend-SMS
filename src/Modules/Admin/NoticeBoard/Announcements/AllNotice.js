// import React from "react";
// // import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// // import {
// //   faClock,
// //   faTrash,
// //   faCalendarDays,
// // } from "@fortawesome/free-solid-svg-icons";
// import { MdCalendarMonth } from "react-icons/md";

// const AllNotice = ({ notice, onToggle, isActive }) => (
//   <div className="border-b last:border-b-0">
//     <div
//       // className={`cursor-pointer p-4 flex justify-between items-center ${isActive ? "bg-gray-100" : "bg-white"}`}
//       className={`cursor-pointer   p-2   flex flex-col  ${
//         isActive ? "bg-gray-100" : "bg-white"
//       }`}
//       onClick={onToggle}
//     >
//       <div className="flex items-center gap-4">
//         <img
//           className="h-10 w-10 rounded-full object-cover"
//           src={notice.imageUrl || "https://via.placeholder.com/40"}
//           alt="Notice"
//         />
//         <div>
//           <h2 className="text-lg font-semibold">{notice.title}</h2>
//           <p className="text-sm text-gray-500">
//             {/* <FontAwesomeIcon icon={faCalendarDays} className="mr-2" /> */}
//             <MdCalendarMonth className="mr-2" />
//             {notice.date}
//           </p>
//         </div>
//       </div>
//       <div>
//         <span
//           className={`px-3 py-1 rounded-full text-xs font-medium ${
//             notice.priority === "High Priority"
//               ? "bg-red-100 text-red-800"
//               : "bg-blue-100 text-blue-800"
//           }`}
//         >
//           {notice.priority}
//         </span>
//       </div>
//     </div>
//     {isActive && (
//       <div className="p-4 bg-gray-50 text-gray-700">
//         <p>{notice.content}</p>
//       </div>
//     )}
//   </div>
// );

// export default AllNotice;
