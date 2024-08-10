import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import CreateSyllabusHeader from "./Components/CreateSyllabusHeader";
import SideMenubar from "../../../../../../Components/Admin/SideMenubar";
import EditorComponent from "../../../Component/AdminEditor";
import useCreateSyllabus from "../../../../../../Hooks/AuthHooks/Staff/Admin/Syllabus/useCreateSyllabus";
import useEditSyllabus from "../../../../../../Hooks/AuthHooks/Staff/Admin/Syllabus/useEditSyllabus";
import { useSelector } from "react-redux";
import Spinner from "../../../../../../Components/Common/Spinner";

const MainSection = ({ setIsEditing }) => {
  const { state } = useLocation();
  const { sid } = useParams();
  const [assignmentName, setAssignmentName] = useState(
    state?.syllabus?.title || ""
  );
  const [editorContent, setEditorContent] = useState(
    state?.syllabus?.content || ""
  );
  const {
    loading: createLoading,
    error: createError,
    createSyllabus,
  } = useCreateSyllabus();
  const {
    loading: editLoading,
    error: editError,
    editSyllabus,
  } = useEditSyllabus();

  useEffect(() => {
    // Set the isEditing state in the parent based on whether we are editing or creating
    setIsEditing(Boolean(state?.syllabus?._id));
  }, [state, setIsEditing]);

  const handleNameChange = (name) => {
    setAssignmentName(name);
  };

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  const handleSave = async () => {
    const data = {
      title: assignmentName,
      content: editorContent,
      subjectId: sid,
    };

    if (state?.syllabus?._id) {
      await editSyllabus(state.syllabus._id, data);
    } else {
      await createSyllabus(data);
    }
  };

  const loading = createLoading || editLoading;
  const error = createError || editError;
  const isSidebarOpen = useSelector((state) => state.sidebar.isOpen);
  const sidebarWidth = isSidebarOpen ? "15%" : "7%";

  return (
    <div className="flex w-full min-h-screen">
      <SideMenubar />
      <div
        className={`ml-${sidebarWidth} transition-all duration-500 flex-1 h-full`}
        style={{
          marginLeft: sidebarWidth,
        }}
      >
        <CreateSyllabusHeader
          onSave={handleSave}
          loading={loading}
          isEditing={Boolean(state?.syllabus?._id)}
        />
        <EditorComponent
          inputPlaceHolder="Syllabus Heading"
          assignmentLabel="Page Title"
          assignmentName={assignmentName}
          editorContent={editorContent}
          onNameChange={handleNameChange}
          onEditorChange={handleEditorChange}
        />
        {loading && <Spinner />}
        {error && (
          <p role="alert" className="text-red-400 text-current my-4">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default MainSection;
