import React, { useState } from "react";
import Layout from "../../../../../../Components/Common/Layout";
import SideMenubar from "../../../../../../Components/Admin/SideMenubar";
import AddDiscussionHeader from "./Components/AddDiscussionHeader";
import Editor from "../../../Component/Editor";
import CreateDiscussionForm from "./Components/CreateDiscussionForm";
import TopicTitleInput from "./Components/TopicTitleInput";
import FileInput from "./Components/FileInput";

const AddDiscussion = () => {
  const [assignmentName, setAssignmentName] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [file, setFile] = useState(null);
  const [formState, setFormState] = useState({
    assignTo: "",
    dueDate: "",
    section: "",
    option: "",
    availableFrom: "",
  });

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

  const handleSave = () => {
    console.log(formState, assignmentName, editorContent, file);
  };

  return (
    <Layout title="Add Discussion | Student Diwan">
      <div className="flex">
        <SideMenubar />
        <div className="w-full">
          <>
            <AddDiscussionHeader onSave={handleSave} />
            <div className="flex w-full">
              <div className="w-[70%]">
                <div className="flex flex-col md:flex-row items-center gap-4 px-4 pt-3">
                  <TopicTitleInput
                    value={assignmentName}
                    onChange={handleNameChange}
                  />
                  <FileInput onChange={handleFileChange} file={file} />
                </div>

                <Editor
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
          </>
        </div>
      </div>
    </Layout>
  );
};

export default AddDiscussion;
