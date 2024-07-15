import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import CreateAssignmentHeader from "./Component/CreateAssignmentHeader";
import EditorComponent from "../../../Component/AdminEditor";
import Sidebar from "../../../../../../Components/Common/Sidebar";
import useCreateAssignment from "../../../../../../Hooks/AuthHooks/Staff/Admin/Assignment/createAssignment";
import toast from "react-hot-toast";
import CreateAssignmentForm from "./Component/CreateAssignmentForm";
import AddNewCriteriaForm from "../../Rubric/Components/AddNewCriteriaForm";
import useUpdateAssignment from "../../../../../../Hooks/AuthHooks/Staff/Admin/Assignment/useUpdateAssignment";

const initialFormState = {
  points: "",
  displayGrade: "",
  submissionType: "",
  allowedAttempts: "",
  numberOfAttempts: "",
  assignTo: "",
  section: "",
  dueDate: "",
  availableFrom: "",
  until: "",
  thumbnail: null,
  moduleId: "",
  chapterId: "",
};

const MainSection = () => {
  const { cid, sid } = useParams();
  const location = useLocation();
  const assignmentData = location.state?.assignment || {};

  const [assignmentName, setAssignmentName] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [formState, setFormState] = useState(initialFormState);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSidebarOpen = useCallback(() => setSidebarOpen(true), []);
  const handleSidebarClose = useCallback(() => setSidebarOpen(false), []);

  const { createAssignment, loading: createLoading } = useCreateAssignment();
  const { updateAssignment, loading: updateLoading } = useUpdateAssignment();

  useEffect(() => {
    if (location.state && location.state.assignment) {
      const assignment = location.state.assignment;
      console.log(assignment)
      setAssignmentName(assignment.name || "");
      setEditorContent(assignment.content || "");
      setIsEditing(true);
      setFormState({
        points: assignment.points || "",
        displayGrade: assignment.grade || "",
        submissionType: assignment.submissionType || "",
        allowedAttempts: assignment.allowedAttempts || "",
        numberOfAttempts: assignment.allowNumberOfAttempts || "",
        assignTo: assignment.assignTo || "",
        section: assignment.sectionId || "",
        dueDate: assignment.dueDate || "",
        availableFrom: assignment.availableFrom || "",
        until: assignment.until || "",
        thumbnail: assignment.thumbnail || null,
        moduleId: assignment.moduleId || "",
        chapterId: assignment.chapterId || "",
      });
    }
  }, [location.state]);

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
    const assignmentData = {
      name: assignmentName,
      content: editorContent,
      points: formState.points,
      grade: formState.displayGrade,
      submissionType: formState.submissionType,
      allowedAttempts: formState.allowedAttempts,
      allowNumberOfAttempts: formState.numberOfAttempts,
      assignTo: formState.assignTo,
      sectionId: formState.section,
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

    if (isEditing) {
      const result = await updateAssignment(assignmentData);
      if (result.success) {
        toast.success("Assignment updated successfully");
      } else {
        toast.error("Failed to update assignment");
      }
    } else {
      const result = await createAssignment(assignmentData);
      if (result.success) {
        toast.success("Assignment created successfully");
      } else {
        toast.error("Failed to create assignment");
      }
    }
  };

  return (
    <div className="flex flex-col w-full">
      <CreateAssignmentHeader onSave={handleSave} />
      <div className="w-full flex">
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
        <AddNewCriteriaForm />
      </Sidebar>
    </div>
  );
};

export default MainSection;
