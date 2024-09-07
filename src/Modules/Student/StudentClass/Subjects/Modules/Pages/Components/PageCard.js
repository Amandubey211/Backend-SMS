import React from "react";
import { IoCalendarOutline, IoBookOutline } from "react-icons/io5";
import { NavLink, useParams } from "react-router-dom";
import { SiBookstack } from "react-icons/si";
import { CiUser } from "react-icons/ci";

const PageCard = ({
  title,
  authorName,
  authorImage,
  publishDate,
  updateDate,
  id,
}) => {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const { cid, sid } = useParams();

  return (
    <div className="relative max-w-xs bg-white rounded-lg border flex flex-col justify-between transition-shadow duration-300 hover:shadow-lg group ">
      {/* Link to the page */}
      <NavLink to={`/student_class/${cid}/${sid}/page/${id}/view`}>
        <div className="flex justify-center p-4">
          {/* Large icon */}
          <SiBookstack className="text-green-500 h-20 w-20" />
        </div>

        <div className="text-center mt-2 mb-4">
          {/* Page title */}
          <h2 className="font-semibold text-lg capitalize">{title}</h2>

          {/* Author section */}
          <div className="flex items-center justify-center mt-2">
            {/* Author Image or fallback icon */}
            {authorImage ? (
              <img
                className="h-6 w-6 rounded-full"
                src={authorImage}
                alt={authorName}
              />
            ) : (
              <CiUser className="h-6 w-6 text-gray-500" />
            )}

            {/* Author Name */}
            <span className="ml-2 text-gray-500">
              {authorName || "No Name"}
            </span>
          </div>
        </div>
      </NavLink>

      {/* Publish and Update Dates Section */}
      <div className="flex justify-between items-center text-sm text-gray-600 rounded-b-lg p-4 bg-gray-50 border-t">
        <div className="flex flex-col items-center">
          <div className="flex items-center text-sm">
            <IoCalendarOutline className="mr-1 text-gray-500" />
            <span>Publish</span>
          </div>
          <div className="text-sm text-gray-600">
            <span>{formatDate(publishDate)}</span>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center text-sm">
            <IoCalendarOutline className="mr-1 text-gray-500" />
            <span>Update</span>
          </div>
          <div className="text-sm text-gray-600">
            <span>{formatDate(updateDate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageCard;
