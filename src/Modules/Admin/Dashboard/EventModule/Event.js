// src/EventsList.js
import React from "react";
import EventItem from "./EventItems";
import { IoIosArrowForward,IoIosArrowBack ,IoIosArrowDown  } from "react-icons/io";
const Events = () => {
  const events = [
    {
      id: 1,
      image: "https://via.placeholder.com/40",
      eventName: "Founder Institute Dhaka Graduation",
      eventType: "Public Holiday",
      startDate: "17 Aug 2024",
    },
    {
      id: 2,
      image: "https://via.placeholder.com/40",
      eventName: "Memorial Day Founder Institute Dhaka",
      eventType: "Public Holiday",
      startDate: "17 Jan 2024",
    },
    {
      id: 3,
      image: "https://via.placeholder.com/40",
      eventName: "Founder Institute Dhaka Graduation",
      eventType: "College Holiday",
      startDate: "17 Feb 2024",
    },
    {
      id: 4,
      image: "https://via.placeholder.com/40",
      eventName: "Founder Institute Dhaka Graduation",
      eventType: "Semester Leave",
      startDate: "17 Mar 2024",
    },
    {
      id: 5,
      image: "https://via.placeholder.com/40",
      eventName: "Founder Institute Dhaka Graduation",
      eventType: "College Holiday",
      startDate: "17 Jun 2024",
    },
  ];

  return (
    <div className="max-w-4xl  me-1 text-gray-600  mx-auto bg-white p-4  ">
      {/* <div className="flex justify-between items-center mb-6">
      </div> */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium ">Event</h2>
        <div className="flex items-center gap-3">
          <button className="p-1 border rounded-full">
            <IoIosArrowBack />
          </button>
          <h3 className="text-lg font-medium">FEBRUARY 2024</h3>
          <button className="p-1 border rounded-full">
            <IoIosArrowForward />
          </button>
        </div>

        <div className="relative">
          <select className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
            <option>Month</option>
            <option>Jan-mar</option>
            <option>Apr-Jun</option>
            <option>Jul-Sep</option>
            <option>Oct-Dec</option>
            {/* Add other month options here */}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <IoIosArrowDown/>
          </div>
        </div>
      </div>
      <div className="flex justify-between p-2 border-y py-3 font-semibold ">
        <h1>Event Name</h1>
        <h1>Event Type</h1>
        <h1>Start Date</h1>


      </div>
      <div className="divide-y divide-gray-200">
        {events.map((event) => (
          <EventItem
            key={event.id}
            image={event.image}
            eventName={event.eventName}
            eventType={event.eventType}
            startDate={event.startDate}
          />
        ))}
      </div>
    </div>
  );
};

export default Events;
