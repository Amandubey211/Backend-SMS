import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import CreateAssignmentHeader from "./Component/CreateAssignmentHeader";
import EditorComponent from "../../../Component/AdminEditor";
import CreateAssignmentForm from "./Component/CreateAssignmentForm";
import { useDispatch } from "react-redux";
import {
  createAssignmentThunk,
  updateAssignmentThunk,
} from "../../../../../../Store/Slices/Admin/Class/Assignment/assignmentThunks";
import ProtectedSection from "../../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../../config/permission";

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
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State management
  const [assignmentName, setAssignmentName] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [formState, setFormState] = useState(initialFormState);
  const [isEditingLocal, setLocalIsEditing] = useState(false);
  const [assignmentId, setAssignmentId] = useState("");
  const [criteriaList, setCriteriaList] = useState([]);
  const [existingRubricId, setExistingRubricId] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);

  // Error states for validation
  const [nameError, setNameError] = useState("");
  const [moduleError, setModuleError] = useState("");

  // Refs for input fields
  const nameInputRef = useRef(null);
  const moduleSelectRef = useRef(null);

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

  // Memoized handler functions
  const handleNameChange = useCallback(
    (name) => {
      if (name.trim() && nameError) setNameError("");
      setAssignmentName(name);
    },
    [nameError]
  );

  const handleEditorChange = useCallback(
    (content) => setEditorContent(content),
    []
  );

  const handleFormChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      if (name === "moduleId" && value && moduleError) {
        setModuleError("");
      }
      setFormState((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [moduleError]
  );

  // Optimized save function with validation
  const handleSave = useCallback(
    async (publish) => {
      // Validate that assignment name is provided
      if (!assignmentName.trim()) {
        setNameError("Assignment name is required");
        nameInputRef.current?.focus();
        return;
      } else {
        setNameError("");
      }

      // If publishing, validate that a module is selected
      if (publish && !formState.moduleId) {
        setModuleError("Module selection is required when publishing");
        moduleSelectRef.current?.focus();
        return;
      } else {
        setModuleError("");
      }

      try {
        setSaveLoading(!publish);
        setPublishLoading(publish);

        const allowedAttempts = formState.allowedAttempts === true;
        let allowNumberOfAttempts = null;

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
          allowNumberOfAttempts,
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

        if (isEditingLocal) {
          await dispatch(
            updateAssignmentThunk({ assignmentId, assignmentData })
          );
        } else {
          const response = await dispatch(
            createAssignmentThunk(assignmentData)
          );
          setAssignmentId(response?.data?._id);
        }
        navigate(-1);
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
      isEditingLocal,
      cid,
      sid,
      assignmentId,
      dispatch,
      navigate,
    ]
  );

  return (
    <div className="flex flex-col w-full h-full">
      <CreateAssignmentHeader
        onSave={handleSave}
        id={assignmentId}
        isEditing={isEditingLocal}
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
      >
        <div className="w-full flex h-full">
          <div className="w-[70%]">
            <EditorComponent
              assignmentLabel="Assignment Name"
              assignmentName={assignmentName}
              editorContent={editorContent}
              onNameChange={handleNameChange}
              onEditorChange={handleEditorChange}
              inputRef={nameInputRef}
              nameError={nameError}
            />
          </div>
          <div className="w-[30%]">
            <CreateAssignmentForm
              {...formState}
              setDisplayGrade={(grade) =>
                setFormState((prev) => ({ ...prev, displayGrade: grade }))
              }
              handleChange={handleFormChange}
              moduleRef={moduleSelectRef}
              moduleError={moduleError}
            />
          </div>
        </div>
      </ProtectedSection>
    </div>
  );
};

export default MainSection;
