import React from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// import { faCartShopping, faPerson, faTrash,faCalendarDays, faLocation,faUserTie,faClock } from "@fortawesome/free-solid-svg-icons";
import { MdAccessTime } from "react-icons/md";
const EventCard = ({ event }) => {
  const bgColors = [
    "bg-pink-500",
    "bg-purple-500",
    "bg-blue-500",
    "bg-indigo-500",
  ];
  const bgColor = bgColors[event.id % bgColors.length];

  return (
    <>
      <div className="h-full flex-1 border  flex-wrap   rounded-lg shadow-lg text-white bg-[#FF6C9C] border-black">
        <div className=" flex  items-center justify-around  p-4 gap-2 ">
          <div className=" border  rounded  p-2 bg-[#F9FAFC]">
            <span className="text-3xl font-semibold text-[#FF6C9C]">
              {" "}
              {event.startDate.getDate()}
            </span>
          </div>

          <div className="flex  flex-col flex-wrap justify-start  ">
            <span className=" font-medium">{event.title}</span>
            <div className="flex  items-center">
              {/* <FontAwesomeIcon  style={{color:"white", background:' ' ,margin:'0',padding:'0',  height:'20px' ,width:'20px' ,borderRadius:'50%',marginRight:'5px' }} icon={faClock} /> */}
              <MdAccessTime className="text-white text-xl mr-2" />

              <span className="font-xs  font-[350]">{`${event.startDate.getHours()}:${String(
                event.startDate.getMinutes()
              ).padStart(2, "0")} AM`}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col px-6 text-[#F9FAFC]  font-[350] ">
          <span>{event.description}</span>
          <span>07-Mar-2024</span>
        </div>
      </div>
    </>
  );
};

export default EventCard;
