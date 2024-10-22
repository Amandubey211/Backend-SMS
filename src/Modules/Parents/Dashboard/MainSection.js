import React from 'react';
import DashCard from "../Dashboard/Dashcard.js";
import AccountingSection from "../Accounting/MainSection/ParentAccounts.js";
import StudentParentCard from "../Dashboard/DashboardData/Students.js";
import NoticeBoard from "../Dashboard/NoticeModule/NoticeBoard.js";
import Spinner from "../../../Components/Common/Spinner";

const ParentSection = () => {

  return (
    <div className="h-full w-full">
      <div className="w-full">
        <div className="flex flex-wrap justify-center gap-3 py-4 w-full">
         
            <DashCard/>
          
        </div>
        <div className="flex flex-wrap justify-between items-start border-y">
          <div className="w-2/5">
            <StudentParentCard/>
          </div>
          <div className="w-3/5 border-r">
            <NoticeBoard textTrimCount={74}/>
          </div>
        </div>
        <div className="flex justify-between items-start border-y">
          <div className="w-full">
            <AccountingSection/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentSection;
