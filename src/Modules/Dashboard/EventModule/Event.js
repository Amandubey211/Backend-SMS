// src/EventsList.js
import React from "react";
import EventItem from "./EventItems";

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
    <div className="max-w-4xl mt-3 me-1 mx-auto bg-white p-6 rounded-lg ">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Event</h2>
        <button className="text-blue-600">View all</button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <button className="p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h3 className="text-lg font-medium">FEBRUARY 2024</h3>
        <button className="p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
        <div className="relative">
          <select className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
            <option>Month</option>
            {/* Add other month options here */}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M7 10l5 5 5-5H7z" />
            </svg>
          </div>
        </div>
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
