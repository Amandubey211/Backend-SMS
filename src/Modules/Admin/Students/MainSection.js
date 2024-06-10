import React, { useState } from "react";
import DetailedStudentList from "./Components/DetailedStudentList";
import NavigationBar from "./Components/NavigationBar";

const MainSection = () => {
  const [activeSection, setActiveSection] = useState("Everyone");

  return (
    <div className="p-2 w-full ">
      <NavigationBar setActiveSection={setActiveSection} activeSection={activeSection} />
      <DetailedStudentList activeSection={activeSection} />
    </div>
  );
};

export default MainSection;
