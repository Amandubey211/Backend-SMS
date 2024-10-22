import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useParams } from "react-router-dom";
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

const CreateAnnouncement = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { announcement } = location.state || {};
  const [assignmentName, setAssignmentName] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [file, setFile] = useState(null);
  const [formState, setFormState] = useState({
    postTo: "",
    availableFrom: "",
    sectionId: "",
    option: "",
    author: "",
    groupId: "",
  });

  const { cid } = useParams();
  const isSidebarOpen = useSelector(
    (state) => state.common.user.sidebar.isOpen
  );
  const sidebarWidth = isSidebarOpen ? "15%" : "7%";

  useEffect(() => {
    if (announcement) {
      setAssignmentName(announcement.title || "");
      setEditorContent(announcement.content || "");
      setFormState({
        postTo: announcement.postTo || "",
        availableFrom: announcement.delayPosting
          ? new Date(announcement.delayPosting).toISOString().split("T")[0]
          : "",
        sectionId: announcement.sectionId || "",
        option: "",
        author: announcement.author || "",
        groupId: announcement.groupId || "",
      });
    }
  }, [announcement]);

  const handleNameChange = useCallback((e) => {
    setAssignmentName(e.target.value);
  }, []);

  const handleEditorChange = useCallback((content) => {
    setEditorContent(content);
  }, []);

  const handleFileChange = useCallback((e) => {
    setFile(e.target.files[0]);
  }, []);

  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSave = useCallback(async () => {
    const announcementData = {
      title: assignmentName,
      content: editorContent,
      sectionId: formState.sectionId,
      delayPosting: formState.availableFrom,
      classId: cid,
      ...formState,
    };

    const files = {
      attachment: file,
    };

    if (announcement?._id) {
      // Edit announcement
      dispatch(
        editAnnouncement({
          id: announcement._id,
          data: announcementData,
          files,
        })
      );
    } else {
      // Create announcement
      dispatch(createAnnouncement({ data: announcementData, files }));
    }
  }, [
    assignmentName,
    editorContent,
    formState,
    file,
    cid,
    announcement,
    dispatch,
  ]);

  const loading = useSelector((state) => state.admin.announcements.loading);
  const isEditing = !!announcement?._id;

  return (
    <Layout
      title={`${isEditing ? "Update" : "Create"} Announcement | Student Diwan`}
    >
      <div className="flex w-full min-h-screen">
        <SideMenubar />
        <div
          className={`ml-${sidebarWidth} transition-all duration-500 flex-1 h-full`}
          style={{
            marginLeft: sidebarWidth,
          }}
        >
          <CreateAnnouncementHeader
            onSave={handleSave}
            loading={loading}
            isEditing={isEditing}
          />
          <div className="flex w-full">
            <div className="w-[75%]">
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
            <div className="w-[25%] border-l min-h-screen px-4 py-2">
              <CreateAnnouncementForm
                handleChange={handleFormChange}
                {...formState}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default React.memo(CreateAnnouncement);
