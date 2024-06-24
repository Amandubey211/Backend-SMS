import React from "react";
import SubjectSideBar from "../../Component/SubjectSideBar";
import AnnouncementList from "./Components/AnnouncementList";

const MainSection = () => {
  return (
    <div className="flex ">
      <SubjectSideBar />
      <div className="border-l p-2 w-full">
        <AnnouncementList />
      </div>
    </div>
  );
};

export default MainSection;
