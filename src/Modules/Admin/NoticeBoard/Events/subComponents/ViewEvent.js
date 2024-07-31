import React from 'react';
import { MdAccessTime, MdLocationOn, MdPersonOutline } from 'react-icons/md';
import { BiCalendarEvent } from 'react-icons/bi';
import { format } from 'date-fns';

const ViewEvent = ({ event, onDelete, onEdit }) => {
  const formatDateTime = (date, time) => {
    const formattedDate = format(new Date(date), 'd MMMM yyyy');
    const formattedTime = format(new Date(`1970-01-01T${time}:00`), 'hh:mm a');
    return { date: formattedDate, time: formattedTime };
  };

  const { date, time } = formatDateTime(event.date, event.time);

  return (
    <div className="px-4 bg-white rounded-lg overflow-auto" style={{ maxHeight: '90vh' }}>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <img className="h-[200px] w-full rounded" src={event.image} alt="Event" />
          <div className="flex gap-5">
            <div className="flex justify-center items-center">
              <BiCalendarEvent className="text-pink-500 text-xl mr-2" />
              <span className="text-pink-500">{date}</span>
            </div>
            <div className="flex justify-center items-center">
              <MdAccessTime className="text-blue-700 text-xl mr-2" />
              <span className="text-blue-700">{time}</span>
            </div>
          </div>
          <h1 className="font-bold text-[#4D4D4D]">{event.title}</h1>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <span className="font-xs text-gray-400">Event Type</span>
            <span>{event.type}</span>
          </div>
          <div className="flex justify-between items-start">
            <div className="flex justify-center items-center m-0 p-0">
              <MdLocationOn className="text-red-500 text-2xl mr-2" />
              <div className="flex flex-col">
                <span className="text-gray-400">Location</span>
                <span>{event.location}</span>
              </div>
            </div>
            <div className="flex justify-center items-center m-0 p-0">
              <MdPersonOutline className="text-blue-500 text-2xl mr-2" />
              <div className="flex flex-col">
                <span className="text-gray-400">Event Director</span>
                <span>{event.director}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="mt-4 flex flex-col gap-2">
            <div className="text-sm text-gray-700">Join Students</div>
            <div className="flex overflow-x-auto">
              {event.students && event.students.map((student, index) => (
                <img
                  key={index}
                  className="h-8 w-8 rounded-full"
                  src={student.photo}
                  alt={student.name}
                />
              ))}
            </div>
          </div>
          <div className="text-sm text-gray-600">{event.description}</div>
        </div>
        <div className="flex gap-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={onDelete}
          >
            Delete
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={onEdit}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewEvent;
