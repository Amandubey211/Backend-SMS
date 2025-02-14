import React from "react";
import TotalEarningsGraph from "../Graphs/TotalEarningsGraph";
import TotalStudentsGraphjs from "../Graphs/TotalStudentsGraph";
import NoticeBoard from "../NoticeModule/NoticeBoard";
import Events from "../EventModule/Event";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../config/permission";

const AccountantSection = () => {
  return (
    <div className="w-full h-full overflow-hidden">
      {/* First Row */}
      <div className="flex flex-wrap items-start justify-between border-y h-[auto] relative max-w-screen">
        {/* Middle Vertical Divider */}
        <div className="absolute left-2/3 transform translate-x-1/2 top-0 bottom-0 border-l border-gray-300"></div>
        <div className="w-full md:w-2/3 p-4 h-full flex items-center justify-center">
          <div className="w-full h-full">
          <ProtectedSection requiredPermission={PERMISSIONS.GET_EARNING_EXPENSE_GRAPH} title={"Finance Graph"}>
              <TotalEarningsGraph />
              </ProtectedSection>
          </div>
        </div>
        <div className="w-full md:w-1/3 p-4 h-full flex items-center justify-center">
          <div className="w-full h-full">
         
              <TotalStudentsGraphjs />
         
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="flex flex-wrap items-start justify-between border-y h-[auto] relative max-w-screen">
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

export default AccountantSection;