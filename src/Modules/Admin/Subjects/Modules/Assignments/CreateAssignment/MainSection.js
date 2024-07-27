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
  displayGrade: false,
  submissionType: "",
  allowedAttempts: false,
  numberOfAttempts: "",
  assignTo: "",
  section: null,
  dueDate: "",
  availableFrom: "",
  until: "",
  thumbnail: null,
  moduleId: null,
  chapterId: null,
  group: null,
};

const MainSection = () => {
  const { cid, sid } = useParams();
  const location = useLocation();

  const [assignmentName, setAssignmentName] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [formState, setFormState] = useState(initialFormState);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [assignmentId, setAssignmentId] = useState("");
  const handleSidebarOpen = useCallback(() => setSidebarOpen(true), []);
  const handleSidebarClose = useCallback(() => setSidebarOpen(false), []);

  const { createAssignment, loading: createLoading } = useCreateAssignment();
  const { updateAssignment, loading: updateLoading } = useUpdateAssignment();

  useEffect(() => {
    if (location.state && location.state.assignment) {
      const assignment = location.state.assignment;
      setAssignmentName(assignment.name || "");
      setEditorContent(assignment.content || "");
      setIsEditing(true);
      setAssignmentId(assignment._id);
      setFormState({
        points: assignment.points || "",
        displayGrade: assignment.grade || false,
        submissionType: assignment.submissionType || "",
        allowedAttempts: assignment.allowedAttempts || false,
        numberOfAttempts: assignment.allowNumberOfAttempts || "",
        assignTo: assignment.assignTo || "",
        section: assignment?.sectionId || null,
        dueDate: assignment.dueDate || "",
        availableFrom: assignment.availableFrom || "",
        until: assignment.until || "",
        thumbnail: assignment.thumbnail || null,
        moduleId: assignment.moduleId || null,
        chapterId: assignment.chapterId || null,
        group: assignment?.groupId || null,
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
  console.log("formstate--", formState);
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
      assignmentData.sectionId = formState.section || null;
    } else if (formState.assignTo === "Group") {
      assignmentData.groupId = formState.group || null;
    }
    console.log("assignmnet data", assignmentData);
    if (isEditing) {
      let sectionId = formState.section || null
      await updateAssignment(assignmentId, assignmentData, sectionId);

    } else {
      await createAssignment(assignmentData);
    }
  };


  return (
    <div className="flex flex-col w-full">
      <CreateAssignmentHeader onSave={handleSave} id={assignmentId} />
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
