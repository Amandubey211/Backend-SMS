import React, { useState } from "react";
import Layout from "../../../../../../Components/Common/Layout";
import SideMenubar from "../../../../../../Components/Admin/SideMenubar";
import CreateAnnouncementHeader from "./Components/CreateAnnouncementHeader";
import CreateAnnouncementForm from "./Components/CreateAnnouncementForm";
import TopicTitleInput from "../../Discussion/AddDiscussion/Components/TopicTitleInput";
import FileInput from "../../Discussion/AddDiscussion/Components/FileInput";
import EditorComponent from "../../../Component/AdminEditor";
import useCreateAnnouncement from "../../../../../../Hooks/AuthHooks/Staff/Admin/Announcement/useCreateAnnouncement";
import { useParams } from "react-router-dom";

const CreateAnnouncement = () => {
  const [assignmentName, setAssignmentName] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [file, setFile] = useState(null);
  const [formState, setFormState] = useState({
    assignTo: "",
    dueDate: "",
    section: "",
    option: "",
    author:"",
    availableFrom: "",
    groupId:""
    //allow comments option is not clear with backend 
  });

  const { createAnnouncement, loading, error } = useCreateAnnouncement();
  const { cid } = useParams();
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
      sectionId:formState.section,
      delayPosting:formState.dueDate,
      classId: cid,
      ...formState,
    };

    const files = {
      attachment: file,
    };

    const result = await createAnnouncement(announcementData, files);
    console.log(announcementData)
    if (result) {
      console.log("Announcement created successfully", result);
    }
  };

  return (
    <Layout title="Add Announcement | Student Diwan">
      <div className="flex">
        <SideMenubar />
        <div className="w-full">
          <>
            <CreateAnnouncementHeader onSave={handleSave} loading={loading} />
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
