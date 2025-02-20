import React from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbCheck, TbEdit } from "react-icons/tb";
import { formatDate } from "../../../../../../Utils/helperFunctions";

function DateSection({
  isEditing,
  examDetails,
  handleInputChange,
  handleUpdate,
  handleEditClick,
  loading,
  handleDeleteClick,
}) {
  return (
    <div className="flex flex-col text-gray-500 text-xs">
      {/* row-1 */}
      <div className="flex flex-wrap items-center justify-between">
        <div className="flex items-center">
          <div className="flex items-center gap-1">
            <IoCalendarOutline className="text-sm" />
            <span>Start Date:</span>
            {isEditing ? (
              <input
                type="date"
                name="startDate"
                value={examDetails.startDate}
                onChange={handleInputChange}
                className="border px-2 py-1 rounded-md"
              />
            ) : (
              <span>{formatDate(examDetails.startDate)}</span>
            )}
          </div>
          <div className="flex items-center gap-1 pl-2">
            <IoCalendarOutline className="text-sm" />
            <span>End Date:</span>
            {isEditing ? (
              <input
                type="date"
                name="endDate"
                value={examDetails.endDate}
                onChange={handleInputChange}
                className="border px-2 py-1 rounded-md"
              />
            ) : (
              <span>{formatDate(examDetails.endDate)}</span>
            )}
          </div>
        </div>

        <div className="flex gap-x-2 cursor-pointer">
          {isEditing ? (
            <button
              onClick={handleUpdate}
              className="bg-white p-1 rounded-full shadow hover:bg-gray-200"
            >
              <TbCheck className="w-5 h-5 text-green-500" />
            </button>
          ) : (
            <button
              onClick={handleEditClick}
              className="bg-white p-1 rounded-full shadow hover:bg-gray-200"
            >
              <TbEdit className="w-5 h-5 text-green-500" />
            </button>
          )}

          <div className="flex flex-col">
            <button
              disabled={loading}
              onClick={handleDeleteClick}
              className="bg-white p-1 rounded-full shadow hover:bg-gray-200"
            >
              <RiDeleteBin6Line className="w-5 h-5 text-red-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DateSection;
