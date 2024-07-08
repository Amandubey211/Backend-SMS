import React, { useState, lazy, Suspense, useEffect } from "react";
import RubricHeader from "./Components/RubricHeader";
import RubricCard from "./Components/RubricCard";
import RubricList from "./Components/MockData/DummyRubricList";
import Sidebar from "../../../../../Components/Common/Sidebar";
import AddNewCriteriaForm from "./Components/AddNewCriteriaForm";
import SubjectSideBar from "../../Component/SubjectSideBar";
import initialCriteria from "./Components/MockData/DummyCriteria";
import useGetRubricBySubjectId from "../../../../../Hooks/AuthHooks/Staff/Admin/Rubric/useGetRubricBySubjectId";

// Lazy load the AddRubricModal component
const AddRubricModal = lazy(() => import("./Components/AddRubricModal"));
const MainSection = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [criteria, setCriteria] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [criteriaToEdit, setCriteriaToEdit] = useState(null);

  const handleAddNewCriteria = (newCriteria) => {
    if (editMode) {
      setCriteria(criteria.map((crit, index) => index === criteriaToEdit.index ? newCriteria : crit));
    } else {
      setCriteria([...criteria, newCriteria]);
    }
    setSidebarOpen(false);
    setEditMode(false);
    setCriteriaToEdit(null);
  };

  const handleEditCriteria = (index) => {
    setCriteriaToEdit({ ...criteria[index], index });
    setSidebarOpen(true);
    setEditMode(true);
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
          {RubricList?.map((card, index) => (
            <RubricCard
              key={index}
              title={card.title}
              criteria={card.criteria}
              points={card.points}
            />
          ))}
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          {isModalOpen && (
            <AddRubricModal
              isOpen={isModalOpen}
              onClose={() => setModalOpen(false)}
              criteriaList={criteria}
              setCriteriaList={setCriteria}
              onAddCriteria={() => setSidebarOpen(true)}
              onDeleteCriteria={handleDeleteCriteria}
              onEditCriteria={handleEditCriteria} // Pass the handleEditCriteria function
            />
          )}
        </Suspense>
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => {
            setSidebarOpen(false);
            setEditMode(false);
            setCriteriaToEdit(null);
          }}
          title={editMode ? "Update Criteria" : "Add New Criteria"}
        >
          <AddNewCriteriaForm 
            onSave={handleAddNewCriteria} 
            initialData={criteriaToEdit} 
            editMode={editMode} 
          />
        </Sidebar>
      </div>
    </div>
  );
};

export default MainSection;
