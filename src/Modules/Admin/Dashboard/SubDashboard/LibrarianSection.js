import React from "react";
import Library from "../LibraryModule/Library";
import NoticeBoard from "../NoticeModule/NoticeBoard";
import Events from "../EventModule/Event";

const LibrarianSection = () => {
  return (
    <>
      {/* First Row */}
      <div className="flex flex-wrap justify-between items-start border-y h-auto relative">
        <div className="w-full md:w-1/2 p-4">
          <NoticeBoard descriptionLength={140} />
        </div>
        <div className="w-full md:w-1/2 p-4 h-full">
          <Events />
        </div>
        {/* Middle Vertical Divider */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 border-l border-gray-300"></div>
      </div>

      {/* Second Row */}
      <div className="flex flex-wrap items-start justify-between border-y h-auto">
        <div className="w-full p-4">
          <Library />
        </div>
      </div>
    </>
  );
};

export default LibrarianSection;
