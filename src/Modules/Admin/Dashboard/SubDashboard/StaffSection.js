import React from "react";
import NoticeBoard from "../NoticeModule/NoticeBoard";
import Events from "../EventModule/Event";

const StaffSection = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row items-start justify-between border-y h-auto">
        <div className="w-full md:w-1/2 p-4 md:border-r border-gray-200">
          <NoticeBoard descriptionLength={58} />
        </div>
        <div className="w-full md:w-1/2 p-4">
          <Events />
        </div>
      </div>
    </>
  );
};

export default StaffSection;
