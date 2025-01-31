import React from "react";
import SubjectSideBar from "../../Component/SubjectSideBar";
import AnnouncementList from "./Components/AnnouncementList";
import ProtectedSection from "../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../config/permission";

const MainSection = () => {
  return (
    <div className="flex w-full h-full ">
      <SubjectSideBar />
      <ProtectedSection
        requiredPermission={PERMISSIONS.ALL_ANNOUNCEMENTS}
        title="Announcement List"
      >
        <div className="border-l p-2 w-full">
          <AnnouncementList />
        </div>
      </ProtectedSection>
    </div>
  );
};

export default MainSection;
