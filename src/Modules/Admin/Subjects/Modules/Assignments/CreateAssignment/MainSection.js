// MainSection.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import CreateAssignmentHeader from "./Component/CreateAssignmentHeader";
import EditorComponent from "../../../Component/AdminEditor";
import CreateAssignmentForm from "./Component/CreateAssignmentForm";
import ProtectedSection from "../../../../../../Routes/ProtectedRoutes/ProtectedSection";

import {
  createAssignmentThunk,
  updateAssignmentThunk,
} from "../../../../../../Store/Slices/Admin/Class/Assignment/assignmentThunks";

import { PERMISSIONS } from "../../../../../../config/permission";

/** Validation function:
 *  When publishing, we require additional fields.
 */
function validateAssignment(data, isPublishing) {
  const errors = {};

  if (!data.name || !data.name.trim()) {
    errors.name = "Assignment name is required.";
  }
  if (isPublishing) {
    if (!data.moduleId) {
      errors.moduleId = "Module selection is required when publishing.";
    }
    if (!data.points) {
      errors.points = "Points are required when publishing.";
    }
    if (!data.submissionType) {
      errors.submissionType = "Submission type is required when publishing.";
    }
    if (!data.availableFrom) {
      errors.availableFrom = "Available from date is required when publishing.";
    }
    if (!data.dueDate) {
      errors.dueDate = "Due date is required when publishing.";
    }
  }
  return errors;
}

const initialFormState = {
  points: "",
  displayGrade: false,
  submissionType: "",
  allowedAttempts: false,
  numberOfAttempts: null,
  assignTo: "",
  sectionId: "",
  dueDate: "",
  availableFrom: "",
  until: "",
  thumbnail: null,
  moduleId: "",
  chapterId: "",
  groupId: "",
};

const MainSection = ({ setIsEditing }) => {
  const { cid, sid } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Form state
  const [assignmentName, setAssignmentName] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [formState, setFormState] = useState(initialFormState);
  const [isEditingLocal, setLocalIsEditing] = useState(false);
  const [assignmentId, setAssignmentId] = useState("");
  const [criteriaList, setCriteriaList] = useState([]);
  const [existingRubricId, setExistingRubricId] = useState(null);

  // Loading states
  const [saveLoading, setSaveLoading] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);

  // Field-level errors (keys must match input IDs)
  const [formErrors, setFormErrors] = useState({});

  // Refs for validated inputs
  const nameInputRef = useRef(null);
  const moduleSelectRef = useRef(null);
  const pointsInputRef = useRef(null);
  const submissionTypeRef = useRef(null);
  const availableFromRef = useRef(null);
  const dueDateRef = useRef(null);

  // Mapping error keys to refs (fallback if document.getElementById fails)
  const errorRefMap = {
    name: nameInputRef,
    moduleId: moduleSelectRef,
    points: pointsInputRef,
    submissionType: submissionTypeRef,
    availableFrom: availableFromRef,
    dueDate: dueDateRef,
  };

  // Universal scroll-to-first-error function
  const scrollToFirstError = (errors) => {
    const errorKeys = Object.keys(errors);
    if (errorKeys.length === 0) return;
    for (const key of errorKeys) {
      let el = document.getElementById(key);
      if (!el && errorRefMap[key]?.current) {
        el = errorRefMap[key].current;
      }
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => {
          if (el.focus) el.focus({ preventScroll: true });
        }, 400);
        break;
      }
    }
  };

  // Preload assignment if editing
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
        sectionId: assignment.sectionId || "",
        dueDate: assignment.dueDate || "",
        availableFrom: assignment.availableFrom || "",
        until: assignment.until || "",
        thumbnail: assignment.thumbnail || null,
        moduleId: assignment.moduleId || "",
        chapterId: assignment.chapterId || "",
        groupId: assignment.groupId || "",
      });
      setExistingRubricId(assignment.rubricId || null);
    } else {
      setLocalIsEditing(false);
      setIsEditing(false);
    }
  }, [location.state, setIsEditing]);

  const handleNameChange = useCallback((name) => {
    setFormErrors((prev) => ({ ...prev, name: undefined }));
    setAssignmentName(name);
  }, []);

  const handleEditorChange = useCallback((content) => {
    setEditorContent(content);
  }, []);

  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    setFormState((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSave = useCallback(
    async (publish) => {
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
        assignmentData.sectionId = formState.sectionId || "";
      } else if (formState.assignTo === "Group") {
        assignmentData.groupId = formState.groupId || "";
      }

      const errors = validateAssignment(assignmentData, publish === true);
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        toast.error("Please fix the highlighted fields.");
        scrollToFirstError(errors);
        return;
      }

      try {
        if (publish) {
          setPublishLoading(true);
        } else {
          setSaveLoading(true);
        }

        if (isEditingLocal) {
          await dispatch(
            updateAssignmentThunk({ assignmentId, assignmentData })
          );
        } else {
          const result = await dispatch(createAssignmentThunk(assignmentData));
          if (result?.data?._id) {
            setAssignmentId(result.data._id);
          }
        }
        navigate(-1);
      } catch (error) {
        console.error("Error saving assignment:", error);
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
      assignmentId,
      cid,
      sid,
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
        title="Create Assignment"
        requiredPermission={
          PERMISSIONS.CREATE_ASSIGNMENT || PERMISSIONS.UPDATE_ASSIGNMENT
        }
      >
        <div className="w-full flex h-full">
          {/* Left side: Editor (Assignment Name & content) */}
          <div className="w-[70%]">
            <EditorComponent
              assignmentLabel="Assignment Name"
              assignmentName={assignmentName}
              editorContent={editorContent}
              onNameChange={handleNameChange}
              onEditorChange={handleEditorChange}
              inputRef={nameInputRef}
              nameError={formErrors.name} // red outline applied if error exists
            />
          </div>
          {/* Right side: Additional Form Fields */}
          <div className="w-[30%]">
            <CreateAssignmentForm
              {...formState}
              setDisplayGrade={(grade) =>
                setFormState((prev) => ({ ...prev, displayGrade: grade }))
              }
              handleChange={handleFormChange}
              // Passing refs for each validated input
              moduleRef={moduleSelectRef}
              pointsRef={pointsInputRef}
              submissionTypeRef={submissionTypeRef}
              availableFromRef={availableFromRef}
              dueDateRef={dueDateRef}
              moduleError={formErrors.moduleId} // error for module select
              pointsError={formErrors.points} // error for points
              submissionTypeError={formErrors.submissionType} // error for submission type
              availableFromError={formErrors.availableFrom} // error for availableFrom
              dueDateError={formErrors.dueDate} // error for dueDate
            />
          </div>
        </div>
      </ProtectedSection>
    </div>
  );
};

export default MainSection;
