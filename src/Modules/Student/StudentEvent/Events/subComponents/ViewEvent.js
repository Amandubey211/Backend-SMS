import React from "react";
import { ReactComponent as CalendarIcon } from '../../../../../Assets/StudentAssets/calendar-icon.svg';
import { ReactComponent as ClockIcon } from '../../../../../Assets/StudentAssets/clock-icon.svg';
import { ReactComponent as LocationIcon } from '../../../../../Assets/StudentAssets/location-icon.svg';
import { ReactComponent as PersonIcon } from '../../../../../Assets/StudentAssets/person-icon.svg';

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
    <div className="px-4 bg-white rounded-lg overflow-auto" style={{ maxHeight: "90vh" }}>
      <div className="flex flex-col gap-2">
        {/* Event Image */}
        <img className="h-[200px] w-full rounded" src={event.image} alt="Event" />

        {/* Grouped Date, Time, Location, and Director */}
        <div className="flex justify-between gap-4 mt-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center">
              <div className="bg-pink-500 p-2 rounded-full">
                <CalendarIcon className="text-white" />
              </div>
              <span className="text-pink-500 ml-2">{startDateTime.date}</span>
            </div>
            <div className="flex items-center">
              <div className="bg-purple-500 p-2 rounded-full">
                <LocationIcon className="text-white" />
              </div>
              <div className="flex flex-col ml-2">
                <span className="text-gray-400">Location</span>
                <span className="text-lg">{event.location || 'No Location Available'}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center">
              <div className="bg-orange-500 p-2 rounded-full">
                <ClockIcon className="text-white" />
              </div>
              <span className="text-orange-500 ml-2">{event.time}</span>
            </div>
            <div className="flex items-center">
              <div className="bg-blue-500 p-2 rounded-full">
                <PersonIcon className="text-white" />
              </div>
              <div className="flex flex-col ml-2">
                <span className="text-gray-400">Event Director</span>
                <span className="text-lg">{event.director || 'No Director Available'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Line break */}
        <hr className="my-4" />

        {/* Event Name */}
        <h1 className="font-bold text-[#4D4D4D] text-2xl">{event.title}</h1>

        {/* Event Type */}
        <div className="flex flex-col mt-4">
          <span className="text-gray-400">Event Type</span>
          <span className="text-lg">{event.type || 'No Type Available'}</span>
        </div>

        {/* Event Description */}
        <div className="text-lg leading-[1.875] mt-4" style={{ color: "#7F7F7F", fontFamily: "", fontSize: "16px", fontStyle: "normal", fontWeight: "400" }}>
          {event.description || 'No Details Available'}
        </div>
      </div>
    </div>
  );
};

export default ViewEvent;
