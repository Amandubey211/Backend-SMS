import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faCartShopping, faPerson, faTrash,faCalendarDays, faLocation,faUserTie,faClock } from "@fortawesome/free-solid-svg-icons";

const ViewEvent = ({ event }) => {
  console.log("event is ", event);
  const formatDateTime = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: true };
    return {
      date: date.toLocaleDateString(undefined, options),
      time: date.toLocaleTimeString(undefined, timeOptions),
    };
  };

  const startDateTime = formatDateTime(new Date(event.startDate));
  const endDateTime = formatDateTime(new Date(event.endDate));
  return (
   
    <>
      <div
        className="px-4 bg-white  rounded-lg  overflow-auto"
        style={{ maxHeight: "90vh" }}
      >

        <div className="flex flex-col gap-2">

            
        
        {/* imahge amd date time */}
        <div className="flex flex-col gap-2 "  >
          <img className=" h-[200px] w-full rounded" src={event.imageUrl} />
          <div className=" flex  gap-5" >
            <div className="flex justify-center items-center"  >
            <FontAwesomeIcon  style={{color:"pink", background:' ' ,margin:'0',padding:'0',  height:'20px' ,width:'20px' ,borderRadius:'50%',marginRight:'5px' }} icon={faCalendarDays} />

          <span className="text-pink-500"> {startDateTime.date} </span>

            </div>
            <div className="flex justify-center items-center"  >
            <FontAwesomeIcon  style={{color:"blue", background:' ' ,margin:'0',padding:'0',  height:'20px' ,width:'20px' ,borderRadius:'50%',marginRight:'5px' }} icon={faClock} />

            <span className=" text-blue-700">{startDateTime.time}</span>

            </div>
            {/* <span className=" text-blue-700"> ⌚6.38 PM</span> */}
           
          </div> 
          <h1 className=" font-bold text-[#4D4D4D] ">{event.title}</h1>
        </div>
        {/* event  title type  location director */}
        <div className=" flex flex-col gap-4">
          <div className="flex flex-col  " >
            <span className=" font-xs  text-gray-400 ">Event Type</span>
            <span> College Holiday</span>
          </div>
          <div className="flex justify-between items-start  " >
            <div className="flex  justify-center items-center m-0 p-0  " >
             
                <div>
      <FontAwesomeIcon  style={{color:"red" ,margin:'0',padding:'2px',  height:'25px' ,width:'25px' ,borderRadius:'50%',marginRight:'5px' }} icon={faLocation} />

                </div>
              <div className="flex flex-col">
                <span className="   text-gray-400 ">Location</span>
                <span>School Grounds</span>
              </div>
            </div>
            <div className="flex justify-center items-center m-0 p-0 ">
             

<div>
      <FontAwesomeIcon  style={{color:"white", background:'blue' ,margin:'0',padding:'2px',  height:'25px' ,width:'25px' ,borderRadius:'50%',marginRight:'5px' }} icon={faUserTie} />

                </div>
              <div className="flex flex-col">
                <span className=" font-xs  text-gray-400 ">Event Director</span>
                <span>Arijit</span>
              </div>
            </div>
          </div>
        </div>
        {/* joint studnet and desc */}
        <div className="flex flex-col gap-2" >
          <div className="mt-4 flex flex-col gap-2 ">
            <div className="text-sm text-gray-700  ">Join Students</div>
            <div className="flex overflow-x-auto">
              {event.students.map((student, index) => (
                <img
                  key={index}
                  className="h-8 w-8 rounded-full "
                  src={student.photo}
                  alt={student.name}
                />
              ))}
            </div>
          </div>

          <div className="text-sm text-gray-600">{event.details}</div>
        </div>
      </div>
      </div>
    </>
  );
};

export default ViewEvent;
