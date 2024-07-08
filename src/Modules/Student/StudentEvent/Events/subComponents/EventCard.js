import React from "react";

import { MdAccessTime } from "react-icons/md";
const EventCard = ({ event }) => {
  const bgColors = [
    "bg-pink-500",
    "bg-purple-500",
    "bg-blue-500",
    "bg-indigo-500",
  ];
  
  const bgColor = bgColors[event.id % bgColors.length];
  console.log("event in event card ", event);

  return (
    <>
      <div className="h-full flex-1 border  flex-wrap   rounded-lg shadow-lg text-white bg-[#FF6C9C] border-black">
        <div className=" flex  items-center justify-around  p-4 gap-2 ">
          <div className=" border  rounded  p-2 bg-[#F9FAFC]">
            <span className="text-3xl font-semibold text-[#FF6C9C]">
              {" "}
              {event.startDate.getDate()}
              {/* {event.date.getDate()} */}
            </span>
          </div>

          <div className="flex  flex-col flex-wrap justify-start  ">
            <span className=" font-medium">{event.title}</span>
            <div className="flex  items-center">
              {/* <FontAwesomeIcon  style={{color:"white", background:' ' ,margin:'0',padding:'0',  height:'20px' ,width:'20px' ,borderRadius:'50%',marginRight:'5px' }} icon={faClock} /> */}
              <MdAccessTime className="text-white text-xl mr-2" />

              {/* <span className="font-xs  font-[350]">{`${event.date.getHours()}:${String(
                event.date.getMinutes()
              ).padStart(2, "0")} AM`}</span> */}
              <span className="font-xs  font-[350]">{`${event.startDate.getHours()}:${String(
                event.startDate.getMinutes()
              ).padStart(2, "0")} AM`}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col px-6 text-[#F9FAFC]  font-[350] ">
          <span>{event.description}</span>
          <span>{event.time}</span>
        </div>
      </div>
    </>
  );
};

export default EventCard;





//--------------------------------------

// import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { BiCalendarEvent } from 'react-icons/bi';
// import { MdAccessTime, MdLocationOn, MdPersonOutline } from 'react-icons/md'; // Example icons

// const EventCard = ({ event }) => {
//   // Ensure event object exists before accessing its properties
//   if (!event) return null;
//   console.log('event in event card',event)
//   // Ensure event.startDate and event.endDate are valid Date objects
//   const startDate = event.startDate instanceof Date && !isNaN(event.startDate.getDate()) ? event.startDate : null;
//   const endDate = event.endDate instanceof Date && !isNaN(event.endDate.getDate()) ? event.endDate : null;

//   const formatDateTime = (date) => {
//     if (!date) return { date: '', time: '' }; // Handle if date is null

//     const options = { year: 'numeric', month: 'long', day: 'numeric' };
//     const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
//     return {
//       date: date.toLocaleDateString(undefined, options),
//       time: date.toLocaleTimeString(undefined, timeOptions),
//     };
//   };

//   const startDateTime = formatDateTime(startDate);
//   const endDateTime = formatDateTime(endDate);

//   return (
//     <div className="px-4 py-2 bg-white rounded-lg shadow-md">
//       <div className="flex flex-col gap-2">
//         <img className="h-[200px] w-full rounded" src={event.imageUrl} alt="Event" />
//         <div className="flex items-center gap-5">
//           <BiCalendarEvent className="text-pink-500 text-xl mr-2" />
//           <span className="text-pink-500">{startDateTime.date}</span>
//         </div>
//         <div className="flex items-center gap-5">
//           <MdAccessTime className="text-blue-700 text-xl mr-2" />
//           <span className="text-blue-700">{startDateTime.time}</span>
//         </div>
//         <h1 className="font-bold text-[#4D4D4D]">{event.title}</h1>
//         <div className="flex flex-col gap-4">
//           <div className="flex items-center">
//             <MdLocationOn className="text-red-500 text-2xl mr-2" />
//             <div className="flex flex-col">
//               <span className="text-gray-400">Location</span>
//               <span>{event.location}</span>
//             </div>
//           </div>
//           <div className="flex items-center">
//             <MdPersonOutline className="text-blue-500 text-2xl mr-2" />
//             <div className="flex flex-col">
//               <span className="text-gray-400">Event Director</span>
//               <span>{event.director}</span>
//             </div>
//           </div>
//         </div>
//         <div className="flex flex-col gap-2">
//           {event.students && event.students.length > 0 && (
//             <div className="mt-4 flex flex-col gap-2">
//               <div className="text-sm text-gray-700">Join Students</div>
//               <div className="flex overflow-x-auto">
//                 {event.students.map((student, index) => (
//                   <img key={index} className="h-8 w-8 rounded-full" src={student.photo} alt={student.name} />
//                 ))}
//               </div>
//             </div>
//           )}
//           <div className="text-sm text-gray-600">{event.description}</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EventCard;


//----------------

// import React from 'react';
// import { BiCalendarEvent } from 'react-icons/bi';
// import { MdAccessTime, MdLocationOn, MdPersonOutline } from 'react-icons/md';

// const EventCard = ({ event }) => {
//   // Ensure event object exists before accessing its properties
//   if (!event) return null;

//   // Format date and time from event data
//   const formattedDate = new Date(event.date).toLocaleDateString(undefined, {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//   });

//   const formattedTime = event.time; // Assuming event.time is already formatted correctly

//   return (
//     <div className="px-4 py-2 bg-white rounded-lg shadow-md">
//       <div className="flex flex-col gap-2">
//         <img className="h-[200px] w-full rounded" src={event.image} alt="Event" />
//         <div className="flex items-center gap-5">
//           <BiCalendarEvent className="text-pink-500 text-xl mr-2" />
//           <span className="text-pink-500">{formattedDate}</span>
//         </div>
//         <div className="flex items-center gap-5">
//           <MdAccessTime className="text-blue-700 text-xl mr-2" />
//           <span className="text-blue-700">{formattedTime}</span>
//         </div>
//         <h1 className="font-bold text-[#4D4D4D]">{event.title}</h1>
//         <div className="flex flex-col gap-4">
//           <div className="flex items-center">
//             <MdLocationOn className="text-red-500 text-2xl mr-2" />
//             <div className="flex flex-col">
//               <span className="text-gray-400">Location</span>
//               <span>{event.location}</span>
//             </div>
//           </div>
//           <div className="flex items-center">
//             <MdPersonOutline className="text-blue-500 text-2xl mr-2" />
//             <div className="flex flex-col">
//               <span className="text-gray-400">Event Director</span>
//               <span>{event.director}</span>
//             </div>
//           </div>
//         </div>
//         {event.students && event.students.length > 0 && (
//           <div className="flex flex-col gap-2">
//             <div className="mt-4 text-sm text-gray-700">Join Students</div>
//             <div className="flex overflow-x-auto">
//               {event.students.map((student, index) => (
//                 <img key={index} className="h-8 w-8 rounded-full" src={student.photo} alt={student.name} />
//               ))}
//             </div>
//           </div>
//         )}
//         <div className="text-sm text-gray-600">{event.description}</div>
//       </div>
//     </div>
//   );
// };

// export default EventCard;
