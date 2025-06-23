import React from "react";
import DashCard from "../Dashboard/Dashcard.js";
import AccountingSection from "../Accounting/MainSection/ParentAccounts.js";
import StudentParentCard from "../Dashboard/DashboardData/Students.js";
import NoticeBoard from "../Dashboard/NoticeModule/NoticeBoard.js";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";
import ParentEventDash from "./NoticeModule/ParentEventsDash.js";

const ParentSection = () => {
  useNavHeading("Dashboard");

  return (
    <div className="flex h-auto w-full py-2">
      {/* Left Side */}
      <div className="w-2/3 px-4 py-1">
        {/* Top: Cards */}
        <div className="mb-4">
          <DashCard />
        </div>

        {/* Middle: Children & Finance Side by Side */}
        <div className="mb-4 flex gap-4 ">
          {/* Children */}
          <div className="w-1/2 border  rounded-md">
            <StudentParentCard />
          </div>
          {/* Finance */}
          <div className="w-1/2 border  rounded-md">
            <AccountingSection />
          </div>
        </div>
        <div className="border">{/* <AccountingSection /> */}</div>
      </div>

      {/* Right Side */}
      <div className="w-1/3">
        {/* Top: Events Section */}
        <div className="">
          <ParentEventDash />
        </div>
        {/* Bottom: Notices Section */}
        <div className="border mt-4">
          <NoticeBoard textTrimCount={74} />
        </div>
      </div>
    </div>
  );
};

export default ParentSection;
