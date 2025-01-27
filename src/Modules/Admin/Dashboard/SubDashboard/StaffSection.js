import React from "react";
import NoticeBoard from "../NoticeModule/NoticeBoard";
import Events from "../EventModule/Event";
import { PERMISSIONS } from "../../../../config/permission";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";


const StaffSection = () => {
  return (
    <div className="w-full h-full overflow-hidden">
      {/* First Row with Middle Divider */}
      <div className="flex flex-wrap items-start justify-between border-y relative max-w-screen">
        {/* Middle Vertical Divider */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 border-l border-gray-300"></div>
        <div className="w-full md:w-1/2 p-4 h-full flex items-center justify-center">
          <div className="w-full h-full">
            <ProtectedSection requiredPermission={PERMISSIONS.VIEW_NOTICE} title={"Notices"}>
              <NoticeBoard descriptionLength={58} />
            </ProtectedSection>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-4 h-full flex items-center justify-center">
          <div className="w-full h-full">
            <ProtectedSection requiredPermission={PERMISSIONS.VIEW_EVENTS} title={"Events"}>
              <Events />
            </ProtectedSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffSection;
