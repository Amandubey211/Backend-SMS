import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdAccessTime, MdPersonOutline } from "react-icons/md";
import { FaCalendarDays } from "react-icons/fa6";
import { CiLocationOn } from "react-icons/ci";
import { format, isValid } from "date-fns";
import { setSidebarContent } from "../../../../../Store/Slices/Admin/Events/eventSlice";
import { deleteEventThunk } from "../../../../../Store/Slices/Admin/Events/eventThunks";

const ViewEvent = () => {
  const dispatch = useDispatch();
  const selectedEvent = useSelector(
    (state) => state.admin.events.selectedEvent
  );
  const deleteLoading = useSelector(
    (state) => state.admin.events.deleteLoading
  );

  if (!selectedEvent) {
    return <div>No event selected</div>;
  }

  // Format event date and time
  const formattedDate = isValid(new Date(selectedEvent.date))
    ? format(new Date(selectedEvent.date), "d MMM yyyy")
    : "Invalid date";

  const formattedTime = selectedEvent.time
    ? format(new Date(`1970-01-01T${selectedEvent.time}`), "hh:mm a")
    : "No time";

  // Handler for delete event
  const handleDelete = () => {
    dispatch(deleteEventThunk(selectedEvent._id));
  };

  // Handler for editing event
  const handleEdit = () => {
    dispatch(setSidebarContent("updateEvent"));
  };

  return (
    <div className="flex flex-col h-full max-w-xl mx-auto bg-white ">
      {/* Scrollable content area */}
      <div className="flex-grow overflow-auto p-4 no-scrollbar">
        {/* Event Image */}
        {selectedEvent.image && (
          <img
            className="w-full h-64 object-cover rounded-lg"
            src={selectedEvent.image}
            alt="Event"
          />
        )}

        {/* Date and Time */}
        <div className="flex items-center text-sm text-gray-500 font-light mt-4">
          <div className="flex items-center mr-4 text-red-500">
            <FaCalendarDays className="text-lg font-thin mr-1" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center text-blue-500">
            <MdAccessTime className="text-lg mr-1" />
            <span>{formattedTime}</span>
          </div>
        </div>

        {/* Event Title */}
        <h1 className="text-xl font-semibold text-gray-700 mt-2">
          {selectedEvent.title}
        </h1>

        {/* Event Type, Location, and Director */}
        <div className="flex flex-col items-start justify-start mt-4">
          <span className="text-gray-500 text-sm">Event Type</span>
          <span className="text-md">{selectedEvent.type || "N/A"}</span>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 flex justify-center items-center rounded-full bg-purple-500">
              <CiLocationOn className="text-white text-lg" />
            </div>
            <div className="flex flex-col items-start justify-start">
              <span className="text-gray-500 text-sm">Location</span>
              <span
                className="text-md truncate max-w-xs"
                title={selectedEvent.location}
              >
                {selectedEvent.location || "N/A"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 flex justify-center items-center rounded-full bg-blue-500">
              <MdPersonOutline className="text-white text-lg" />
            </div>
            <div className="flex flex-col items-start justify-start">
              <span className="text-gray-500 text-sm">Event Director</span>
              <span
                className="text-md truncate max-w-xs"
                title={selectedEvent.director}
              >
                {selectedEvent.director || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Event Description */}
        <div className="text-gray-600 my-4">
          {selectedEvent.description || "No description available"}
        </div>
      </div>

      {/* Sticky footer for buttons */}
      <div className="p-4 bg-white    border-t sticky bottom-0 flex gap-4">
        <button
          className="flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-md w-full"
          onClick={handleDelete}
          disabled={deleteLoading}
        >
          {deleteLoading ? (
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
          ) : (
            "Delete"
          )}
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
          onClick={handleEdit}
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default ViewEvent;
