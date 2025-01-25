import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useParams } from "react-router-dom";
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

const MainSection = ({ setIsEditing }) => {
  const { state } = useLocation();
  const { cid, sid } = useParams();
  const [assignmentName, setAssignmentName] = useState(
    state?.syllabus?.title || ""
  );
  const [editorContent, setEditorContent] = useState(
    state?.syllabus?.content || ""
  );
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.admin.syllabus.loading);

  useEffect(() => {
    setIsEditing(Boolean(state?.syllabus?._id));
  }, [state, setIsEditing]);

  const handleNameChange = useCallback((name) => {
    setAssignmentName(name);
  }, []);

  const handleEditorChange = useCallback((content) => {
    setEditorContent(content);
  }, []);

  const handleSave = useCallback(async () => {
    const data = {
      title: assignmentName,
      content: editorContent,
      subjectId: sid,
    };

    if (state?.syllabus?._id) {
      await dispatch(
        editSyllabus({ syllabusId: state.syllabus._id, data, cid })
      );
    } else {
      await dispatch(createSyllabus(data));
    }
  }, [assignmentName, editorContent, sid, state, dispatch]);

  const isSidebarOpen = useSelector(
    (state) => state.common.user.sidebar.isOpen
  );
  const sidebarWidth = isSidebarOpen ? "15%" : "7%";

  return (
    <div className="flex w-full min-h-screen">
      <SideMenubar />
      <div
        className={`ml-${sidebarWidth} transition-all duration-500 flex-1 h-full`}
        style={{
          marginLeft: sidebarWidth,
        }}
      >
        <CreateSyllabusHeader
          onSave={handleSave}
          loading={loading}
          isEditing={Boolean(state?.syllabus?._id)}
        />
        <ProtectedSection
          requiredPermission="add/edit Syllabus"
          title="Create/Update Syllabus"
        >
          <EditorComponent
            inputPlaceHolder="Syllabus Heading"
            assignmentLabel="Page Title"
            assignmentName={assignmentName}
            editorContent={editorContent}
            onNameChange={handleNameChange}
            onEditorChange={handleEditorChange}
          />
          {loading && <Spinner />}
        </ProtectedSection>
      </div>
    </div>
  );
};

export default React.memo(MainSection);
