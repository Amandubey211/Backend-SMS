import React from "react";
import Library from "../LibraryModule/Library";
import NoticeBoard from "../NoticeModule/NoticeBoard";
import Events from "../EventModule/Event";

const LibrarianSection = () => {
  return (
    <div className="w-full h-full overflow-hidden">
     {/* First Row */}
<div className="flex flex-wrap items-start justify-between border-y relative max-w-screen h-[35rem]">
  {/* Middle Vertical Divider */}
  <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 border-l border-gray-300"></div>

  {/* Notice Board Section */}
  <div className="w-full md:w-1/2 p-4 flex items-center justify-center h-[400px]">
    <div className="w-full h-full ">
      <NoticeBoard descriptionLength={140} />
    </div>
  </div>

  {/* Events Section */}
  <div className="w-full md:w-1/2 p-4 flex items-center justify-center h-[400px]">
    <div className="w-full h-full overflow-auto">
      <Events />
    </div>
  </div>
</div>


      {/* Second Row */}
      <div className="flex flex-wrap items-start justify-center border-y h-[400px] mb-20">
        {/* Library Section */}
        <div className="w-full p-4 h-full flex items-center justify-center">
          <div className="w-full h-full">
            <Library />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibrarianSection;
