// import React from "react";
// import {
//   MdAccessTime,
//   MdMarkChatUnread,
//   MdOutlineCall,
//   MdEmail,
//   MdOutlinePerson,
//   MdOutlineLocationOn,MdMale , MdTempleHindu,MdBloodtype,MdCake,  MdPhone,
//   MdLocationCity
// } from "react-icons/md";
// import StudentProfile from "./StudentProfile";
// const StudnetInformationMenu = ({ student }) => {
//   return (
//     <>
//       <div className="flex flex-col h-full  p-2 border-l border-gray-300 ">
//         <level className="font-medium">Student Other Information</level>
//         {/* upper side */}
//         <div className="h flex w-full  p-2  border-gray-300 border-b ">
//           <div className="p-2 flex flex-col flex-1 w-full  ">
//             <div className="p-3 flex   justify-start items-center  gap-6   ">
//               <MdOutlineLocationOn className="text-pink-600  text-2xl p-1 border  border-pink-200  rounded-full  h-[30px] w-[30px]   " />
//               <div className="flex flex-col justify-center">
//                 <span className="font-medium">Address</span>
//                 <span className="  text-gray-500 text-sm">
//                   {student.information.address}
//                 </span>
//               </div>
//             </div>
//             <div className="p-3 flex   justify-start items-center  gap-6  ">
//               <MdMale  className="text-pink-600  text-2xl p-1 border  border-pink-200  rounded-full  h-[30px] w-[30px]   " />
//               <div className="flex flex-col justify-center">
//                 <span className="font-medium">Gender</span>
//                 <span className="  text-gray-500 text-sm">
//                   {student.information.gender}
//                 </span>
//               </div>
//             </div>
//             <div className="p-3 flex   justify-start items-center  gap-6  ">
//               <MdTempleHindu className="text-pink-600  text-2xl p-1 border  border-pink-200  rounded-full  h-[30px] w-[30px]   " />
//               <div className="flex flex-col justify-center">
//                 <span className="font-medium">Relegion</span>
//                 <span className="  text-gray-500 text-sm">
//                   {student.information.religion}
//                 </span>
//               </div>
//             </div>
//             {/* <div className="flex-1"></div>
//           <div className="flex-1"></div> */}
//           </div>
//           <div className="p-2 flex flex-col flex-1 w-full   ">
//             <div className="p-3 flex   justify-start items-center  gap-6   ">
//               <MdEmail className="text-pink-600  text-2xl p-1 border  border-pink-200  rounded-full  h-[30px] w-[30px]   " />
//               <div className="flex flex-col justify-center">
//                 <span className="font-medium">Email</span>
//                 <span className="  text-gray-500 text-sm">
//                   {student.information.email}
//                 </span>
//               </div>
//             </div>
//             <div className="p-3 flex   justify-start items-center  gap-6  ">
//               <MdBloodtype className="text-pink-600  text-2xl p-1 border  border-pink-200  rounded-full  h-[30px] w-[30px]   " />
//               <div className="flex flex-col justify-center">
//                 <span className="font-medium">Blood Group</span>
//                 <span className="  text-gray-500 text-sm">o+</span>
//               </div>
//             </div>

//             {/* <div className="flex-1"></div>
//           <div className="flex-1"></div> */}
//           </div>
//           <div className="p-2 flex flex-col flex-1 w-full  ">
//             <div className="p-3 flex   justify-start items-center  gap-6   ">
//               <MdPhone className="text-pink-600  text-2xl p-1 border  border-pink-200  rounded-full  h-[30px] w-[30px]   " />
//               <div className="flex flex-col justify-center">
//                 <span className="font-medium">Phone</span>
//                 <span className="  text-gray-500 text-sm">
//                   {student.information.phone}
//                 </span>
//               </div>
//             </div>
//             <div className="p-3 flex   justify-start items-center  gap-6  ">
//               <MdCake className="text-pink-600  text-2xl p-1 border  border-pink-200  rounded-full  h-[30px] w-[30px]   " />
//               <div className="flex flex-col justify-center">
//                 <span className="font-medium">Birth Day</span>
//                 <span className="  text-gray-500 text-sm">25th July ,2008</span>
//               </div>
//             </div>

//             {/* <div className="flex-1"></div>
//           <div className="flex-1"></div> */}
//           </div>
//         </div>
//         {/* down side */}
//         <div className="flex w-full  ">
//           <div className="w-[30%]  border-r border-gray-300    p-2">
//           <h2 className="text-lg font-normal text-gray-600 ">Parents Information</h2>

//             <div className="h flex flex-col w-full   ">

//               <div className=" flex flex-col flex-1 w-full ">
//                 <div className="p-3 flex   justify-start items-center  gap-6   ">
//                   <MdOutlinePerson className="text-pink-600  text-2xl p-1 border  border-pink-200  rounded-full  h-[30px] w-[30px]   " />
//                   <div className="flex flex-col justify-center">
//                     <span className="font-medium">Father Name</span>
//                     <span className="  text-gray-500 text-sm">   {student.information.parents.fatherName}</span>
//                   </div>
//                 </div>
//                 <div className="p-3 flex   justify-start items-center  gap-6   ">
//                   <MdOutlinePerson className="text-pink-600  text-2xl p-1 border  border-pink-200  rounded-full  h-[30px] w-[30px]   " />
//                   <div className="flex flex-col justify-center">
//                     <span className="font-medium">Mother Name</span>
//                     <span className="  text-gray-500 text-sm">{student.information.parents.motherName}</span>
//                   </div>
//                 </div>
//                 <div className="p-3 flex   justify-start items-center  gap-6   ">
//                   <MdPhone className="text-pink-600  text-2xl p-1 border  border-pink-200  rounded-full  h-[30px] w-[30px]   " />
//                   <div className="flex flex-col justify-center">
//                     <span className="font-medium">Phone</span>
//                     <span className="  text-gray-500 text-sm">{student.information.parents.phone}</span>
//                   </div>
//                 </div>
//                 <div className="p-3 flex   justify-start items-center  gap-6  ">
//                   <MdEmail className="text-pink-600  text-2xl p-1 border  border-pink-200  rounded-full  h-[30px] w-[30px]   " />
//                   <div className="flex flex-col justify-center">
//                     <span className="font-medium">Email</span>
//                     <span className="  text-gray-500 text-sm">{student.information.parents.email}</span>
//                   </div>
//                 </div>
//                 <div className="p-3 flex   justify-start items-center  gap-6  ">
//                   <MdOutlineLocationOn className="text-pink-600  text-2xl p-1 border  border-pink-200  rounded-full  h-[30px] w-[30px]   " />
//                   <div className="flex flex-col justify-center">
//                     <span className="font-medium">Address</span>
//                     <span className="  text-gray-500 text-sm">{student.information.parents.address}</span>
//                   </div>
//                 </div>
//                 {/* <div className="flex-1"></div>
//           <div className="flex-1"></div> */}
//               </div>
//             </div>
//           </div>
//           <div className="w-[70%] bg-sky-300 ">

//               <StudentProfile student={student}  />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default StudnetInformationMenu;

//----------------------------------

import React from "react";
import InformationSection from "./subComponents/InformationSection";
import ParentInformation from "./subComponents/ParentInformation";
import StudentProfile from "./subComponents/StudentProfile";

const StudentInformationMenu = ({ student }) => (
  <>
    <div className="flex flex-col w-full">
      <div className="border-b border-gray-300 p-3">
        <InformationSection student={student} />
      </div>

      <div className="flex ">
        <ParentInformation parents={student.information.parents} />
        <div className="w-[70%] bg-sky-300">
          <StudentProfile student={student} />
        </div>
      </div>
    </div>
  </>
);

export default StudentInformationMenu;
