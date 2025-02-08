import React, { useState, useRef, useEffect } from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";

const OfflineExamCard = ({
  exampType,
  examName,
  mode,
  semester,
  startDate,
  endDate,
  students,
  maxScore,
}) => {
  //   const { sid, cid } = useParams();
  const loading = true;

  const handleDeleteClick = () => {};

  return (
    <div className={`ps-1 rounded-md bg-green-500 h-auto m-4 hover:shadow-lg`}>
      <div
        className={`border rounded-md  px-5 py-5 bg-white shadow-sm relative h-auto`}
      >
        <div className="flex w-full h-auto justify-between items-end">
          <div className="flex w-[70%] h-auto items-end gap-x-2">
            <h1 className="font-bold text-lg pr-2 truncate">{examName}</h1>
            <div className="bg-blue-200 text-blue-700 text-xs font-semibold rounded-full px-2 py-1">
              {exampType}
            </div>
          </div>
          <div className="bg-gray-100 text-gray-600 text-xs font-semibold rounded-full px-2 py-1">
            {mode}
          </div>
        </div>
        <div>
          <span className="font-medium text-gray-600 text-xs">Max score: </span>
          <span className=" text-gray-600 text-xs">{maxScore}</span>
        </div>
        <div>
          <span className="font-medium text-gray-600 text-xs">Semester: </span>
          <span className=" text-gray-600 text-xs">{semester}</span>
        </div>
        <ul className="border-t px-8 mt-2 mb-1"></ul>
        {/* Dates Section */}
        <div className="flex flex-col text-gray-500 text-xs">
          {/* row-1 */}
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center gap-1">
                <IoCalendarOutline className="text-sm" />
                <span>Start Date:</span>
                <span>{startDate}</span>
              </div>
              <div className="flex items-center gap-1 pl-2">
                <IoCalendarOutline className="text-sm" />
                <span>End Date:</span>
                <span>{endDate}</span>
              </div>
            </div>

            <div className="flex gap-x-2">
              <button
                onClick={() => {}}
                className="bg-white p-1 rounded-full shadow hover:bg-gray-200"
              >
                <TbEdit className="w-5 h-5 text-green-500" />
              </button>

              <div className="flex flex-col">
                <button
                  disabled={loading}
                  aria-busy={loading ? "true" : "false"}
                  onClick={handleDeleteClick}
                  className="bg-white p-1 rounded-full shadow hover:bg-gray-200"
                >
                  <RiDeleteBin6Line className="w-5 h-5 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflineExamCard;
