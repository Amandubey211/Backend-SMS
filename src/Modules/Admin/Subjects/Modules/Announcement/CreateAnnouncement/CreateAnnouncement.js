import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../../../../../Components/Common/Layout";
import SideMenubar from "../../../../../../Components/Admin/SideMenubar";
import CreateAnnouncementHeader from "./Components/CreateAnnouncementHeader";
import CreateAnnouncementForm from "./Components/CreateAnnouncementForm";
import TopicTitleInput from "../../Discussion/AddDiscussion/Components/TopicTitleInput";
import FileInput from "../../Discussion/AddDiscussion/Components/FileInput";
import EditorComponent from "../../../Component/AdminEditor";
import {
  createAnnouncement,
  editAnnouncement,
} from "../../../../../../Store/Slices/Admin/Class/Announcement/announcementThunk";
import toast from "react-hot-toast";
import ProtectedSection from "../../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../../config/permission";

const CreateAnnouncement = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { announcement } = location.state || {};

  // Basic fields
  const [assignmentName, setAssignmentName] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [file, setFile] = useState(null);


  // Keep sectionId/groupId as arrays in state
  const [formState, setFormState] = useState({
    postTo: "",
    availableFrom: "",
    sectionId: [], // array
    groupId: [], // array
    author: "",
  });

  // Validation errors
  const [formErrors, setFormErrors] = useState({});

  // Refs for focusing invalid inputs
  const titleRef = useRef(null);
  const authorRef = useRef(null);

  const { cid, sid } = useParams();
  const isSidebarOpen = useSelector(
    (state) => state.common.user.sidebar.isOpen
  );
  const sidebarWidth = isSidebarOpen ? "15%" : "7%";
  const navigate = useNavigate();
  // Preload announcement data if editing
  useEffect(() => {
    if (announcement) {
      setAssignmentName(announcement.title || "");
      setEditorContent(announcement.content || "");
      setFormState({
        postTo: announcement.postTo || "",
        availableFrom: announcement.delayPosting
          ? new Date(announcement.delayPosting).toISOString().split("T")[0]
          : "",
        sectionId: Array.isArray(announcement.sectionId)
          ? announcement.sectionId
          : [],
        groupId: Array.isArray(announcement.groupId)
          ? announcement.groupId
          : [],
        author: announcement.author || "",
      });
    }
  }, [announcement]);

  // Handlers for text fields
  const handleNameChange = useCallback((e) => {
    setAssignmentName(e.target.value);
    setFormErrors((prev) => ({ ...prev, assignmentName: undefined }));
  }, []);

  const handleEditorChange = useCallback((content) => {
    setEditorContent(content);
  }, []);


  const handleFileChange = useCallback((e) => {
    setFile(e.target.files[0]);
  }, []);

  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);


  /**
   * Validate fields & build a payload object.
   * For postTo=Section or Group, directly assign the arrays so the backend receives them correctly.
   */
  const handleSave = useCallback(() => {
    const errors = {};
    let firstInvalidRef = null;

    // Basic required fields
    if (!assignmentName.trim()) {
      errors.assignmentName = "Title is required";
      firstInvalidRef = titleRef;
    }
    if (!formState.author.trim()) {
      errors.author = "Author is required";
      if (!firstInvalidRef) firstInvalidRef = authorRef;
    }
    // Validate selection for Section and Group
    if (formState.postTo === "Section" && formState.sectionId.length === 0) {
      errors.sectionId = "Please select at least one Section";
    }
    if (formState.postTo === "Group" && formState.groupId.length === 0) {
      errors.groupId = "Please select at least one Group";
    }
    if (!formState.postTo) {
      errors.postTo = "Please select an option for 'Post To'.";
    }


    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the highlighted fields.");
      firstInvalidRef?.current?.focus();
      return;
    }

    // Build the payload object
    const payload = {
      title: assignmentName,
      content: editorContent,
      postTo: formState.postTo,
      delayPosting: formState.availableFrom,
      classId: cid,
      subjectId: sid,
      author: formState.author,
    };

    // For Section/Group, assign arrays directly
    if (formState.postTo === "Section") {
      payload.sectionId = formState.sectionId;
    }
    if (formState.postTo === "Group") {
      payload.groupId = formState.groupId;
    }

    const files = file ? { attachment: file } : {};

    if (announcement?._id) {
      dispatch(
        editAnnouncement({
          id: announcement._id,
          data: payload,
          files,
          navigate,
        })
      );
    } else {
      dispatch(createAnnouncement({ data: payload, files, navigate }));
    }
  }, [
    assignmentName,
    formState,
    editorContent,
    file,
    cid,
    sid,
    announcement,
    dispatch,
  ]);

  const loading = useSelector((state) => state.admin.announcements.loading);
  const isEditing = !!announcement?._id;

  return (
    <Layout
      title={`${isEditing ? "Update" : "Create"} Announcement | Student Diwan`}
    >
      <div className="flex w-full min-h-screen h-full">
        <SideMenubar />
        <div
          className={`ml-${sidebarWidth} transition-all duration-500 flex-1 h-full`}
          style={{ marginLeft: sidebarWidth }}
        >
          <CreateAnnouncementHeader
            onSave={handleSave}
            loading={loading}
            isEditing={isEditing}
          />
          <ProtectedSection
            requiredPermission={
              PERMISSIONS.ADD_NEW_ANNOUNCEMENT || PERMISSIONS.EDIT_ANNOUNCEMENT
            }
            title=""
          >
            <div className="flex w-full">
              {/* Left side: Title + Editor */}
              <div className="w-[75%]">
                <div className="flex flex-col md:flex-row items-center gap-4 px-4 pt-3">
                  <TopicTitleInput
                    value={assignmentName}
                    onChange={handleNameChange}
                    inputRef={titleRef}
                    error={formErrors.assignmentName}
                  />
                  <FileInput onChange={handleFileChange} file={file} />
                </div>
                <EditorComponent
                  hideInput={true}
                  assignmentLabel="Announcement Name"
                  editorContent={editorContent}
                  onNameChange={handleNameChange}
                  onEditorChange={handleEditorChange}
                />
              </div>

              {/* Right side: Additional Form Fields */}
              <div className="w-[25%] border-l min-h-screen px-4 py-2">
                <CreateAnnouncementForm
                  handleChange={handleFormChange}
                  formErrors={formErrors}
                  authorRef={authorRef}
                  {...formState}
                />
              </div>
            </div>
          </ProtectedSection>
        </div>
      </div>
    </Layout>
  );
};

export default React.memo(CreateAnnouncement);
