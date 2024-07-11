import React, { useState, useEffect } from "react";
import Layout from "../../../../../../Components/Common/Layout";
import SideMenubar from "../../../../../../Components/Admin/SideMenubar";
import AddPageHeader from "./AddPageHeader";
import EditorComponent from "../../../Component/AdminEditor";
import DateInput from "../../../Component/DateInput";
import useCreatePage from "../../../../../../Hooks/AuthHooks/Staff/Admin/Page/useCreatePage";
import useUpdatePage from "../../../../../../Hooks/AuthHooks/Staff/Admin/Page/useUpdatePage";
import { useLocation, useParams } from "react-router-dom";

const AddPage = () => {
  const { state } = useLocation();
  const [title, setTitle] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [editPermission, setEditPermission] = useState("Only Instructor");
  const [publishDate, setPublishDate] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [publish, setPublish] = useState(false);

  const { pageId } = useParams();
  const { loading: createLoading, error: createError, success: createSuccess, createPage } = useCreatePage();
  const { loading: updateLoading, error: updateError, success: updateSuccess, updatePage } = useUpdatePage();

  useEffect(() => {
    if (state?.page) {
      setTitle(state.page.title);
      setEditorContent(state.page.content);
      setEditPermission(state.page.editPermission || "Only Instructor");
      setPublish(state.page.publish || false);
      if (state.page.publishDate) {
        setPublishDate(new Date(state.page.publishDate).toISOString().substring(0, 10));
      }
      setIsUpdating(true);
    }
  }, [state]);

  const handleNameChange = (name) => {
    setTitle(name);
  };

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  const handleEditPermissionChange = (e) => {
    setEditPermission(e.target.value);
  };

  const handlePublishDateChange = (e) => {
    setPublishDate(e.target.value);
  };

  const handlePublishChange = (e) => {
    setPublish(e.target.checked);
  };

  const handleSave = async () => {
    const pageData = {
      title,
      content: editorContent,
      editPermission,
      publishDate,
      publish,
    };

    if (isUpdating) {
      await updatePage(pageId, pageData);
    } else {
      await createPage(pageData);
    }

    if (createSuccess || updateSuccess) {
      setTitle("");
      setEditorContent("");
      setEditPermission("Only Instructor");
      setPublishDate("");
      setPublish(false);
    }
  };

  return (
    <Layout title={isUpdating ? "Update Page | Student Diwan" : "Add Page | Student Diwan"}>
      <div className="flex">
        <SideMenubar />
        <div className="w-full">
          <AddPageHeader onSave={handleSave} isUpdating={isUpdating} loading={createLoading || updateLoading} />
          <div className="flex w-full">
            <div className="w-[70%]">
              <EditorComponent
                assignmentName={title}
                assignmentLabel="Page Title"
                editorContent={editorContent}
                onNameChange={handleNameChange}
                onEditorChange={handleEditorChange}
              />
            </div>
            <div className="w-[30%] border-l min-h-screen px-4 py-2">
              <h2 className="text-lg font-semibold mb-4">Option</h2>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="editPermission">
                  Users allowed to edit this page
                </label>
                <select
                  id="editPermission"
                  value={editPermission}
                  onChange={handleEditPermissionChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option>Only Instructor</option>
                  <option>All Students</option>
                  <option>Instructor and TA</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="publish">
                  Publish
                </label>
                <input
                  id="publish"
                  type="checkbox"
                  checked={publish}
                  onChange={handlePublishChange}
                  className="mt-1 block"
                />
              </div>
              <DateInput
                label="Publish at"
                name="publishDate"
                value={publishDate}
                handleChange={handlePublishDateChange}
              />
            </div>
          </div>
          {(createError || updateError) && (
            <p role="alert" className="text-red-400 text-current my-4">
              {createError || updateError}
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AddPage;
