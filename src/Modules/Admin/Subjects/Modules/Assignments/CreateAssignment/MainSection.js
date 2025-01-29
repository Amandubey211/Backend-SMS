import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import CreateAssignmentHeader from "./Component/CreateAssignmentHeader";
import EditorComponent from "../../../Component/AdminEditor";
import CreateAssignmentForm from "./Component/CreateAssignmentForm";
import { useDispatch, useSelector } from "react-redux";
import {
  createAssignmentThunk,
  updateAssignmentThunk,
} from "../../../../../../Store/Slices/Admin/Class/Assignment/assignmentThunks";
import ProtectedSection from "../../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../../config/permission";

// Memoized initial form state to avoid re-initialization
const initialFormState = {
  points: "",
  displayGrade: false,
  submissionType: "",
  allowedAttempts: false,
  numberOfAttempts: null,
  assignTo: "",
  sectionId: null,
  dueDate: "",
  availableFrom: "",
  until: "",
  thumbnail: null,
  moduleId: null,
  chapterId: null,
  groupId: null,
};

const MainSection = ({ setIsEditing }) => {
  const { cid, sid } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  // State management
  const [assignmentName, setAssignmentName] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [formState, setFormState] = useState(initialFormState);
  const [isEditing, setLocalIsEditing] = useState(false);
  const [assignmentId, setAssignmentId] = useState("");
  const [criteriaList, setCriteriaList] = useState([]);
  const [existingRubricId, setExistingRubricId] = useState(null);

  const [saveLoading, setSaveLoading] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);

  // Preload the assignment if editing
  useEffect(() => {
    if (location.state && location.state.assignment) {
      const assignment = location.state.assignment;
      setAssignmentName(assignment.name || "");
      setEditorContent(assignment.content || "");
      setLocalIsEditing(true);
      setIsEditing(true);
      setAssignmentId(assignment._id);
      setFormState({
        points: assignment.points || "",
        displayGrade: assignment.grade || false,
        submissionType: assignment.submissionType || "",
        allowedAttempts: assignment.allowedAttempts,
        numberOfAttempts: assignment.allowNumberOfAttempts || "",
        assignTo: assignment.assignTo || "",
        sectionId: assignment?.sectionId || null,
        dueDate: assignment.dueDate || "",
        availableFrom: assignment.availableFrom || "",
        until: assignment.until || "",
        thumbnail: assignment.thumbnail || null,
        moduleId: assignment.moduleId || null,
        chapterId: assignment.chapterId || null,
        groupId: assignment?.groupId || null,
      });
      setExistingRubricId(assignment.rubricId || null);
    } else {
      setLocalIsEditing(false);
      setIsEditing(false);
    }
  }, [location.state, setIsEditing]);

  // Memoized handler functions to avoid unnecessary re-creation
  const handleNameChange = useCallback((name) => setAssignmentName(name), []);
  const handleEditorChange = useCallback(
    (content) => setEditorContent(content),
    []
  );

  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // Optimized save function using useCallback
  const handleSave = useCallback(
    async (publish) => {
      try {
        setSaveLoading(!publish);
        setPublishLoading(publish);

        // Ensure allowedAttempts is properly set as a boolean
        const allowedAttempts = formState.allowedAttempts === true;

        let allowNumberOfAttempts = null;

        // Check if allowedAttempts is true, then set allowNumberOfAttempts
        if (allowedAttempts) {
          allowNumberOfAttempts = formState.numberOfAttempts
            ? Number(formState.numberOfAttempts)
            : null;
        }

        const assignmentData = {
          name: assignmentName,
          content: editorContent,
          points: formState.points,
          grade: formState.displayGrade,
          submissionType: formState.submissionType,
          allowedAttempts,
          allowNumberOfAttempts, // Send this if allowedAttempts is true
          assignTo: formState.assignTo,
          dueDate: formState.dueDate,
          availableFrom: formState.availableFrom,
          until: formState.until,
          thumbnail: formState.thumbnail,
          classId: cid,
          subjectId: sid,
          moduleId: formState.moduleId,
          chapterId: formState.chapterId,
          publish,
        };

        if (formState.assignTo === "Section") {
          assignmentData.sectionId = formState.sectionId || null;
        } else if (formState.assignTo === "Group") {
          assignmentData.groupId = formState.groupId || null;
        }

        if (isEditing) {
          await dispatch(
            updateAssignmentThunk({ assignmentId, assignmentData })
          );
        } else {
          const response = await dispatch(
            createAssignmentThunk(assignmentData)
          );
          setAssignmentId(response?.data?._id);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setPublishLoading(false);
        setSaveLoading(false);
      }
    },
    [
      assignmentName,
      editorContent,
      formState,
      isEditing,
      cid,
      sid,
      assignmentId,
      dispatch,
    ]
  );

  return (
    <div className="flex flex-col w-full h-full">
      <CreateAssignmentHeader
        onSave={handleSave}
        id={assignmentId}
        isEditing={isEditing}
        criteriaList={criteriaList}
        setCriteriaList={setCriteriaList}
        existingRubricId={existingRubricId}
        setExistingRubricId={setExistingRubricId}
        saveLoading={saveLoading}
        publishLoading={publishLoading}
      />
      <ProtectedSection
        title={"Create Assignment"}
        requiredPermission={
          PERMISSIONS.CREATE_ASSIGNMENT || PERMISSIONS.UPDATE_ASSIGNMENT
        }
        aman={true}
      >
        <div className="w-full flex h-full">
          {/* Prevent unnecessary re-renders by memoizing */}
          <div className="w-[70%]">
            <EditorComponent
              assignmentLabel="Assignment Name"
              assignmentName={assignmentName}
              editorContent={editorContent}
              onNameChange={handleNameChange}
              onEditorChange={handleEditorChange}
            />
          </div>
          <div className="w-[30%]">
            <CreateAssignmentForm
              {...formState}
              setDisplayGrade={(grade) =>
                setFormState((prev) => ({ ...prev, displayGrade: grade }))
              }
              handleChange={handleFormChange}
            />
          </div>
        </div>
      </ProtectedSection>
    </div>
  );
};

export default MainSection;
