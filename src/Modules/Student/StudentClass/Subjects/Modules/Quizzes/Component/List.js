// import React, { useState } from "react";
// import { CiSearch } from "react-icons/ci";
// import { FaEllipsisV, FaExclamationTriangle } from "react-icons/fa";
// import { BsPatchCheckFill } from "react-icons/bs";
// import { NavLink, useParams } from "react-router-dom";

// const List = ({ data, icon, title, type }) => {
//   const { cid, sid } = useParams();
//   const [searchQuery, setSearchQuery] = useState("");

//   const handleSearchChange = (event) => {
//     setSearchQuery(event.target.value);
//   };

//   const filteredData = data.filter((item) =>
//     item.title.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="bg-white p-5 w-full">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold text-gradient">
//           {title}
//           <span className="border rounded-full text-sm p-1 px-2 ml-1 text-gray-500">
//             {filteredData.length}
//           </span>
//         </h2>
//         <div className="relative">
//           <div className="relative flex items-center max-w-xs w-full mr-4">
//             <input
//               type="text"
//               placeholder="Search here"
//               value={searchQuery}
//               onChange={handleSearchChange}
//               className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 w-full"
//             />
//             <button className="absolute right-3">
//               <CiSearch className="w-5 h-5 text-gray-500" />
//             </button>
//           </div>
//         </div>
//       </div>
//       <ul className="border-t p-4">
//         {filteredData.length > 0 ? (
//           filteredData.map((item) => (
//             <NavLink
//               to={
//                 type === "Assignment"
//                   ? `/student_class/${sid}/assignments/${item.id}/view`
//                   : `/student_class/${sid}/quizzes/${item.id}/view`
//                   // ? `/class/${cid}/${sid}/assignments/${item.id}/view`
//                   // : `/class/${cid}/${sid}/quizzes/${item.id}/view`
//               }
//               key={item.id}
//               className="flex items-center mb-3 gap-3 p-1 rounded-lg"
//             >
//               <div className="text-green-600 p-2 border rounded-full ">
//                 {icon}
//               </div>
//               <div className="flex justify-between w-full px-2 items-start">
//                 <div className="flex flex-col gap-1 justify-center flex-grow">
//                   <div>
//                     <h3 className="text-md font-semibold mb-1">{item.title}</h3>
//                     <p className="text-sm text-gray-500">
//                       Module : {item.module} | Chapter : {item.chapter}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <BsPatchCheckFill className="text-green-600 p-1 border rounded-full h-7 w-7" />
//                   <FaEllipsisV className="text-green-600 p-1 border rounded-full h-7 w-7" />
//                 </div>
//               </div>
//             </NavLink>
//           ))
//         ) : (
//           <div className="flex flex-col items-center justify-center py-10 text-gray-500">
//             <FaExclamationTriangle className="w-12 h-12 mb-3" />
//             <p className="text-lg font-semibold">No data found</p>
//           </div>
//         )}
//       </ul>
//     </div>
//   );
// };

// export default List;


//---------------------------------------------



import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaEllipsisV, FaExclamationTriangle } from "react-icons/fa";
import { BsPatchCheckFill } from "react-icons/bs";
import { NavLink, useParams } from "react-router-dom";

const List = ({ data, icon, title, type }) => {
  const { cid, sid } = useParams();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // const filteredData = data.filter((item) =>
  //   item.title.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  return (
    <div className="bg-white p-5 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gradient">
          {title}
          <span className="border rounded-full text-sm p-1 px-2 ml-1 text-gray-500">
            {data.length}
          </span>
        </h2>
        <div className="relative">
          <div className="relative flex items-center max-w-xs w-full mr-4">
            <input
              type="text"
              placeholder="Search here"
              value={searchQuery}
              onChange={handleSearchChange}
              className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 w-full"
            />
            <button className="absolute right-3">
              <CiSearch className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
      <ul className="border-t p-4">
        {data.length > 0 ? (
          data.map((item) => (
            <NavLink
            to={`/student_class/${sid}/section/${sid}/quizzes/${item._id}/view`}
            key={item._id}
            state={{ quiz: item }}  // Passing the selected quiz as state

            className="flex items-center mb-3 gap-3 p-1 rounded-lg"
          >
              <div className="text-green-600 p-2 border rounded-full ">
                {icon}
              </div>
              <div className="flex justify-between w-full px-2 items-start">
                <div className="flex flex-col gap-1 justify-center flex-grow">
                  <div>
                    <h3 className="text-md font-semibold mb-1">{item.name}</h3>
                    {/* <h3 className="text-md font-semibold mb-1">{item.title}</h3> */}
                    <p className="text-sm text-gray-500">
                      Module : {item.module} | Chapter : {item.chapter}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BsPatchCheckFill className="text-green-600 p-1 border rounded-full h-7 w-7" />
                  <FaEllipsisV className="text-green-600 p-1 border rounded-full h-7 w-7" />
                </div>
              </div>
            </NavLink>
          //   <div key={item._id} className="mb-4">
          //   {item.subjectId.modules.map((module) => (
          //     <div key={module._id}>
          //       <h3 className="text-lg font-semibold mb-2">{module.name}</h3>
          //       {module.chapters.map((chapter) => (
          //         <NavLink
                  //   to={`/student_class/${sid}/section/${sid}/quizzes/${item._id}/view`}
                  //   key={chapter._id}
                  //   className="flex items-center mb-3 gap-3 p-1 rounded-lg"
                  // >
          //           <div className="text-green-600 p-2 border rounded-full">
          //             {icon}
          //           </div>
          //           <div className="flex justify-between w-full px-2 items-start">
          //             <div className="flex flex-col gap-1 justify-center flex-grow">
          //               <div>
          //                 <h3 className="text-md font-semibold mb-1">
          //                   {item.name}
          //                 </h3>
          //                 <p className="text-sm text-gray-500">
          //                   Module: {module.name} | Chapter: {chapter.name}
          //                 </p>
          //               </div>
          //             </div>
          //             <div className="flex items-center gap-3">
          //               <BsPatchCheckFill className="text-green-600 p-1 border rounded-full h-7 w-7" />
          //               <FaEllipsisV className="text-green-600 p-1 border rounded-full h-7 w-7" />
          //             </div>
          //           </div>
          //         </NavLink>
          //       ))}
          //     </div>
          //   ))}
          // </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <FaExclamationTriangle className="w-12 h-12 mb-3" />
            <p className="text-lg font-semibold">No data found</p>
          </div>
        )}
      </ul>
    </div>
  );
};

export default List;



//---------------


// import React, { useState } from "react";
// import { CiSearch } from "react-icons/ci";
// import { FaEllipsisV, FaExclamationTriangle } from "react-icons/fa";
// import { BsPatchCheckFill } from "react-icons/bs";
// import { useNavigate, useParams } from "react-router-dom";

// const List = ({ data, icon, title }) => {
//   const { cid, sid } = useParams();
//   const [searchQuery, setSearchQuery] = useState("");
//   const navigate = useNavigate();

//   const handleSearchChange = (event) => {
//     setSearchQuery(event.target.value);
//   };

//   const handleQuizClick = (quiz) => {
//     navigate(`/student_class/${cid}/section/${sid}/quizzes/${quiz._id}/view`, { state: { quiz } });
//   };

//   const filteredData = data.filter((item) =>
//     item.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="bg-white p-5 w-full">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold text-gradient">
//           {title}
//           <span className="border rounded-full text-sm p-1 px-2 ml-1 text-gray-500">
//             {filteredData.length}
//           </span>
//         </h2>
//         <div className="relative">
//           <div className="relative flex items-center max-w-xs w-full mr-4">
//             <input
//               type="text"
//               placeholder="Search here"
//               value={searchQuery}
//               onChange={handleSearchChange}
//               className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 w-full"
//             />
//             <button className="absolute right-3">
//               <CiSearch className="w-5 h-5 text-gray-500" />
//             </button>
//           </div>
//         </div>
//       </div>
//       <ul className="border-t p-4">
//         {filteredData.length > 0 ? (
//           filteredData.map((item) => (
//             <div
//               key={item._id}
//               className="flex items-center mb-3 gap-3 p-1 rounded-lg cursor-pointer"
//               onClick={() => handleQuizClick(item)}
//             >
//               <div className="text-green-600 p-2 border rounded-full ">
//                 {icon}
//               </div>
//               <div className="flex justify-between w-full px-2 items-start">
//                 <div className="flex flex-col gap-1 justify-center flex-grow">
//                   <div>
//                     <h3 className="text-md font-semibold mb-1">{item.name}</h3>
//                     <p className="text-sm text-gray-500">
//                       Module : {item.module} | Chapter : {item.chapter}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <BsPatchCheckFill className="text-green-600 p-1 border rounded-full h-7 w-7" />
//                   <FaEllipsisV className="text-green-600 p-1 border rounded-full h-7 w-7" />
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="flex flex-col items-center justify-center py-10 text-gray-500">
//             <FaExclamationTriangle className="w-12 h-12 mb-3" />
//             <p className="text-lg font-semibold">No data found</p>
//           </div>
//         )}
//       </ul>
//     </div>
//   );
// };

// export default List;
