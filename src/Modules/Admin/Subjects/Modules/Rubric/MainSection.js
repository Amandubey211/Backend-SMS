// src/components/MainSection.js

import React, { useState, lazy, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchRubricsBySubjectId,
  deleteRubricThunk,
  updateRubricThunk,
  createAssignmentRubricThunk,
  createQuizRubricThunk,
} from "../../../../../Store/Slices/Admin/Class/Rubric/rubricThunks";
import RubricHeader from "./Components/RubricHeader";
import RubricCard from "./Components/RubricCard";
import Sidebar from "../../../../../Components/Common/Sidebar";
import AddNewCriteriaForm from "./Components/AddNewCriteriaForm";
import SubjectSideBar from "../../Component/SubjectSideBar";
import Spinner from "../../../../../Components/Common/Spinner";
import NoDataFound from "../../../../../Components/Common/NoDataFound";

const AddRubricModal = lazy(() => import("./Components/AddRubricModal"));

const MainSection = () => {
  const dispatch = useDispatch();
  const { sid } = useParams();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [criteria, setCriteria] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [criteriaToEdit, setCriteriaToEdit] = useState(null);
  const [rubricToEdit, setRubricToEdit] = useState(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState("");
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [existingRubricId, setExistingRubricId] = useState(null);

  // Accessing the Redux state
  const { rubrics, loading, error } = useSelector(
    (state) => state.admin.rubrics
  );

  // Fetching rubrics when component mounts or subject ID changes
  useEffect(() => {
    dispatch(fetchRubricsBySubjectId(sid));
  }, [sid, dispatch]);

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
    const result = await dispatch(deleteRubricThunk(rubricId));
    if (result.success) {
      dispatch(fetchRubricsBySubjectId(sid)); // Refetch rubrics after deletion
    }
  };

  const handleEditRubric = (rubricId) => {
    const rubric = rubrics.find((rubric) => rubric._id === rubricId);
    setRubricToEdit(rubric);
    setCriteria(rubric.criteria);
    setSelectedAssignmentId(rubric.assignmentId?._id || "");
    setSelectedQuizId(rubric.quizId?._id || "");
    setExistingRubricId(rubric._id);
    setModalOpen(true);
    setEditMode(true);
  };

  const handleSubmit = async (rubricData, type) => {
    if (existingRubricId) {
      const result = await dispatch(
        updateRubricThunk(existingRubricId, rubricData)
      );
      if (result.success) {
        dispatch(fetchRubricsBySubjectId(sid));
        setModalOpen(false);
        setRubricToEdit(null);
        setEditMode(false);
      }
    } else {
      let result;
      if (type === "createQuizRubric") {
        result = await dispatch(createQuizRubricThunk(rubricData));
      } else {
        result = await dispatch(createAssignmentRubricThunk(rubricData));
      }
      if (result.success) {
        dispatch(fetchRubricsBySubjectId(sid));
        setModalOpen(false);
      }
    }
  };

  const handleAddRubric = () => {
    setModalOpen(true);
    setEditMode(false);
    setCriteria([]); // Clear criteria for new rubric
    setRubricToEdit(null);
    setSelectedAssignmentId("");
    setSelectedQuizId("");
    setExistingRubricId(null);
  };

  return (
    <div className="w-full flex">
      <SubjectSideBar />
      <div className="w-full p-3 border-l">
        <RubricHeader onAddRubric={handleAddRubric} />
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
                points={rubric?.totalScore}
                onDelete={() => handleDeleteRubric(rubric._id)}
                onEdit={() => handleEditRubric(rubric._id)}
              />
            ))}
          </div>
        ) : (
          <NoDataFound title="Rubrics" />
        )}
        <Suspense fallback={<Spinner />}>
          {isModalOpen && (
            <AddRubricModal
              isOpen={isModalOpen}
              onClose={() => setModalOpen(false)}
              criteriaList={criteria}
              setCriteriaList={setCriteria}
              onAddCriteria={() => setSidebarOpen(true)}
              onDeleteCriteria={handleDeleteCriteria}
              onEditCriteria={handleEditCriteria}
              onSubmit={handleSubmit}
              editMode={editMode}
              AssignmentId={selectedAssignmentId}
              QuizId={selectedQuizId}
              setExistingRubricId={setExistingRubricId}
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
