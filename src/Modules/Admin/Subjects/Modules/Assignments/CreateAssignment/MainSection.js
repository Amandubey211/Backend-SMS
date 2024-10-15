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
        allowedAttempts: assignment.allowedAttempts ? "true" : "false",
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
        if (publish) {
          setPublishLoading(true);
        } else {
          setSaveLoading(true);
        }

        const allowedAttempts = formState.allowedAttempts === "true";
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
          assignTo: formState?.assignTo,
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
          let sectionId = formState.sectionId || null;
          await dispatch(
            updateAssignmentThunk({ assignmentId, assignmentData, sectionId })
          );
        } else {
          const response = await dispatch(
            createAssignmentThunk(assignmentData)
          );
          setAssignmentId(response?.data?._id);
        }
      } catch (error) {
        console.log(error);
      } finally {
        if (publish) {
          setPublishLoading(false);
        } else {
          setSaveLoading(false);
        }
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
    <div className="flex flex-col w-full">
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
      <div className="w-full flex">
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
    </div>
  );
};

export default MainSection;
