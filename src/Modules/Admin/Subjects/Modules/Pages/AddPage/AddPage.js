import React, { useState, useEffect, useCallback } from "react";
import Layout from "../../../../../../Components/Common/Layout";
import SideMenubar from "../../../../../../Components/Admin/SideMenubar";
import AddPageHeader from "./AddPageHeader";
import EditorComponent from "../../../Component/AdminEditor";
import DateInput from "../../../Component/DateInput";
import { useDispatch, useSelector } from "react-redux";

import { useLocation, useParams } from "react-router-dom";
import {
  createPage,
  updatePage,
} from "../../../../../../Store/Slices/Admin/Class/Page/pageThunk";

const AddPage = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [editorContent, setEditorContent] = useState("");
  // const [editPermission, setEditPermission] = useState("Only Instructor");
  const [publishAt, setPublishDate] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [loadingType, setLoadingType] = useState(""); // Separate loading state for each button

  const isSidebarOpen = useSelector(
    (state) => state.common.user.sidebar.isOpen
  );
  const sidebarWidth = isSidebarOpen ? "15%" : "7%";
  const { cid } = useParams();
  const { loading, error } = useSelector((state) => state.admin.pages);

  useEffect(() => {
    if (state?.page) {
      setTitle(state.page.title || "");
      setEditorContent(state.page.content || "");
      // setEditPermission(state.page.editPermission || "Only Instructor");
      if (state.page.publishAt) {
        setPublishDate(
          new Date(state.page.publishAt).toISOString().substring(0, 10)
        );
      }
      setIsUpdating(true);
    }
  }, [state]);

  const handleNameChange = useCallback((name) => setTitle(name), []);
  const handleEditorChange = useCallback(
    (content) => setEditorContent(content),
    []
  );
  // const handleEditPermissionChange = useCallback(
  //   (e) => setEditPermission(e.target.value),
  //   []
  // );
  const handlePublishDateChange = useCallback(
    (e) => setPublishDate(e.target.value),
    []
  );

  const handleSave = useCallback(
    async (shouldPublish) => {
      const pageData = {
        title,
        content: editorContent,
        // editPermission,
        publishAt,
        publish: shouldPublish,
      };

      setLoadingType(shouldPublish ? "publish" : "save");

      try {
        if (isUpdating) {
          await dispatch(updatePage({ pageId: state?.page._id, pageData }));
        } else {
          await dispatch(createPage({ pageData, cid }));
        }
      } catch (error) {
        console.error("Error saving page:", error);
      } finally {
        setLoadingType("");
      }
    },
    [
      title,
      editorContent,
      // editPermission,
      publishAt,
      isUpdating,
      state,
      dispatch,
    ]
  );

  // Compute if publish date is set
  const isPublishDateSet = publishAt.trim() !== "";

  return (
    <Layout
      title={
        isUpdating ? "Update Page | Student Diwan" : "Add Page | Student Diwan"
      }
    >
      <div className="flex w-full min-h-screen">
        <SideMenubar />
        <div
          className={`ml-${sidebarWidth} transition-all duration-500 flex-1 h-full`}
          style={{ marginLeft: sidebarWidth }}
        >
          <AddPageHeader
            onSave={handleSave}
            isUpdating={isUpdating}
            loadingType={loadingType}
            isPublishDateSet={isPublishDateSet} // Passing the prop
          />
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
              {/* <div className="mb-4">
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
              </div> */}
              <DateInput
                label="Publish at"
                name="publishAt"
                value={publishAt}
                handleChange={handlePublishDateChange}
              />
            </div>
          </div>
          {loading && (
            <p className="text-center my-4 text-indigo-600">Saving...</p>
          )}
          {error && (
            <p role="alert" className="text-red-400 text-current my-4">
              {error}
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default React.memo(AddPage);
