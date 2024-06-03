import React from "react";
import DetailedStudentList from "./Components/DetailedStudentList";
import NavigationBar from "./Components/NavigationBar";

const MainSection = () => {
  return (
    <div className="p-2 ">
      <NavigationBar />
      <DetailedStudentList />
    </div>
  );
};

export default MainSection;
