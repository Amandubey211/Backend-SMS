import React from "react";
import NavigationBar from "./Components/NavigationBar";
import UnAssignedStudentList from "./Components/UnAssignedStudentList";
import GroupList from "./Components/GroupList";

const MainSection = () => {
  return (
    <div>
      <NavigationBar />
      <div className="p-2 flex gap-1 ">
        <UnAssignedStudentList />
        <GroupList />
      </div>
    </div>
  );
};

export default MainSection;
