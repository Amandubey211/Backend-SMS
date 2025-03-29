import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import CreateSyllabusHeader from "./Components/CreateSyllabusHeader";
import SideMenubar from "../../../../../../Components/Admin/SideMenubar";
import EditorComponent from "../../../Component/AdminEditor";
import { useDispatch, useSelector } from "react-redux";
import {
  createSyllabus,
  editSyllabus,
} from "../../../../../../Store/Slices/Admin/Class/Syllabus/syllabusThunk";
import Spinner from "../../../../../../Components/Common/Spinner";
import ProtectedSection from "../../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../../config/permission";
import AudienceSelector from "../../../Component/AudienceSelector";

const MainSection = ({ setIsEditing }) => {
  const { state } = useLocation();
  const { cid, sid } = useParams();
  const navigate = useNavigate();
  console.log(state, "state");

  // Preload title and content if editing
  const [assignmentName, setAssignmentName] = useState(
    state?.syllabus?.title || ""
  );
  const [editorContent, setEditorContent] = useState(
    state?.syllabus?.content || ""
  );

  // New state for audience selection (holds groupIds and sectionIds)
  const [audience, setAudience] = useState({
    groupIds: [],
    sectionIds: [],
  });

  const dispatch = useDispatch();
  const loading = useSelector((state) => state.admin.syllabus.loading);

  useEffect(() => {
    setIsEditing(Boolean(state?.syllabus?._id));
    // Preload audience if editing an existing syllabus
    if (state?.syllabus) {
      setAudience({
        groupIds: state.syllabus.groupIds || [],
        sectionIds: state.syllabus.sectionIds || [],
      });
    }
  }, [state, setIsEditing]);

  const handleNameChange = useCallback((name) => {
    setAssignmentName(name);
  }, []);

  const handleEditorChange = useCallback((content) => {
    setEditorContent(content);
  }, []);

  const handleSave = useCallback(async () => {
    // Construct payload including audience selections
    const data = {
      title: assignmentName,
      content: editorContent,
      subjectId: sid,
      groupIds: audience.groupIds,
      sectionIds: audience.sectionIds,
    };

    if (state?.syllabus?._id) {
      // Edit operation (no redirection)
      await dispatch(
        editSyllabus({ syllabusId: state.syllabus._id, data, cid })
      );
    } else {
      // Create operation: pass navigate so the thunk can redirect on success
      await dispatch(createSyllabus({ ...data, navigate }));
    }
  }, [
    assignmentName,
    editorContent,
    sid,
    state,
    dispatch,
    cid,
    navigate,
    audience,
  ]);

  const isSidebarOpen = useSelector(
    (state) => state.common.user.sidebar.isOpen
  );
  const sidebarWidth = isSidebarOpen ? "15%" : "7%";

  return (
    <div className="flex w-full min-h-screen">
      <SideMenubar />
      <div
        className={`ml-${sidebarWidth} transition-all duration-500 flex-1 h-full`}
        style={{ marginLeft: sidebarWidth }}
      >
        <CreateSyllabusHeader
          onSave={handleSave}
          loading={loading}
          isEditing={Boolean(state?.syllabus?._id)}
        />
        <ProtectedSection
          requiredPermission={
            PERMISSIONS.EDIT_SYLLABUS || PERMISSIONS.CREATE_SYLLABUS
          }
          title="Create/Update Syllabus"
        >
          <div className="flex">
            {/* Left Side: Editor (70%) */}
            <div className="w-[70%]">
              <EditorComponent
                inputPlaceHolder="Syllabus Heading"
                assignmentLabel="Page Title"
                assignmentName={assignmentName}
                editorContent={editorContent}
                onNameChange={handleNameChange}
                onEditorChange={handleEditorChange}
              />
            </div>
            {/* Right Side: AudienceSelector (30%) */}
            <div className="w-[30%] pl-4">
              <AudienceSelector value={audience} onChange={setAudience} />
            </div>
          </div>
          {loading && <Spinner />}
        </ProtectedSection>
      </div>
    </div>
  );
};

export default React.memo(MainSection);
