import React from 'react';
import { MdAccessTime, MdLocationOn, MdPersonOutline } from 'react-icons/md';
import { BiCalendarEvent } from 'react-icons/bi';
import { format, isValid, parse } from 'date-fns';

const ViewEvent = ({ event, onDelete, onEdit }) => {
  // Default placeholder for missing data
  const defaultEvent = {
    image: '',
    date: '',
    time: '',
    title: 'No Title Available',
    type: 'N/A',
    location: 'N/A',
    director: 'N/A',
    description: 'No description available',
    students: [],
  };

  // Merge the event object with defaults to ensure all properties exist
  const safeEvent = { ...defaultEvent, ...event };

  const formatDateTime = (date, time) => {
    let formattedDate = 'Invalid date';
    let formattedTime = 'Invalid time';

    try {
      // Parse the date
      const parsedDate = new Date(date);
      if (isValid(parsedDate)) {
        formattedDate = format(parsedDate, 'd MMMM yyyy');
      }

      // Parse the time
      if (time) {
        let parsedTime;
        // Check if time includes AM/PM
        if (time.toLowerCase().includes('am') || time.toLowerCase().includes('pm')) {
          parsedTime = parse(time, 'hh:mm a', new Date());
        } else {
          // Parse as 24-hour format
          parsedTime = parse(time, 'HH:mm', new Date());
        }
        if (isValid(parsedTime)) {
          formattedTime = format(parsedTime, 'hh:mm a');
        }
      }
    } catch (error) {
      console.error('Error formatting date/time:', error, { date, time });
    }

    return { date: formattedDate, time: formattedTime };
  };

  const { date, time } = formatDateTime(safeEvent.date, safeEvent.time);

  return (
    <div className="px-4 bg-white rounded-lg overflow-auto" style={{ maxHeight: '90vh' }}>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          {safeEvent.image && (
            <img className="h-[200px] w-full rounded" src={safeEvent.image} alt="Event" />
          )}
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
          <h1 className="font-bold text-[#4D4D4D]">{safeEvent.title}</h1>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <span className="font-xs text-gray-400">Event Type</span>
            <span>{safeEvent.type}</span>
          </div>
          <div className="flex justify-between items-start">
            <div className="flex justify-center items-center m-0 p-0">
              <MdLocationOn className="text-red-500 text-2xl mr-2" />
              <div className="flex flex-col">
                <span className="text-gray-400">Location</span>
                <span>{safeEvent.location}</span>
              </div>
            </div>
            <div className="flex justify-center items-center m-0 p-0">
              <MdPersonOutline className="text-blue-500 text-2xl mr-2" />
              <div className="flex flex-col">
                <span className="text-gray-400">Event Director</span>
                <span>{safeEvent.director}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="mt-4 flex flex-col gap-2">
            <div className="text-sm text-gray-700">Join Students</div>
            <div className="flex overflow-x-auto">
              {safeEvent.students.map((student, index) => (
                <img
                  key={index}
                  className="h-8 w-8 rounded-full"
                  src={student.photo || ''}
                  alt={student.name || 'Student'}
                />
              ))}
            </div>
          </div>
          <div className="text-sm text-gray-600">{safeEvent.description}</div>
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
