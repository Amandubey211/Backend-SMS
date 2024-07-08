import React, { useState, useEffect } from "react";
import ChapterItem from "./ChapterItem";
import {
  FaPlus,
  FaEllipsisV,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import ModuleDetails from "./ModuleDetails"; // Import the new ModuleDetails component

// const Chapter = ({
//   title,
//   chapterNumber,
//   imageUrl,
//   items,
//   isExpanded,
//   onToggle,
// }) => {

  const Chapter = ({ title, isExpanded,chapterNumber,onToggle, classId, studentId, imageUrl, items }) => {
console.log("classId is",classId)
  return (
    <div className="mb-4 p-1 bg-white rounded-lg border-b  ">
      <div className="flex items-center justify-between mb-2 ">
        <div className="flex items-center">
          <img
            src="https://s3-alpha-sig.figma.com/img/1e8c/34c0/7df4f0cd89609a7dca9260aef0718e29?Expires=1719792000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=hEAoiy2JQWvi-eFKch9ZwRvGK9zl6lqoOEB6axX2Wgfu1EI3mvTsF4782GAunh8~PsawaT7Wh-cQVZMwd4gkZAj5e7lYfHMUWm3~P8Rwqy9L1oyW~A0ejVH1EFkvKDUseEjK1faauIJL65PYstLDCliB1tnyGf~8ORJnwemZcsq2dB0JL0s-Yf~AnFMVQsVMOmj6Xx7R7IsHINtdrlcPAMrvpOXnaMWQ3Of5uZbuvUt--CoWn5KWjjHdEZ0aPOAomCdeXW5HnIernLU9jHxLFJhtNGq98JoLxS53fryI1pyWu7dI8oo8YcC73MeGVhyY~UPoNiGM1xp1cYFp~mgG3Q__"
            alt="Chapter"
            className="w-12 h-12 mr-4 rounded-lg"
          />
          <div>
            <h2 className="font-semibold text-lg">{title}</h2>
            <p className="text-gray-500">Chapter {chapterNumber}</p>
          </div>
        </div>
        <div className="flex  items-center space-x-2">
          <button className="border p-2 rounded-full hover:bg-gray-50">
            <FaPlus className="text-pink-500" />
          </button>
          <button className=" border p-2 rounded-full hover:bg-gray-50">
            <FaEllipsisV />
          </button>
          <button
            className="border p-2 rounded-full hover:bg-gray-50"
            onClick={onToggle}
          >
            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
      </div>
      {/* {isExpanded && (
        <div className="ml-10 py-2">
          {items?.length > 0 ? (
            items?.map((item, index) => (
              <ChapterItem
                key={index}
                type={item.type}
                title={item.title}
                isPublished={item.isPublished}
                id={item.id}
              />
            ))
          ) : (
            <p className="text-gray-500">No chapters found</p>
          )}
        </div>
      )} */}
{isExpanded && (
        <ModuleDetails isExpanded={isExpanded} classId={classId} studentId={studentId} />
      )}

    </div>
  );
};

export default Chapter;
