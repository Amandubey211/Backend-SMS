import React, { useState, useEffect, useCallback, useRef } from "react";
import Layout from "../../../../../../Components/Common/Layout";
import SideMenubar from "../../../../../../Components/Admin/SideMenubar";
import AddPageHeader from "./AddPageHeader";
import EditorComponent from "../../../Component/AdminEditor";
import DateInput from "../../../Component/DateInput";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  createPage,
  updatePage,
} from "../../../../../../Store/Slices/Admin/Class/Page/pageThunk";
import ProtectedSection from "../../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../../config/permission";

const AddPage = () => {
  const { t } = useTranslation("admAccounts");
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [publishAt, setPublishDate] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [loadingType, setLoadingType] = useState(""); // "save" or "publish"
  const [publishAtError, setPublishAtError] = useState("");
  const [titleError, setTitleError] = useState("");

  // Refs for validations
  const publishDateRef = useRef(null);
  const titleInputRef = useRef(null);

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
      if (state.page.publishAt) {
        setPublishDate(
          new Date(state.page.publishAt).toISOString().substring(0, 10)
        );
      }
      setIsUpdating(true);
    }
  }, [state]);

  const handleNameChange = useCallback((name) => {
    setTitle(name);
    if (name.trim()) {
      setTitleError("");
    }
  }, []);

  const handleEditorChange = useCallback(
    (content) => setEditorContent(content),
    []
  );

  const handlePublishDateChange = useCallback((e) => {
    setPublishDate(e.target.value);
    if (e.target.value.trim()) {
      setPublishAtError("");
    }
  }, []);

  const handleSave = useCallback(
    async (shouldPublish) => {
      // Validate title first
      if (!title.trim()) {
        setTitleError("Page title is required.");
        titleInputRef.current?.focus();
        return;
      }
      // When publishing, validate the publish date
      if (shouldPublish) {
        if (!publishAt.trim()) {
          setPublishAtError("Publish date is required to publish the page.");
          publishDateRef.current?.focus();
          return;
        }
        const today = new Date();
        const selectedDate = new Date(publishAt);
        const todayStart = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );
        if (selectedDate < todayStart) {
          setPublishAtError("Publish date must be today or a future date.");
          publishDateRef.current?.focus();
          return;
        }
      }

      const pageData = {
        title,
        content: editorContent,
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
        // After successful creation/update, navigate back
        navigate(-1);
      } catch (error) {
        console.error("Error saving page:", error);
      } finally {
        setLoadingType("");
      }
    },
    [
      title,
      editorContent,
      publishAt,
      isUpdating,
      state,
      dispatch,
      cid,
      navigate,
    ]
  );

  // Compute if publish date is set (used in header tooltip)
  const isPublishDateSet = publishAt.trim() !== "";

  return (
    <Layout
      title={
        isUpdating
          ? t("Update Page | Student Diwan")
          : t("Add Page | Student Diwan")
      }
    >
      <div className="flex w-full min-h-screen h-full">
        <SideMenubar />
        <div
          className={`ml-${sidebarWidth} transition-all min-h-screen duration-500 flex-1 h-full`}
          style={{ marginLeft: sidebarWidth }}
        >
          <AddPageHeader
            onSave={handleSave}
            isUpdating={isUpdating}
            loadingType={loadingType}
            isPublishDateSet={isPublishDateSet}
          />

          <ProtectedSection
            requiredPermission={
              PERMISSIONS.UPDATE_PAGE || PERMISSIONS.CREATE_PAGE
            }
            title={"Add/Edit Page"}
          >
            <div className="flex w-full h-full">
              <div className="w-[70%]">
                <EditorComponent
                  assignmentName={title}
                  assignmentLabel={t("Page Title")}
                  editorContent={editorContent}
                  onNameChange={handleNameChange}
                  onEditorChange={handleEditorChange}
                  error={titleError}
                  inputRef={titleInputRef}
                />
              </div>
              <div className="w-[30%] border-l min-h-screen px-4 py-2">
                <h2 className="text-lg font-semibold mb-4">{t("Option")}</h2>
                <DateInput
                  label={t("Publish at")}
                  name="publishAt"
                  value={publishAt}
                  handleChange={handlePublishDateChange}
                  error={publishAtError}
                  ref={publishDateRef}
                />
              </div>
            </div>
          </ProtectedSection>

          {loading && (
            <p className="text-center my-4 text-indigo-600">{t("Saving...")}</p>
          )}
          {error && (
            <p role="alert" className="text-red-400 text-current my-4">
              {t("Error: ")}
              {error}
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default React.memo(AddPage);
