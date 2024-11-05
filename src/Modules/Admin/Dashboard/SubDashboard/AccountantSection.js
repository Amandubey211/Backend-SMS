import React from "react";
import TotalEarningsGraph from "../Graphs/TotalEarningsGraph";
import TotalStudentsGraphjs from "../Graphs/TotalStudentsGraph";
import NoticeBoard from "../NoticeModule/NoticeBoard";
import Events from "../EventModule/Event";

const AccountantSection = () => {
  return (
    <>
      {/* First Row */}
      <div className="flex flex-wrap items-start justify-between border-y h-auto relative">
        <div className="w-full md:w-2/3 p-4 border-r border-gray-300">
          <TotalEarningsGraph />
        </div>
        <div className="w-full md:w-1/3 p-4">
          <TotalStudentsGraphjs />
        </div>
        {/* Middle Vertical Divider */}
        <div className="absolute left-2/3 transform translate-x-1/2 top-0 bottom-0 border-l border-gray-300"></div>
      </div>

      {/* Second Row */}
      <div className="flex flex-wrap items-start justify-between border-y h-auto relative">
        <div className="w-full md:w-1/2 p-4 border-r border-gray-300">
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

export default AccountantSection;
