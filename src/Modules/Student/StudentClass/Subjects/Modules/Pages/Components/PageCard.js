import React from "react";
import { IoCalendarOutline, IoBookOutline } from "react-icons/io5";
import { NavLink, useParams } from "react-router-dom";

const PageCard = ({ title, authorName, publishDate, updateDate, id, readOnly }) => {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const { cid, sid } = useParams();

  return (
    <div className="relative max-w-xs bg-white rounded-lg border flex flex-col justify-between transition-shadow duration-300 hover:shadow-lg group">
      <NavLink to={`/student_class/${cid}/${sid}/page/${id}/view`}>
        <div className="flex justify-center p-3">
          <IoBookOutline className="text-green-500 h-24 w-24" />
        </div>
        <div className="text-center mb-4 mt-2">
          <h2 className="font-semibold">{title}</h2>
          <div className="flex items-center justify-center mt-2">
            <img
              className="h-7 w-7 rounded-full"
              src="https://avatars.githubusercontent.com/u/109097090?v=4"
              alt={authorName}
            />
            <span className="ml-2 text-gray-700">{authorName}</span>
          </div>
        </div>
      </NavLink>
      <div className="flex justify-between items-center text-sm text-gray-600 rounded-b-lg p-4 bg-gray-50">
        <div className="flex flex-col items-start">
          <div className="flex items-center">
            <IoCalendarOutline className="mr-1" />
            <span>Publish</span>
          </div>
          <div className="text-lg text-gray-600 capitalize">
            <span>{formatDate(publishDate)}</span>
          </div>
        </div>
        <div className="flex flex-col items-start">
          <div className="flex items-center">
            <IoCalendarOutline className="mr-1" />
            <span>Update</span>
          </div>
          <div className="text-lg text-gray-600 capitalize">
            <span>{formatDate(updateDate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageCard;
