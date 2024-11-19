import React from "react";
import DashCard from "../Dashboard/Dashcard.js";
import AccountingSection from "../Accounting/MainSection/ParentAccounts.js";
import StudentParentCard from "../Dashboard/DashboardData/Students.js";
import NoticeBoard from "../Dashboard/NoticeModule/NoticeBoard.js";

const ParentSection = () => {
  return (
    <div className="h-full w-full">
      {/* Dashboard Cards */}
      <div className="w-full">
        <div className="flex flex-wrap justify-center gap-3 py-4 w-full">
          <DashCard />
        </div>

        {/* First Row: StudentParentCard and NoticeBoard */}
        <div className="flex w-full border-y h-auto relative">
          {/* StudentParentCard Section */}
          <div className="w-2/5 p-4">
            <div className="w-full">
              <StudentParentCard />
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="absolute h-full top-0 bottom-0 left-[40%] w-[1px] bg-gray-300"></div>

          {/* NoticeBoard Section */}
          <div className="w-3/5 p-4">
            <div className="w-full">
              <NoticeBoard textTrimCount={74} />
            </div>
          </div>
        </div>

        {/* Second Row: Accounting Section */}
        <div className="flex border-y h-[auto]">
          <div className="w-full h-full flex items-center justify-center p-4">
            <div className="w-full h-full">
              <AccountingSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentSection;
