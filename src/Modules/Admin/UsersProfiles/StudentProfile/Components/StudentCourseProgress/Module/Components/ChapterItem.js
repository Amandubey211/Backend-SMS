import React from 'react';
import { FaFileAlt, FaQuestionCircle, FaFile, FaComments, FaCheckCircle, FaEllipsisV } from 'react-icons/fa';
import { RiListCheck3,RiFileUnknowLine } from "react-icons/ri";
import { GoDiscussionClosed } from "react-icons/go";

import { FiFileText } from "react-icons/fi";
import { AiOutlineCloseCircle } from 'react-icons/ai';
const getIcon = (type) => {
  switch (type) {
    case 'assignment':
      return <RiListCheck3 className="text-green-500" />;
    case 'quiz':
      return <RiFileUnknowLine className="text-green-500" />;
    case 'page':
      return <FiFileText className="text-green-500" />;
    case 'discussions':
      return <GoDiscussionClosed className="text-green-500" />;
    case 'completed':
      return <FaCheckCircle className="text-green-500" />;
    case 'more':
      return <FaEllipsisV className="text-green-500" />;
    default:
      return <FaFileAlt className="text-green-500" />;
  }
};

const ChapterItem = ({ type, title,submitted }) => {
  return (
    <div className="flex items-center mb-3 gap-3  rounded-lg ">
      <div className="p-2  bg-white rounded-full">{getIcon(type)}</div>
      <div className='flex flex-col gap-1 justify-center flex-grow'> 
        <p className="font-semibold">{title}</p>
        {/* <p className="text-green-500 text-sm ">{type.charAt(0).toUpperCase() + type.slice(1)}</p> */}
      </div>
      <div className="flex items-center gap-1 text-gray-500 justify-center">
      Submit: {submitted ? <FaCheckCircle className="text-green-500" />:<AiOutlineCloseCircle  className="text-red-500" />}
      </div>
    </div>
  );
};

export default ChapterItem;
