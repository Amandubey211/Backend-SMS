// import React from "react";
// import {
//   MdAccessTime,
//   MdMarkChatUnread,
//   MdOutlineCall,
//   MdEmail,
//   MdOutlinePerson,
//   MdOutlineLocationOn,
// } from "react-icons/md";

// const ParentsProfile = ({ student }) => {
//     if (!student) {
//         return <div>Loading...</div>; // Handle the case where student data isn't available yet
//       }

//       const { fatherName, motherName, phone, email, address } = student.information.parents;
 
//   return (
//     <>
//       <div className="flex  h-[500px] p-4   gap-5 ">
//         <div className="flex  flex-col  flex-1 h-full  p-4 border  border-gray-300 rounded-lg ">
//           {/*icon  */}
//           <div className="flex  justify-between ">
//             <h2 className="font-semibold bg-gradient-to-r from-pink-500   to-purple-500 inline-block text-transparent bg-clip-text">
//               Father Details
//             </h2>
//             <MdMarkChatUnread className="text-green text-2xl  p-1 border  border-black  rounded-full h-[30px] w-[30px] " />
//           </div>
//           {/* photo and name  */}
//           <div className=" p-3 gap-2 flex flex-col justify-center items-center ">
//             <img
//               src="https://plus.unsplash.com/premium_photo-1666900440561-94dcb6865554?q=80&w=1854&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
//               alt="fatherImage"
//               className=" rounded-full w-[90px] h-[90px]"
//             />

//             <span className=" font-semibold ">{fatherName}</span>
//           </div>
//           {/* details */}

//           <div className=" flex flex-col h-full  p-3    ">
//             <div className="flex flex-1 justify-start items-center gap-6 ">
//               <MdOutlineCall className=" text-pink-600  text-2xl p-1 border  border-pink-200  rounded-full  h-[30px] w-[30px]  " />
//               <div className="flex flex-col justify-center">
//                 <span className="font-medium">Phone</span>
//                 <span className="  text-gray-500 text-sm">{phone}</span>
//               </div>
//             </div>
//             <div className="flex  flex-1  justify-start items-center  gap-6  ">
//               <MdEmail className="text-pink-600  text-2xl p-1 border  border-pink-200  rounded-full  h-[30px] w-[30px]   " />
//               <div className="flex flex-col justify-center">
//                 <span className="font-medium">Email</span>
//                 <span className="  text-gray-500 text-sm">
//                   {email}
//                 </span>
//               </div>
//             </div>
//             <div className="flex  flex-1 justify-start items-center  gap-6  ">
//               <MdOutlinePerson className="text-pink-600  text-2xl p-1 border  border-pink-200  rounded-full  h-[30px] w-[30px]   " />
//               <div className="flex flex-col justify-center">
//                 <span className="font-medium">Child</span>
//                 <span className="  text-gray-500 text-sm">2-child</span>
//               </div>
//             </div>
//             <div className="flex  flex-1 justify-start items-center gap-6  ">
//               <MdOutlineLocationOn className="text-pink-600  text-2xl p-1 border  border-pink-200  rounded-full  h-[30px] w-[30px]   " />
//               <div className="flex flex-col justify-center">
//                 <span className="font-medium">Address</span>
//                 <span className="  text-gray-500 text-sm">
//                  {address}
//                 </span>
//               </div>
//             </div>

//             {/* <MdAccessTime className="text-white text-xl mr-2" /> */}
//           </div>
//         </div>
//         {/* <div className="flex-1 h-full border border-red-700">


//         </div> */}

//         <div className="flex  flex-col  flex-1 h-full  p-4 border  border-gray-300 rounded-lg ">
//           {/*icon  */}
//           <div className="flex  justify-between ">
//             <h2 className="font-semibold bg-gradient-to-r from-pink-500   to-purple-500 inline-block text-transparent bg-clip-text">
//               Mother Details
//             </h2>
//             <MdMarkChatUnread className="text-green text-2xl  p-1 border  border-black  rounded-full h-[30px] w-[30px] " />
//           </div>
//           {/* photo and name  */}
//           <div className=" p-3 gap-2 flex flex-col justify-center items-center ">
//             <img
//               src="https://plus.unsplash.com/premium_photo-1666900440561-94dcb6865554?q=80&w=1854&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
//               alt="fatherImage"
//               className=" rounded-full w-[90px] h-[90px]"
//             />

//             <span className=" font-semibold ">{motherName}</span>
//           </div>
//           {/* details */}

//           <div className=" flex flex-col h-full  p-3    ">
//             <div className="flex flex-1 justify-start items-center gap-6 ">
//               <MdOutlineCall className=" text-pink-600  text-2xl p-1 border  border-pink-200  rounded-full  h-[30px] w-[30px]  " />
//               <div className="flex flex-col justify-center">
//                 <span className="font-medium">Phone</span>
//                 <span className="  text-gray-500 text-sm">{phone}</span>
//               </div>
//             </div>
//             <div className="flex  flex-1  justify-start items-center  gap-6  ">
//               <MdEmail className="text-pink-600  text-2xl p-1 border  border-pink-200  rounded-full  h-[30px] w-[30px]   " />
//               <div className="flex flex-col justify-center">
//                 <span className="font-medium">Email</span>
//                 <span className="  text-gray-500 text-sm">
//                  {email}
//                 </span>
//               </div>
//             </div>
//             <div className="flex  flex-1 justify-start items-center  gap-6  ">
//               <MdOutlinePerson className="text-pink-600  text-2xl p-1 border  border-pink-200  rounded-full  h-[30px] w-[30px]   " />
//               <div className="flex flex-col justify-center">
//                 <span className="font-medium">Child</span>
//                 <span className="  text-gray-500 text-sm">2-child</span>
//               </div>
//             </div>
//             <div className="flex  flex-1 justify-start items-center gap-6  ">
//               <MdOutlineLocationOn className="text-pink-600  text-2xl p-1 border  border-pink-200  rounded-full  h-[30px] w-[30px]   " />
//               <div className="flex flex-col justify-center">
//                 <span className="font-medium">Address</span>
//                 <span className="  text-gray-500 text-sm">
//                  {address}
//                 </span>
//               </div>
//             </div>

//             {/* <MdAccessTime className="text-white text-xl mr-2" /> */}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ParentsProfile;



//---------------------


import React from "react";
import ParentProfileBlock from "./ParentProfileBlock";

const ParentsProfile = ({ student }) => {
  if (!student) {
    return <div>Loading...</div>;
  }

  const { parents } = student.information;

  return (
    <div className="flex h-[500px] p-4 gap-5">
      <ParentProfileBlock
        title="Father Details"
        imageSrc="https://plus.unsplash.com/premium_photo-1666900440561-94dcb6865554?q=80&w=1854&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        name={parents.fatherName}
        details={[
          { type: 'phone', label: 'Phone', value: parents.phone },
          { type: 'email', label: 'Email', value: parents.email },
          { type: 'child', label: 'Child', value: '2-child' },
          { type: 'address', label: 'Address', value: parents.address }
        ]}
      />
      <ParentProfileBlock
        title="Mother Details"
        imageSrc="https://plus.unsplash.com/premium_photo-1666900440561-94dcb6865554?q=80&w=1854&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        name={parents.motherName}
        details={[
          { type: 'phone', label: 'Phone', value: parents.phone },
          { type: 'email', label: 'Email', value: parents.email },
          { type: 'child', label: 'Child', value: '2-child' },
          { type: 'address', label: 'Address', value: parents.address }
        ]}
      />
    </div>
  );
};

export default ParentsProfile;
