import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Layout from "../../../../../../Components/Common/Layout";
import SideMenubar from "../../../../../../Components/Admin/SideMenubar";
import AddDiscussionHeader from "./Components/AddDiscussionHeader";
import CreateDiscussionForm from "./Components/CreateDiscussionForm";
import TopicTitleInput from "./Components/TopicTitleInput";
import FileInput from "./Components/FileInput";
import EditorComponent from "../../../Component/AdminEditor";
import useCreateDiscussion from "../../../../../../Hooks/AuthHooks/Staff/Admin/Disscussion/useCreateDiscussion";
import useUpdateDiscussion from "../../../../../../Hooks/AuthHooks/Staff/Admin/Disscussion/useUpdateDiscussion";

const AddDiscussion = () => {
  const { state } = useLocation();
  const { cid, sid } = useParams();
  const navigate = useNavigate();

  const [assignmentName, setAssignmentName] = useState(
    state?.discussion?.title || ""
  );
  const [editorContent, setEditorContent] = useState(
    state?.discussion?.content || ""
  );
  const [file, setFile] = useState(null);
  const [formState, setFormState] = useState({
    assignTo: state?.discussion?.assignTo || "",
    dueDate: state?.discussion?.dueDate || "",
    section: state?.discussion?.sectionId || "",
    groupId: state?.discussion?.groupId || "",
    option: state?.discussion?.allowThreadedReplies
      ? "threadedReplies"
      : state?.discussion?.mustPostBeforeSeeingReplies
      ? "postBeforeReplies"
      : "",
    availableFrom: state?.discussion?.availableFrom || "",
    availableUntil: state?.discussion?.availableUntil || "",
  });

  const {
    createDiscussion,
    loading: createLoading,
    error: createError,
    success: createSuccess,
  } = useCreateDiscussion();
  const {
    updateDiscussion,
    loading: updateLoading,
    error: updateError,
    success: updateSuccess,
  } = useUpdateDiscussion();

  const isEditing = Boolean(state?.discussion?._id);

  const handleNameChange = (e) => {
    setAssignmentName(e.target.value);
  };

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const discussionData = {
      title: assignmentName,
      content: editorContent,
      pointsPossible: formState.pointsPossible || 0,
      graded: formState.graded || false,
      allowThreadedReplies: formState.option === "threadedReplies",
      mustPostBeforeSeeingReplies: formState.option === "postBeforeReplies",
      assignTo: formState.assignTo,
      sectionId: formState.assignTo === "Section" ? formState.section : null,
      groupId: formState.assignTo === "Group" ? formState.groupId : null,
      dueDate: formState.dueDate,
      availableFrom: formState.availableFrom,
      availableUntil: formState.availableUntil,
      attachment: file,
      classId: cid,
    };

    if (isEditing) {
      await updateDiscussion(state.discussion._id, discussionData);
    } else {
      await createDiscussion(discussionData);
    }

    if (createSuccess || updateSuccess) {
      navigate(/class/${cid}/${sid}/discussions);
    }
  };

  const loading = createLoading || updateLoading;
  const error = createError || updateError;

  return (
    <Layout
      title={
        isEditing
          ? "Update Discussion | Student Diwan"
          : "Add Discussion | Student Diwan"
      }
    >
      <div className="flex">
        <SideMenubar />
        <div className="w-full">
          <>
            <AddDiscussionHeader onSave={handleSave} isUpdating={isEditing} />
            <div className="flex w-full">
              <div className="w-[70%]">
                <div className="flex flex-col md:flex-row items-center gap-4 px-4 pt-3">
                  <TopicTitleInput
                    value={assignmentName}
                    onChange={handleNameChange}
                  />
                  <FileInput onChange={handleFileChange} file={file} />
                </div>

                <EditorComponent
                  hideInput={true}
                  assignmentLabel="Discussion Name"
                  editorContent={editorContent}
                  onNameChange={handleNameChange}
                  onEditorChange={handleEditorChange}
                />
              </div>
              <div className="w-[30%] border-l min-h-screen px-4 py-2">
                <CreateDiscussionForm
                  handleChange={handleFormChange}
                  {...formState}
                />
              </div>
            </div>
            {loading && <p role="status">Loading...</p>}
            {error && (
              <p role="alert" className="text-red-400 text-current my-4">
                {error}
              </p>
            )}
          </>
        </div>
      </div>
    </Layout>
  );
};

export default AddDiscussion;