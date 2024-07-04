import React, { useState } from "react";
import RubricHeader from "./Components/RubricHeader";
import RubricCard from "./Components/RubricCard";
import RubricList from "./Components/MockData/DummyRubricList";
import Sidebar from "../../../../../Components/Common/Sidebar";
import AddRubricModal from "./Components/AddRubricModal";
import AddNewCriteriaForm from "./Components/AddNewCriteriaForm";
import SubjectSideBar from "../../Component/SubjectSideBar";
import initialCriteria from "./Components/MockData/DummyCriteria";

const MainSection = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [criteria, setCriteria] = useState(initialCriteria);

  const handleAddNewCriteria = (newCriteria) => {
    setCriteria([...criteria, newCriteria]);
    setSidebarOpen(false);
  };

  const handleDeleteCriteria = (criteriaIndex) => {
    setCriteria(criteria.filter((_, index) => index !== criteriaIndex));
  };

  return (
    <div className="w-full flex">
      <SubjectSideBar />
      <div className="w-full p-3 border-l">
        <RubricHeader onAddRubric={() => setModalOpen(true)} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {RubricList.map((card, index) => (
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
          criteria={criteria}
          onAddCriteria={() => setSidebarOpen(true)}
          onDeleteCriteria={handleDeleteCriteria}
        />
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setSidebarOpen(false)}
          title="Add New Criteria"
        >
          <AddNewCriteriaForm onAddNewCriteria={handleAddNewCriteria} />
        </Sidebar>
      </div>
    </div>
  );
};

export default MainSection;
