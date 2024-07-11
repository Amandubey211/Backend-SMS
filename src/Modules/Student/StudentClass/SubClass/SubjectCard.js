// // src/components/SubjectCard.js
// import React from "react";
// import { LuUser } from "react-icons/lu";
// import { BsBook } from "react-icons/bs";
// import { NavLink } from "react-router-dom";

// const SubjectCard = ({ data, backgroundColor,Class}) => {
//   const formattedSid = data.title.toLowerCase().replace(/ /g, "_");
//   return (
//     <div className={`relative rounded-xl p-4 shadow-lg ${backgroundColor}`}>
//       <div className="flex justify-between items-center mb-4">
//         <button className="border border-white text-white rounded-full px-4 py-1">
//           Publish
//         </button>
//       </div>
//       {/* <NavLink to={`/student_class/${Class}/${formattedSid}/module`} > */}
//       <NavLink to={`/student_class/${formattedSid}/module`} >


//       <h2 className="text-xl font-bold text-white w-[65%]">{data.title}</h2>    
//       <div className="flex items-center mt-2 text-white">
//         <span className="flex items-center mr-2 gap-1">
//           <LuUser />
//           <span>{data.students}</span>
//         </span>
//         <span className="border-r-2 border-white h-5 mr-2"></span>
//         <span className="flex items-center gap-1">
//           <BsBook />
//           <span>{data.modules} Modules</span>
//         </span>
//       </div>
//       </NavLink>
//       <div className="flex items-center mt-12">
//         <img
//           src={data.teacherImage}
//           alt="teacher"
//           className="w-12 h-12 rounded-full"
//         />
//         <div className="ml-3">
//           <p className="text-white font-semibold">{data.teacherName}</p>
//           <p className="text-white text-sm">{data.teacherRole}</p>
//         </div>
//       </div>
//       <img
//         src={data.icon}
//         alt="icon"
//         className="absolute bottom-6 right-6 h-28"
//       />
//     </div>
//   );
// };

// export default SubjectCard;





//--------------------------☝️-------------


// import React from "react";
// import { LuUser } from "react-icons/lu";
// import { BsBook } from "react-icons/bs";
// import { NavLink } from "react-router-dom";
// import ClassCardBookImg from "../../../../Assets/ClassesAssets/ClassCardBook.png";
// import { useSelector } from "react-redux";

// const SubjectCard = ({ data,IDs, backgroundColor, Class }) => {
  // console.log("subject id",data.subjectId);
  // console.log(" id",IDs);
  // console.log(" classId",IDs.data.classId);
  // console.log(" sectionID",IDs.data.section.sectionId);

//   // const formattedSid = data.subjectName.toLowerCase().replace(/ /g, "_");
//   const formattedSid = data.subjectId
//   const selectedSubjectId = useSelector(state => state.Common.selectedSubject);
//   console.log("Selected Subject ID from Redux:", selectedSubjectId);

//   return (
//     <div className={`relative rounded-xl p-4 shadow-lg ${backgroundColor}`}>
//       <div className="flex justify-between items-center mb-4">
//         <button className="border border-white text-white rounded-full px-4 py-1">
//           {data.isPublished ? "Published" : "Unpublished"}
//         </button>
//       </div>
//       <NavLink to={`/student_class/${IDs.data.classId}/section/${IDs.data.section.sectionId}/module`}>
//       {/* <NavLink to={`/student_class/${formattedSid}/module`}> */}
//         <h2 className="text-xl font-bold text-white w-[65%]">{data.subjectName}</h2>
//         <div className="flex items-center mt-2 text-white">
//           <span className="flex items-center mr-2 gap-1">
//             <LuUser />
//             <span>{data.studentCount}</span>
//           </span>
//           <span className="border-r-2 border-white h-5 mr-2"></span>
//           <span className="flex items-center gap-1">
//             <BsBook />
//             <span>{data.moduleCount} Modules</span>
//           </span>
//         </div>
//       </NavLink>
//       <div className="flex items-center mt-12">
//         <img
//           // src={data.teacherProfile || "default_teacher_image_url"}
//           src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR55M_UlhGRrK6U32QA4ETW3lQYkfOZrbgvdAibLhPmE7ffAwdvUOq6HvDvo0O9EPDjhY4&usqp=CAU'
//           alt="teacher"
//           className="w-12 h-12 rounded-full"
//         />
//         <div className="ml-3">
//           <p className="text-white font-semibold">{data.teacher}</p>
//           <p className="text-white text-sm">Teacher</p>
//         </div>
//       </div>
//       <img
//         src={ClassCardBookImg}
//         // src={data.modules[0]?.thumbnail || "default_thumbnail_image_url"}
//         alt="icon"
//         className="absolute bottom-6 right-6 h-28"
//       />
//     </div>
//   );
// };

// export default SubjectCard;


import React from "react";
import { LuUser } from "react-icons/lu";
import { BsBook } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import ClassCardBookImg from "../../../../Assets/ClassesAssets/ClassCardBook.png";
import { useSelector } from "react-redux";

const SubjectCard = ({ data, IDs, backgroundColor, Class, onSubjectClick }) => {
  console.log("subject id", data.subjectId);
  console.log(" id", IDs);
  console.log(" classId", IDs.classId);
  console.log(" sectionID", IDs.section?.sectionId);

  const formattedSid = data.subjectId;
  const selectedSubjectId = useSelector(state => state.Common.selectedSubject);
  console.log("Selected Subject ID from Redux:", selectedSubjectId);

  return (
    <div className={`relative rounded-xl p-4 shadow-lg ${backgroundColor}`} onClick={() => onSubjectClick(data.subjectId)}>
      <div className="flex justify-between items-center mb-4">
        <button className="border border-white text-white rounded-full px-4 py-1">
          {data.isPublished ? "Published" : "Unpublished"}
        </button>
      </div>
      <NavLink to={`/student_class/${IDs.classId}/section/${IDs.section?.sectionId}/module`}>
        <h2 className="text-xl font-bold text-white w-[65%]">{data.subjectName}</h2>
        <div className="flex items-center mt-2 text-white">
          <span className="flex items-center mr-2 gap-1">
            <LuUser />
            <span>{data.studentCount}</span>
          </span>
          <span className="border-r-2 border-white h-5 mr-2"></span>
          <span className="flex items-center gap-1">
            <BsBook />
            <span>{data.moduleCount} Modules</span>
          </span>
        </div>
      </NavLink>
      <div className="flex items-center mt-12">
        <img
          src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR55M_UlhGRrK6U32QA4ETW3lQYkfOZrbgvdAibLhPmE7ffAwdvUOq6HvDvo0O9EPDjhY4&usqp=CAU'
          alt="teacher"
          className="w-12 h-12 rounded-full"
        />
        <div className="ml-3">
          <p className="text-white font-semibold">{data.teacher}</p>
          <p className="text-white text-sm">Teacher</p>
        </div>
      </div>
      <img
        src={ClassCardBookImg}
        alt="icon"
        className="absolute bottom-6 right-6 h-28"
      />
    </div>
  );
};

export default SubjectCard;
