import React from "react";
import { FaFileAlt, FaCheckCircle, FaEllipsisV } from "react-icons/fa";
import { MdOutlineBlock } from "react-icons/md";
import { RiListCheck3, RiFileUnknowLine } from "react-icons/ri";
import { GoDiscussionClosed } from "react-icons/go";
import { FiFileText } from "react-icons/fi";
import { NavLink, useParams } from "react-router-dom";
import { ReactComponent as Logo } from '../../../../../../../../src/Assets/StudentAssets/logo.svg';

const getIcon = (type) => {
  switch (type) {
    case "assignment":
      return <RiListCheck3 className="text-green-500" />;
    case "quiz":
      return <RiFileUnknowLine className="text-green-500" />;
    case "page":
      return <FiFileText className="text-green-500" />;
    case "discussions":
      return <GoDiscussionClosed className="text-green-500" />;
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
  console.log(isPublished, "sdfsdfdsf");

  let url;
  if (type === "assignment") {
    url = `/student_class/${cid}/section/${sid}/assignments/${id}`;
  } else if (type === "quiz") {
    url = `/student_class/${cid}/section/${sid}/quizzes/${id}`;
  } else {
    url = "#"; // Default URL if type is not assignment or quiz
  }

  return (
    <div className="flex items-center mb-3 gap-3 rounded-lg ">
      <div className="p-2 bg-white rounded-full">{getIcon(type)}</div>
      <div className="flex flex-col gap-1 justify-center flex-grow">
        <p className="font-semibold">{title}</p>
        <p className="text-green-500 text-sm">
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </p>
      </div>
      <div className="flex items-center gap-3">
        {isPublished ? (
          <Logo className="text-green-500 w-5 h-5" />
        ) : (
          <MdOutlineBlock className="text-gray-600" />
        )}
        <FaEllipsisV className="text-green-500" />
      </div>
    </div>
  );
};

export default ChapterItem;
