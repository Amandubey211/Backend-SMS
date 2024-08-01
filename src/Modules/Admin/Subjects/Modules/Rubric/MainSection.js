import React, { useState, lazy, Suspense, useEffect } from "react";
import RubricHeader from "./Components/RubricHeader";
import RubricCard from "./Components/RubricCard";
import Sidebar from "../../../../../Components/Common/Sidebar";
import AddNewCriteriaForm from "./Components/AddNewCriteriaForm";
import SubjectSideBar from "../../Component/SubjectSideBar";
import useGetRubricBySubjectId from "../../../../../Hooks/AuthHooks/Staff/Admin/Rubric/useGetRubricBySubjectId";
import useDeleteRubric from "../../../../../Hooks/AuthHooks/Staff/Admin/Rubric/useDeleteRubric";
import { useParams } from "react-router-dom";
import Spinner from "../../../../../Components/Common/Spinner";
import NoDataFound from "../../../../../Components/Common/NoDataFound"; // Import a placeholder component

// Lazy load the AddRubricModal component
const AddRubricModal = lazy(() => import("./Components/AddRubricModal"));

const MainSection = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [criteria, setCriteria] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [criteriaToEdit, setCriteriaToEdit] = useState(null);
  const { error, fetchRubricBySubjectId, loading, rubrics } =
    useGetRubricBySubjectId();
  const { deleteRubric } = useDeleteRubric();
  const { sid } = useParams();

  useEffect(() => {
    fetchRubricBySubjectId(sid);
  }, [sid, fetchRubricBySubjectId]);

  const handleAddNewCriteria = (newCriteria) => {
    if (editMode) {
      setCriteria(
        criteria.map((crit, index) =>
          index === criteriaToEdit.index ? newCriteria : crit
        )
      );
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

  const handleDeleteRubric = async (rubricId) => {
    const result = await deleteRubric(rubricId);
    if (result.success) {
      fetchRubricBySubjectId(sid);
    }
  };

  return (
    <div className="w-full flex">
      <SubjectSideBar />
      <div className="w-full p-3 border-l">
        <RubricHeader onAddRubric={() => setModalOpen(true)} />
        {loading ? (
          <Spinner />
        ) : rubrics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {rubrics.map((rubric) => (
              <RubricCard
                key={rubric._id}
                rubricId={rubric._id}
                title={rubric.name}
                criteria={rubric.criteria.length}
                points={rubric.totalScore}
                onDelete={() => handleDeleteRubric(rubric._id)} // Pass the delete function
              />
            ))}
          </div>
        ) : (
          <NoDataFound title="Rubrics" />
        )}
        <Suspense fallback={<Spinner />}>
          {isModalOpen && (
            <AddRubricModal
              type="assignment"
              isOpen={isModalOpen}
              onClose={() => setModalOpen(false)}
              criteriaList={criteria}
              setCriteriaList={setCriteria}
              onAddCriteria={() => setSidebarOpen(true)}
              onDeleteCriteria={handleDeleteCriteria}
              onEditCriteria={handleEditCriteria}
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
