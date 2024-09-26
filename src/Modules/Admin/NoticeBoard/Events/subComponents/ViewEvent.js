import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdAccessTime, MdLocationOn, MdPersonOutline } from "react-icons/md";
import { BiCalendarEvent } from "react-icons/bi";
import { format, isValid } from "date-fns";
import {
  setSidebarContent, // Import the action to update the sidebar content
} from "../../../../../Store/Slices/Admin/Events/eventSlice";
import { deleteEventThunk } from "../../../../../Store/Slices/Admin/Events/eventThunks";

const ViewEvent = () => {
  const dispatch = useDispatch();
  const selectedEvent = useSelector(
    (state) => state.admin.events.selectedEvent
  );
  const deleteLoading = useSelector(
    (state) => state.admin.events.deleteLoading
  ); // Get delete loading state

  if (!selectedEvent) {
    return <div>No event selected</div>; // Ensure this fallback works
  }

  const formattedDate = isValid(new Date(selectedEvent.date))
    ? format(new Date(selectedEvent.date), "d MMMM yyyy")
    : "Invalid date";

  const formattedTime = selectedEvent.time
    ? format(new Date(`1970-01-01T${selectedEvent.time}`), "hh:mm a")
    : "No time";

  const handleDelete = () => {
    dispatch(deleteEventThunk(selectedEvent._id));
  };

  const handleEdit = () => {
    dispatch(setSidebarContent("updateEvent")); // Set sidebar content to "updateEvent"
  };

  return (
    <div
      className="p-4 bg-white rounded-lg overflow-auto"
      style={{ maxHeight: "90vh" }}
    >
      <div className="flex flex-col gap-2">
        {selectedEvent.image && (
          <img
            className="h-[200px] w-full rounded"
            src={selectedEvent.image}
            alt="Event"
          />
        )}
        <div className="flex gap-5">
          <div className="flex justify-center items-center">
            <BiCalendarEvent className="text-pink-500 text-xl mr-2" />
            <span className="text-pink-500">{formattedDate}</span>
          </div>
          <div className="flex justify-center items-center">
            <MdAccessTime className="text-blue-700 text-xl mr-2" />
            <span className="text-blue-700">{formattedTime}</span>
          </div>
        </div>
        <h1 className="font-bold text-[#4D4D4D]">{selectedEvent.title}</h1>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <MdLocationOn className="text-red-500 text-2xl mr-2" />
              <div className="flex flex-col">
                <span className="text-gray-400">Location</span>
                <span>{selectedEvent.location || "N/A"}</span>
              </div>
            </div>
            <div className="flex items-center">
              <MdPersonOutline className="text-blue-500 text-2xl mr-2" />
              <div className="flex flex-col">
                <span className="text-gray-400">Event Director</span>
                <span>{selectedEvent.director || "N/A"}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm text-gray-600">
              {selectedEvent.description || "No description available"}
            </span>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded flex items-center justify-center"
            onClick={handleDelete}
            disabled={deleteLoading} // Disable button during loading
          >
            {deleteLoading ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              "Delete"
            )}
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleEdit} // Trigger the edit action
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewEvent;
