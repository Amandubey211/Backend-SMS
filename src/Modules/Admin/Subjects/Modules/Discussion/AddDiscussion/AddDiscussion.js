import React, { useState, useCallback } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Layout from "../../../../../../Components/Common/Layout";
import SideMenubar from "../../../../../../Components/Admin/SideMenubar";
import AddDiscussionHeader from "./Components/AddDiscussionHeader";
import CreateDiscussionForm from "./Components/CreateDiscussionForm";
import TopicTitleInput from "./Components/TopicTitleInput";
import FileInput from "./Components/FileInput";
import EditorComponent from "../../../Component/AdminEditor";
import Spinner from "../../../../../../Components/Common/Spinner";
import {
  createDiscussion,
  updateDiscussion,
} from "../../../../../../Store/Slices/Admin/Class/Discussion/discussionThunks";
import toast from "react-hot-toast";

const AddDiscussion = () => {
  const { state } = useLocation();

  const { cid, sid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [assignmentName, setAssignmentName] = useState(
    state?.discussion?.title || ""
  );
  const [editorContent, setEditorContent] = useState(
    state?.discussion?.content || ""
  );
  const [file, setFile] = useState(null);
  const [formState, setFormState] = useState({
    assignTo: state?.discussion?.assignTo,
    dueDate: state?.discussion?.dueDate || "",
    sectionId: state?.discussion?.sectionId || "",
    groupId: state?.discussion?.groupId || "",
    option: state?.discussion?.allowThreadedReplies
      ? "threadedReplies"
      : state?.discussion?.mustPostBeforeSeeingReplies
      ? "postBeforeReplies"
      : "",
    availableFrom: state?.discussion?.availableFrom || "",
    availableUntil: state?.discussion?.availableUntil || "",
  });

  const isEditing = Boolean(state?.admin?.discussion?._id);
  const isLoading = useSelector((state) => state.admin.discussions.loading);
  const error = useSelector((state) => state.admin.discussions.error);

  const handleNameChange = useCallback(
    (e) => setAssignmentName(e.target.value),
    []
  );
  const handleEditorChange = useCallback(
    (content) => setEditorContent(content),
    []
  );
  const handleFileChange = useCallback((e) => setFile(e.target.files[0]), []);
  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSave = useCallback(
    async (publish) => {
      const discussionData = {
        title: assignmentName,
        content: editorContent,
        pointsPossible: formState.pointsPossible || 0,
        graded: formState.graded || false,
        allowThreadedReplies: formState.option === "threadedReplies",
        mustPostBeforeSeeingReplies: formState.option === "postBeforeReplies",
        assignTo: formState.assignTo,
        sectionId:
          formState.assignTo === "Section" ? formState.sectionId : null,
        groupId: formState.assignTo === "Group" ? formState.groupId : null,
        dueDate: formState.dueDate,
        availableFrom: formState.availableFrom,
        availableUntil: formState.availableUntil,
        attachment: file,
        classId: cid,
        publish,
      };
      if (!discussionData.assignTo) {
        toast.error("please assign the discussion");
        return;
      }
      if (isEditing) {
        dispatch(
          updateDiscussion({
            discussionId: state.discussion._id,
            discussionData,
          })
        )
          .unwrap()
          .then(() => navigate(`/class/${cid}/${sid}/discussions`));
      } else {
        dispatch(createDiscussion({ discussionData, cid }))
          .unwrap()
          .then(() => navigate(`/class/${cid}/${sid}/discussions`));
      }
    },
    [
      assignmentName,
      editorContent,
      formState,
      file,
      isEditing,
      dispatch,
      state,
      cid,
      sid,
      navigate,
    ]
  );

  const isSidebarOpen = useSelector(
    (state) => state.common.user.sidebar.isOpen
  );
  const sidebarWidth = isSidebarOpen ? "15%" : "7%";

  return (
    <Layout
      title={
        isEditing
          ? "Update Discussion | Student Diwan"
          : "Add Discussion | Student Diwan"
      }
    >
      <div className="flex w-full min-h-screen">
        <SideMenubar />
        <div
          className={`ml-${sidebarWidth} transition-all duration-500 flex-1 h-full`}
          style={{ marginLeft: sidebarWidth }}
        >
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
            {isLoading && <Spinner />}
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

export default React.memo(AddDiscussion);
