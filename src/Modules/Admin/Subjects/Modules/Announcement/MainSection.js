import React from "react";
import SubjectSideBar from "../../Component/SubjectSideBar";
import AnnouncementList from "./Components/AnnouncementList";
import ProtectedSection from "../../../../../Routes/ProtectedRoutes/ProtectedSection";

const MainSection = () => {
  return (
    <div className="flex ">
      <SubjectSideBar />
      <div className="border-l p-2 w-full">
      <ProtectedSection requiredPermission="viewAnnouncemen">
        <AnnouncementList />
        </ProtectedSection>
      </div>
    </div>
  );
};

export default MainSection;
