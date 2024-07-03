import React from "react";

import { FaCheckCircle, FaEllipsisV, FaFileAlt } from "react-icons/fa";
import { RiFileUnknowLine, RiListCheck3 } from "react-icons/ri";
import { FiFileText } from "react-icons/fi";
import { BsPatchCheckFill } from "react-icons/bs";

import { NavLink, useParams } from "react-router-dom";
import { MdOutlineBlock } from "react-icons/md";

const getIcon = (type) => {
  switch (type) {
    case "assignment":
      return <RiListCheck3 className="text-green-500" />;
    case "quiz":
      return <RiFileUnknowLine className="text-green-500" />;
    case "page":
      return <FiFileText className="text-green-500" />;
    case "discussions":
      return <FiFileText className="text-green-500" />;
    case "completed":
      return <FaCheckCircle className="text-green-500" />;
    case "more":
      return <FaEllipsisV className="text-green-500" />;
    default:
      return <FaFileAlt className="text-green-500" />;
  }
};

const ChapterItem = ({ type, title, id, isPublished }) => {
  const { sid, cid } = useParams();
  return (
    <NavLink
      to={`/class/${cid}/${sid}/${type}/${id}/view`}
    
      className="flex items-center mb-3 gap-3 rounded-lg"
    >
      <div className="p-2 bg-white rounded-full">{getIcon(type)}</div>
      <div className="flex flex-col gap-1 justify-center flex-grow">
        <p className="font-semibold">{title}</p>
        <p className="text-green-500 text-sm ">
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </p>
      </div>
      <div className="flex items-center gap-3">
        {isPublished ? (
      <BsPatchCheckFill className="text-green-600 p-1 border rounded-full h-7 w-7" />
        ) : (
          <MdOutlineBlock className="text-gray-600" />
        )}
        <FaEllipsisV className="text-green-500" />
      </div>
    </NavLink>
  );
};

export default ChapterItem;
