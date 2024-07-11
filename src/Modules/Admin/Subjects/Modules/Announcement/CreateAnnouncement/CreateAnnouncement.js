import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import Layout from "../../../../../../Components/Common/Layout";
import SideMenubar from "../../../../../../Components/Admin/SideMenubar";
import CreateAnnouncementHeader from "./Components/CreateAnnouncementHeader";
import CreateAnnouncementForm from "./Components/CreateAnnouncementForm";
import TopicTitleInput from "../../Discussion/AddDiscussion/Components/TopicTitleInput";
import FileInput from "../../Discussion/AddDiscussion/Components/FileInput";
import EditorComponent from "../../../Component/AdminEditor";
import useCreateAnnouncement from "../../../../../../Hooks/AuthHooks/Staff/Admin/Announcement/useCreateAnnouncement";
import useEditAnnouncement from "../../../../../../Hooks/AuthHooks/Staff/Admin/Announcement/useEditAnnouncement";

const CreateAnnouncement = () => {
  const location = useLocation();
  const { announcement } = location.state || {};
  const [assignmentName, setAssignmentName] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [file, setFile] = useState(null);
  const [formState, setFormState] = useState({
    postTo: "",
    availableFrom: "",
    section: "",
    option: "",
    author: "",
    groupId: ""
  });

  const { createAnnouncement, loading: createLoading, error: createError } = useCreateAnnouncement();
  const { editAnnouncement, loading: editLoading, error: editError } = useEditAnnouncement();
  const { cid } = useParams();

  useEffect(() => {
    if (announcement) {
      setAssignmentName(announcement.title || "");
      setEditorContent(announcement.content || "");
      setFormState({
        postTo: announcement.postTo || "",
        availableFrom: announcement.delayPosting ? new Date(announcement.delayPosting).toISOString().split("T")[0] : "",
        section: announcement.sectionId || "",
        option: "",
        author: announcement.author || "",
        groupId: announcement.groupId || ""
      });
    }
  }, [announcement]);

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
    const announcementData = {
      title: assignmentName,
      content: editorContent,
      sectionId: formState.section,
      delayPosting: formState.availableFrom,
      classId: cid,
      ...formState,
    };

    const files = {
      attachment: file,
    };

    if (announcement?._id) {
      // Edit announcement
      const result = await editAnnouncement(announcement._id, announcementData, files);
      if (result) {
        console.log("Announcement updated successfully", result);
      }
    } else {
      // Create announcement
      const result = await createAnnouncement(announcementData, files);
      if (result) {
        console.log("Announcement created successfully", result);
      }
    }
  };

  const loading = createLoading || editLoading;
  const error = createError || editError;
  const isEditing = !!announcement?._id;

  return (
    <Layout title={`${isEditing ? "Update" : "Create"} Announcement | Student Diwan`}>
      <div className="flex">
        <SideMenubar />
        <div className="w-full">
          <>
            <CreateAnnouncementHeader onSave={handleSave} loading={loading} isEditing={isEditing} />
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
          </>
        </div>
      </div>
    </Layout>
  );
};

export default CreateAnnouncement;
