import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdAccessTime, MdPersonOutline } from "react-icons/md";
import { FaCalendarDays } from "react-icons/fa6";
import { CiLocationOn } from "react-icons/ci";
import { setSidebarContent } from "../../../../../Store/Slices/Admin/NoticeBoard/Events/eventSlice";
import { deleteEventThunk } from "../../../../../Store/Slices/Admin/NoticeBoard/Events/eventThunks";
import { useTranslation } from "react-i18next";
import { PERMISSIONS } from "../../../../../config/permission";
import ProtectedAction from "../../../../../Routes/ProtectedRoutes/ProtectedAction";
import ProtectedSection from "../../../../../Routes/ProtectedRoutes/ProtectedSection";

const ViewEvent = ({ onClose }) => {
  const dispatch = useDispatch();
  const selectedEvent = useSelector(
    (state) => state.admin.events.selectedEvent
  );
  const deleteLoading = useSelector(
    (state) => state.admin.events.deleteLoading
  );

  const role = useSelector((state) => state.common.auth.role); // Fetch role from Redux
  const { t } = useTranslation("admEvent");

  if (!selectedEvent) {
    return <div>{t("No event selected")}</div>;
  }

  // Display event time as is
  const eventTime = selectedEvent?.time || t("No time");

  // Display formatted date
  const formattedDate = selectedEvent?.date
    ? new Date(selectedEvent?.date).toLocaleDateString()
    : t("Invalid date");

  // Handler for delete event
  const handleDelete = () => {
    dispatch(deleteEventThunk(selectedEvent?._id)).then(() => onClose());
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
        {/* {selectedEvent.image && ( */}
        <img
          className="w-full h-64 object-cover rounded-lg"
          src={selectedEvent?.image || "https://placehold.co/600x400"}
          alt="Event"
        />
        {/* )} */}

        {/* Date and Time */}
        <div className="flex items-center text-sm text-gray-500 font-light mt-4">
          <div className="flex items-center mr-4 text-red-500">
            <FaCalendarDays className="text-lg font-thin mr-1" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center text-blue-500">
            <MdAccessTime className="text-lg mr-1" />
            <span>{eventTime}</span>
          </div>
        </div>

        {/* Event Title */}
        <h1 className="text-xl font-semibold text-gray-700 mt-2">
          {selectedEvent.title}
        </h1>

        {/* Event Type, Location, and Director */}
        <div className="flex flex-col items-start justify-start mt-4">
          <span className="text-gray-500 text-sm">{t("Event Type")}</span>
          <span className="text-md">{selectedEvent.type || t("N/A")}</span>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 flex justify-center items-center rounded-full bg-purple-500">
              <CiLocationOn className="text-white text-lg" />
            </div>
            <div className="flex flex-col items-start justify-start">
              <span className="text-gray-500 text-sm">{t("Location")}</span>
              <span
                className="text-md truncate max-w-xs"
                title={selectedEvent.location}
              >
                {selectedEvent.location || t("N/A")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 flex justify-center items-center rounded-full bg-blue-500">
              <MdPersonOutline className="text-white text-lg" />
            </div>
            <div className="flex flex-col items-start justify-start">
              <span className="text-gray-500 text-sm">
                {t("Event Director")}
              </span>
              <span
                className="text-md truncate max-w-xs"
                title={selectedEvent.director}
              >
                {selectedEvent.director || t("N/A")}
              </span>
            </div>
          </div>
        </div>

        {/* Event Description */}
        <div className="text-gray-600 my-4">
          {selectedEvent.description || t("No description available")}
        </div>
      </div>

      {/* Sticky footer for buttons */}
      <div className="p-4 bg-white border-t sticky bottom-0 flex gap-4">
        {/* Conditionally render Edit and Delete buttons if role is not "teacher" */}
        {!["parent", "student"].includes(role) && (
          <>
            <ProtectedAction requiredPermission={PERMISSIONS.REMOVE_EVENT}>
              <button
                className="flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-md w-full"
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  t("Delete")
                )}
              </button>
            </ProtectedAction>
            <ProtectedAction requiredPermission={PERMISSIONS.UPDATE_EVENT}>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
                onClick={handleEdit}
              >
                {t("Edit")}
              </button>
            </ProtectedAction>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewEvent;
