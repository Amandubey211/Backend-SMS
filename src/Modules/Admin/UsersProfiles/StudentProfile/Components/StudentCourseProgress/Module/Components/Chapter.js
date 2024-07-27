import React from 'react';
import ChapterItem from './ChapterItem';
import { FaPlus, FaEllipsisV, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const Chapter = ({ title, chapterNumber, imageUrl, items, isExpanded, onToggle }) => {
  return (
    <div className="mb-4 p-1 bg-white rounded-lg border-b  ">
      <div className="flex items-center justify-between mb-2 ">
        <div className="flex items-center">
          <img src="https://avatars.githubusercontent.com/u/109097090?v=4" alt="Chapter" className="w-12 h-12 mr-4 rounded-lg" />
          <div>
            <h2 className="font-semibold text-lg">{title}</h2>
            <p className="text-gray-500">Chapter {chapterNumber}</p>
          </div>
        </div>
        <div className="flex  items-center space-x-2">
          <button
            className="border p-2 rounded-full hover:bg-gray-50"
            onClick={onToggle}
          >
            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
      </div>
      {isExpanded && (
        <div className="ml-10 py-2">
          {items.length > 0 ? (
            items.map((item, index) => (
              <ChapterItem key={index} type={item.type} title={item.title} />
            ))
          ) : (
            <p className="text-gray-500">No chapters found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Chapter;
