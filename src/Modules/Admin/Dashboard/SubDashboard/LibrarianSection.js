import React from "react";
import Library from "../LibraryModule/Library";
import NoticeBoard from "../NoticeModule/NoticeBoard";
import Events from "../EventModule/Event";

const LibrarianSection = () => {
  return (
    <>
      <div className="flex flex-wrap justify-between items-start border-y h-auto">
        <div className="w-full md:w-1/2 p-4 border-r border-gray-300">
          <Library />
        </div>
        <div className="w-full md:w-1/2 p-4">
          <Events />
        </div>
      </div>

      <div className="flex flex-wrap items-start justify-between border-y h-auto">
        <div className="w-full p-4">
          <NoticeBoard descriptionLength={140} />
        </div>
      </div>
    </>
  );
};

export default LibrarianSection;
