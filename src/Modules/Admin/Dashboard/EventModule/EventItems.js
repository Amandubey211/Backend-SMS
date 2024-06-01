// src/EventItem.js
import React from "react";

const EventItem = ({ image, eventName, eventType, startDate }) => {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center">
        <img
          className="w-10 h-10 rounded-full mr-4"
          src={image}
          alt={eventName}
        />
        <p className="text-sm font-medium text-gray-900 truncate">
          {eventName}
        </p>
      </div>
      <p className="text-sm text-gray-500">{eventType}</p>
      <p className="text-sm text-gray-500">{startDate}</p>
    </div>
  );
};

export default EventItem;
