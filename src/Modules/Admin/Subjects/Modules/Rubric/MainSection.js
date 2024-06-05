import React, { useState } from "react";
import RubricHeader from "./Components/RubricHeader";
import cardsData from "./Components/MockData/Mockdata";
import RubricCard from "./Components/RubricCard";

import Sidebar from "../../../../../Components/Common/Sidebar";
import AddRubricModal from "./Components/AddRubricModal";
import AddNewCriteriaForm from "./Components/AddNewCriteriaForm ";
import SubjectSideBar from "../../Component/SubjectSideBar";


const MainSection = () => {

  const [isModalOpen, setModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Manage sidebar state

  return (
    <div className="w-full flex ">

<SubjectSideBar/>
    <div className="w-full p-3">
      <RubricHeader onAddRubric={() => setModalOpen(true)} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cardsData.map((card, index) => (
          <RubricCard 
            key={index} 
            title={card.title} 
            criteria={card.criteria} 
            points={card.points} 
          />
        ))}
      </div>
      <AddRubricModal
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        onAddCriteria={() => setSidebarOpen(true)} // Pass down function to open sidebar
      />
      <Sidebar
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)} // Pass down function to close sidebar
        title="Add New Criteria"
      >
        <AddNewCriteriaForm/>
      </Sidebar>
    </div>
    </div>
  );

};

export default MainSection;
