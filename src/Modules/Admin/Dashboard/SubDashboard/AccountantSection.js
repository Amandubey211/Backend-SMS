import React from "react";
import TotalEarningsGraph from "../Graphs/TotalEarningsGraph";
import TotalStudentsGraphjs from "../Graphs/TotalStudentsGraph";
import NoticeBoard from "../NoticeModule/NoticeBoard";
import Events from "../EventModule/Event";

const AccountantSection = () => {
  return (
    <>
      <div className="flex flex-wrap items-start justify-between border-y h-auto">
        <div className="w-full md:w-2/3 p-4 border-r border-gray-300">
          <TotalEarningsGraph />
        </div>
        <div className="w-full md:w-1/3 p-4">
          <TotalStudentsGraphjs />
        </div>
      </div>

      <div className="flex flex-wrap items-start justify-between border-y h-auto">
        <div className="w-full md:w-1/2 p-4 border-r border-gray-300">
          <NoticeBoard descriptionLength={58} />
        </div>
        <div className="w-full md:w-1/2 p-4">
          <Events />
        </div>
      </div>
    </>
  );
};

export default AccountantSection;
