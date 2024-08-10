import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import CreateAssignmentHeader from "./Component/CreateAssignmentHeader";
import EditorComponent from "../../../Component/AdminEditor";
import Sidebar from "../../../../../../Components/Common/Sidebar";
import useCreateAssignment from "../../../../../../Hooks/AuthHooks/Staff/Admin/Assignment/createAssignment";
import useUpdateAssignment from "../../../../../../Hooks/AuthHooks/Staff/Admin/Assignment/useUpdateAssignment";
import toast from "react-hot-toast";
import CreateAssignmentForm from "./Component/CreateAssignmentForm";
import AddNewCriteriaForm from "../../Rubric/Components/AddNewCriteriaForm";

const initialFormState = {
  points: "",
  displayGrade: false,
  submissionType: "",
  allowedAttempts: "false", // Default to "Unlimited"
  numberOfAttempts: "",
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

  const [assignmentName, setAssignmentName] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [formState, setFormState] = useState(initialFormState);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setLocalIsEditing] = useState(false); // Define isEditing state locally
  const [assignmentId, setAssignmentId] = useState("");
  const [criteriaList, setCriteriaList] = useState([]);
  const [existingRubricId, setExistingRubricId] = useState(null);

  const { createAssignment, loading: createLoading } = useCreateAssignment();
  const { updateAssignment, loading: updateLoading } = useUpdateAssignment();

  const handleSidebarOpen = useCallback(() => setSidebarOpen(true), []);
  const handleSidebarClose = useCallback(() => setSidebarOpen(false), []);

  useEffect(() => {
    if (location.state && location.state.assignment) {
      const assignment = location.state.assignment;
      setAssignmentName(assignment.name || "");
      setEditorContent(assignment.content || "");
      setLocalIsEditing(true); // Set the local isEditing state
      setIsEditing(true); // Inform the parent component that we're editing
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
    } else {
      setLocalIsEditing(false); // Set the local isEditing state
      setIsEditing(false); // Inform the parent component that we're creating
    }
  }, [location.state, setIsEditing]);

  const handleNameChange = (name) => setAssignmentName(name);
  const handleEditorChange = (content) => setEditorContent(content);

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (publish) => {
    // Adjust allowedAttempts and numberOfAttempts based on the select option
    const allowedAttempts = formState.allowedAttempts === "true";
    const allowNumberOfAttempts = allowedAttempts
      ? formState.numberOfAttempts
      : null;

    const assignmentData = {
      name: assignmentName,
      content: editorContent,
      points: formState.points,
      grade: formState.displayGrade,
      submissionType: formState.submissionType,
      allowedAttempts, // boolean value
      allowNumberOfAttempts, // either null or number
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

    try {
      if (isEditing) {
        // Use the local isEditing state
        let sectionId = formState.sectionId || null;
        await updateAssignment(assignmentId, assignmentData, sectionId);
        toast.success("Assignment updated successfully.");
      } else {
        const response = await createAssignment(assignmentData);
        setAssignmentId(response.data._id); // Set assignment ID after creation
        toast.success("Assignment created successfully.");
      }
    } catch (error) {
      toast.error("Failed to save the assignment. Please try again.");
    }
  };

  return (
    <div className="flex flex-col w-full">
      <CreateAssignmentHeader
        onSave={handleSave}
        id={assignmentId}
        isEditing={isEditing} // Pass the local isEditing state
        criteriaList={criteriaList}
        setCriteriaList={setCriteriaList}
        setExistingRubricId={setExistingRubricId}
        assignmentId={assignmentId} // Pass assignment ID to header
      />
      <div className="w-full flex ">
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
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        title="Add New Criteria"
      >
        <AddNewCriteriaForm
          onSave={(criteria) =>
            setFormState((prev) => ({
              ...prev,
              criteria: [...prev.criteria, criteria],
            }))
          }
        />
      </Sidebar>
    </div>
  );
};

export default MainSection;
