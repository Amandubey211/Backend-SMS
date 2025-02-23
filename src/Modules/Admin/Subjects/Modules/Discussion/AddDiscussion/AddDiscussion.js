import React, { useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import ProtectedSection from "../../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../../config/permission";

const AddDiscussion = () => {
  const { cid, sid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch discussion from Redux state
  const currentDiscussion = useSelector(
    (state) => state.admin.discussions.discussion
  );
  const isLoading = useSelector((state) => state.admin.discussions.loading);

  // Determine if editing or creating
  const isEditing = Boolean(currentDiscussion?._id);

  // Component State
  const [assignmentName, setAssignmentName] = useState(
    currentDiscussion?.title || ""
  );
  const [editorContent, setEditorContent] = useState(
    currentDiscussion?.content || ""
  );
  const [file, setFile] = useState(null);
  const [formState, setFormState] = useState({
    assignTo: currentDiscussion?.assignTo || "",
    dueDate: currentDiscussion?.dueDate || "",
    sectionId: currentDiscussion?.sectionId || "",
    groupId: currentDiscussion?.groupId || "",
    option: currentDiscussion?.allowThreadedReplies
      ? "threadedReplies"
      : currentDiscussion?.mustPostBeforeSeeingReplies
      ? "postBeforeReplies"
      : "",
    availableFrom: currentDiscussion?.availableFrom || "",
    availableUntil: currentDiscussion?.availableUntil || "",
  });

  // Error states for inline validations
  const [titleError, setTitleError] = useState("");
  const [assignError, setAssignError] = useState("");

  // Refs for input elements
  const titleInputRef = useRef(null);

  // Event Handlers
  const handleNameChange = useCallback((e) => {
    setAssignmentName(e.target.value);
    if (e.target.value.trim()) {
      setTitleError("");
    }
  }, []);

  const handleEditorChange = useCallback(
    (content) => setEditorContent(content),
    []
  );

  const handleFileChange = useCallback((e) => {
    setFile(e.target.files[0]);
  }, []);

  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    if (name === "assignTo" && value) {
      setAssignError("");
    }
  }, []);

  const handleClearFile = useCallback(() => {
    setFile(null);
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
        subjectId: sid,
        publish,
      };

      // Validate required fields and set error messages
      let hasError = false;
      if (!discussionData.assignTo) {
        setAssignError("Please assign the discussion");
        hasError = true;
      } else {
        setAssignError("");
      }
      if (!discussionData.title.trim()) {
        setTitleError("Please provide a title for the discussion");
        titleInputRef.current?.focus();
        hasError = true;
      } else {
        setTitleError("");
      }

      if (hasError) {
        return;
      }

      try {
        if (isEditing) {
          await dispatch(
            updateDiscussion({
              discussionId: currentDiscussion._id,
              discussionData,
            })
          ).unwrap();
          navigate(`/class/${cid}/${sid}/discussions`);
        } else {
          await dispatch(createDiscussion({ discussionData, cid })).unwrap();
          navigate(`/class/${cid}/${sid}/discussions`);
        }
      } catch (err) {
        // Handle backend errors appropriately
      }
    },
    [
      assignmentName,
      editorContent,
      formState,
      file,
      isEditing,
      dispatch,
      currentDiscussion,
      cid,
      sid,
      navigate,
    ]
  );

  // Sidebar logic
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
          className={`ml-${sidebarWidth} transition-all duration-500 flex-1 h-full w-full`}
          style={{ marginLeft: sidebarWidth }}
        >
          <>
            <AddDiscussionHeader onSave={handleSave} isUpdating={isEditing} />
            <div className="w-full h-full">
              <ProtectedSection
                requiredPermission={PERMISSIONS.UPDATE_DISCUSSION}
                title="Update discussion"
              >
                <div className="flex w-full h-full">
                  <div className="w-[70%]">
                    <div className="flex flex-col md:flex-row items-center gap-4 px-4 pt-3">
                      <TopicTitleInput
                        value={assignmentName}
                        onChange={handleNameChange}
                        error={titleError}
                        inputRef={titleInputRef}
                      />
                      <FileInput
                        onChange={handleFileChange}
                        file={file}
                        onClear={handleClearFile}
                      />
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
                      assignError={assignError}
                    />
                  </div>
                </div>
              </ProtectedSection>
            </div>
          </>
        </div>
      </div>
      {isLoading && <Spinner />}
    </Layout>
  );
};

export default React.memo(AddDiscussion);
