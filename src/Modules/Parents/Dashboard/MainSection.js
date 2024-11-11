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
        <div className="flex flex-wrap justify-between items-start border-y h-[400px] relative">
          {/* Middle Vertical Divider */}
          <div className="absolute left-2/5 transform translate-x-1/2 top-0 bottom-0 border-l border-gray-300"></div>

          <div className="w-full md:w-2/5 h-full flex items-center justify-center p-4">
            <div className="w-full h-full">
              <StudentParentCard />
            </div>
          </div>

          <div className="w-full md:w-3/5 h-full flex items-center justify-center p-4">
            <div className="w-full h-full">
              <NoticeBoard textTrimCount={74} />
            </div>
          </div>
        </div>

        {/* Second Row: Accounting Section */}
        <div className="flex border-y h-[400px]">
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
