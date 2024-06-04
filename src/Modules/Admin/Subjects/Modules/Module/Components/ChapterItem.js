import React from 'react';
import { FaFileAlt, FaQuestionCircle, FaFile, FaComments } from 'react-icons/fa';

const getIcon = (type) => {
  switch (type) {
    case 'assignment':
      return <FaFileAlt className="text-green-500" />;
    case 'quiz':
      return <FaQuestionCircle className="text-green-500" />;
    case 'page':
      return <FaFile className="text-green-500" />;
    case 'discussions':
      return <FaComments className="text-green-500" />;
    default:
      return <FaFileAlt className="text-green-500" />;
  }
};

const ChapterItem = ({ type, title }) => {
  return (
    <div className="flex items-center mb-2 gap-2">
      <div className="mr-2 p-2 border bg-white rounded-full">{getIcon(type)}</div>
      <div className='flex flex-col gap-1 justify-center'> 
        <p className="font-semibold">{title}</p>
        <p className="text-gray-500">{type.charAt(0).toUpperCase() + type.slice(1)}</p>
      </div>
    </div>
  );
};

export default ChapterItem;
