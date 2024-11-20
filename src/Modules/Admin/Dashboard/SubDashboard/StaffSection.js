import React from "react";
import NoticeBoard from "../NoticeModule/NoticeBoard";
import Events from "../EventModule/Event";

const StaffSection = () => {
  return (
    <div className="w-full h-full overflow-hidden">
      {/* First Row with Middle Divider */}
      <div className="flex flex-wrap items-start justify-between border-y h-[500px] relative max-w-screen">
        {/* Middle Vertical Divider */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 border-l border-gray-300"></div>
        <div className="w-full md:w-1/2 p-4 h-full flex items-center justify-center">
          <div className="w-full h-full">
            <NoticeBoard descriptionLength={58} />
          </div>
        </div>
        <div className="w-full md:w-1/2 p-4 h-full flex items-center justify-center">
          <div className="w-full h-full">
            <Events />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffSection;
