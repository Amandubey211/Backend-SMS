// import React from "react";
// import { MdOutlineCall, MdEmail, MdOutlinePerson, MdOutlineLocationOn } from "react-icons/md";

// const ViewLibraian = ({ librarian }) => {
//   return (
//     <>
//       <div className="flex flex-col">
//         <div className="flex flex-col  justify-center items-center py-3 ">
//           <img
//             className="object-cover rounded-full w-[100px] h-[100px]"
//             src={librarian.imageUrl}
//             alt={librarian.name}
//           />
//           <h3 className="text-lg font-medium">Name</h3>
//           <p className="text-gray-500">{librarian.name}</p>
//         </div>


//         <div className="flex flex-col " >
//         <div className="flex  h-full p-4 gap-5 items-start ">
         
//            <MdOutlineCall className=' text-pink-600 text-2xl p-1 border border-pink-200 rounded-full h-[30px] w-[30px]' />
//            <div className="flex flex-col justify-center">
//             <span className="font-medium">Email</span>
//             <span className="text-gray-500 text-sm">{librarian.email}</span>
//           </div>
//         </div>
//         <div className="flex  h-full p-4 gap-5 items-start ">
         
//            <MdOutlineCall className=' text-pink-600 text-2xl p-1 border border-pink-200 rounded-full h-[30px] w-[30px]' />
//            <div className="flex flex-col justify-center">
//             <span className="font-medium">Salary</span>
//             <span className="text-gray-500 text-sm">{librarian.salary}</span>
//           </div>
//         </div>
//         <div className="flex  h-full p-4 gap-5 items-start ">
         
//            <MdOutlineCall className=' text-pink-600 text-2xl p-1 border border-pink-200 rounded-full h-[30px] w-[30px]' />
//            <div className="flex flex-col justify-center">
//             <span className="font-medium">Gender</span>
//             <span className="text-gray-500 text-sm">{librarian.gender}</span>
//           </div>
//         </div>
//         <div className="flex  h-full p-4 gap-5 items-start ">
         
//            <MdOutlineLocationOn className=' text-pink-600 text-2xl p-1 border border-pink-200 rounded-full h-[30px] w-[30px]' />
//            <div className="flex flex-col justify-center">
//             <span className="font-medium">Address</span>
//             <span className="text-gray-500 text-sm">{librarian.address}</span>
//           </div>
//         </div>
        
//         </div>
//       </div>
//     </>
//   );
// };

// export default ViewLibraian;


//-----------------------


import React from "react";
import { MdOutlineCall, MdEmail, MdOutlineLocationOn, MdOutlinePersonPin } from "react-icons/md";

const ViewLibrarian = ({ librarian }) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col justify-center items-center py-3">
        <img className="object-cover rounded-full w-[100px] h-[100px]" src={librarian.imageUrl} alt={librarian.name} />
        <h3 className="text-lg font-medium">{librarian.name}</h3>
        <p className="text-gray-500">{librarian.email}</p>
      </div>
      <div className="flex flex-col gap-4 p-4">
        <InfoItem icon={<MdEmail className="text-pink-600 text-2xl"/>} label="Email" value={librarian.email} />
        <InfoItem icon={<MdOutlineCall className="text-pink-600 text-2xl"/>} label="Phone" value={librarian.phone} />
        <InfoItem icon={<MdOutlinePersonPin className="text-pink-600 text-2xl"/>} label="Gender" value={librarian.gender} />
        <InfoItem icon={<MdOutlineCall className="text-pink-600 text-2xl"/>} label="Salary" value={`$${librarian.salary}`} />
        <InfoItem icon={<MdOutlineLocationOn className="text-pink-600 text-2xl"/>} label="Address" value={librarian.address} />
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    {icon}
    <div className="flex flex-col">
      <span className="font-medium">{label}</span>
      <span className="text-gray-500 text-sm">{value}</span>
    </div>
  </div>
);

export default ViewLibrarian;
