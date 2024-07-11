import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import CreateSyllabusHeader from "./Components/CreateSyllabusHeader";
import SideMenubar from "../../../../../../Components/Admin/SideMenubar";
import EditorComponent from "../../../Component/AdminEditor";
import useCreateSyllabus from "../../../../../../Hooks/AuthHooks/Staff/Admin/Syllabus/useCreateSyllabus";
import useEditSyllabus from "../../../../../../Hooks/AuthHooks/Staff/Admin/Syllabus/useEditSyllabus";

const MainSection = () => {
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
  const isEditing = Boolean(state?.syllabus?._id);

  return (
    <div className="flex">
      <SideMenubar />
      <div className="w-full mb-4">
        <CreateSyllabusHeader
          onSave={handleSave}
          loading={loading}
          isEditing={isEditing}
        />
        <EditorComponent
          inputPlaceHolder="Syllabus Heading"
          assignmentLabel="Page Title"
          assignmentName={assignmentName}
          editorContent={editorContent}
          onNameChange={handleNameChange}
          onEditorChange={handleEditorChange}
        />
        {loading && <p role="status">Loading...</p>}
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
