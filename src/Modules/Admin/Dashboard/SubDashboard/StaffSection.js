import React from "react";
import NoticeBoard from "../NoticeModule/NoticeBoard";
import Events from "../EventModule/Event";

const StaffSection = () => {
  return (
    <>
      {/* First Row with Middle Divider */}
      <div className="flex flex-col md:flex-row items-start justify-between border-y h-auto relative">
        <div className="w-full md:w-1/2 p-4 md:border-r border-gray-200">
          <NoticeBoard descriptionLength={58} />
        </div>
        <div className="w-full md:w-1/2 p-4">
          <Events />
        </div>
        {/* Middle Vertical Divider */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 border-l border-gray-300"></div>
      </div>
    </>
  );
};

export default StaffSection;
