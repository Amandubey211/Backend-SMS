import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CreateSyllabusHeader from "./Components/CreateSyllabusHeader";
import SideMenubar from "../../../../../../Components/Admin/SideMenubar";
import EditorComponent from "../../../Component/AdminEditor";
import { useDispatch, useSelector } from "react-redux";
import {
  createSyllabus,
  editSyllabus,
} from "../../../../../../Store/Slices/Admin/Class/Syllabus/syllabusThunk";
import ProtectedSection from "../../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../../config/permission";
import AudienceSelector from "../../../Component/AudienceSelector";

const MainSection = ({ setIsEditing }) => {
  const { cid, sid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get selected syllabus and available sections/groups from Redux store
  const { selectedSyllabus, loading } = useSelector(
    (state) => state.admin.syllabus
  );
  const sectionsList = useSelector(
    (state) => state.admin.group_section.sectionsList
  );
  const groupsList = useSelector(
    (state) => state.admin.group_section.groupsList
  );

  // Initialize form state
  const [assignmentName, setAssignmentName] = useState(
    selectedSyllabus?.title || ""
  );
  const [editorContent, setEditorContent] = useState(
    selectedSyllabus?.content || ""
  );
  const [audience, setAudience] = useState({
    groupIds: selectedSyllabus?.groupIds?.map((g) => g._id) || [],
    sectionIds: selectedSyllabus?.sectionIds?.map((s) => s._id) || [],
  });

  // Update isEditing based on whether we have a selected syllabus
  useEffect(() => {
    setIsEditing(Boolean(selectedSyllabus?._id));
  }, [selectedSyllabus, setIsEditing]);

  // Refresh form values when selectedSyllabus changes
  useEffect(() => {
    if (selectedSyllabus) {
      setAssignmentName(selectedSyllabus.title || "");
      setEditorContent(selectedSyllabus.content || "");
      setAudience({
        groupIds: selectedSyllabus.groupIds?.map((g) => g._id) || [],
        sectionIds: selectedSyllabus.sectionIds?.map((s) => s._id) || [],
      });
    } else {
      // Reset form for new syllabus
      setAssignmentName("");
      setEditorContent("");
      setAudience({ groupIds: [], sectionIds: [] });
    }
  }, [selectedSyllabus]);

  const handleNameChange = useCallback((name) => {
    setAssignmentName(name);
  }, []);

  const handleEditorChange = useCallback((content) => {
    setEditorContent(content);
  }, []);

  const handleSave = useCallback(async () => {
    if (!assignmentName.trim()) {
      alert("Please enter a syllabus title");
      return;
    }

    // Construct payload including audience selections
    const data = {
      title: assignmentName.trim(),
      content: editorContent,
      subjectId: sid,
      groupIds: audience.groupIds,
      sectionIds: audience.sectionIds,
    };

    if (selectedSyllabus?._id) {
      // Edit operation
      await dispatch(
        editSyllabus({
          syllabusId: selectedSyllabus._id,
          data,
          cid,
          navigate,
        })
      );
    } else {
      // Create operation
      await dispatch(createSyllabus({ ...data, navigate }));
    }
  }, [
    assignmentName,
    editorContent,
    sid,
    selectedSyllabus,
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
          loading={loading.create || loading.update}
          isEditing={Boolean(selectedSyllabus?._id)}
        />
        <ProtectedSection
          requiredPermission={
            PERMISSIONS.EDIT_SYLLABUS || PERMISSIONS.CREATE_SYLLABUS
          }
          title="Create/Update Syllabus"
        >
          <div className="flex">
            {/* Left Side: Editor (70%) */}
            <div className="w-[70%] border-r">
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
            <div className="w-[30%] px-3">
              <AudienceSelector
                value={audience}
                onChange={setAudience}
                sections={sectionsList}
                groups={groupsList}
              />
            </div>
          </div>
        </ProtectedSection>
      </div>
    </div>
  );
};

export default React.memo(MainSection);
