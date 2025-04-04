import React, { useEffect } from "react";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import { RiAddFill } from "react-icons/ri";
import { AiOutlineFileAdd } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import SyllabusHeader from "./Components/SyllabusHeader";
import SyllabusSection from "./Components/SyllabusSection";
import {
  fetchSyllabus,
  deleteSyllabus,
} from "../../../../../../Store/Slices/Admin/Class/Syllabus/syllabusThunk";
import Spinner from "../../../../../../Components/Common/Spinner";
import NoDataFound from "../../../../../../Components/Common/NoDataFound";
import ProtectedSection from "../../../../../../Routes/ProtectedRoutes/ProtectedSection";
import ProtectedAction from "../../../../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../../../../config/permission";

const MainSection = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation("admModule");
  const { cid, sid } = useParams();
  const navigate = useNavigate();

  const { syllabi, loading, error, selectedSyllabus } = useSelector(
    (state) => state.admin.syllabus
  );

  useEffect(() => {
    dispatch(fetchSyllabus({ subjectId: sid, classId: cid }));
  }, [dispatch, sid, cid]);

  const handleEditClick = (syllabus) => {
    navigate(`/class/${cid}/${sid}/syllabus/create_syllabus`, {
      state: { syllabus },
    });
  };

  const handleDeleteClick = async (syllabusId) => {
    await dispatch(deleteSyllabus(syllabusId));
    navigate(-1);
    dispatch(fetchSyllabus({ subjectId: sid, classId: cid }));
  };

  const renderContent = () => {
    if (syllabi && syllabi.length > 0) {
      return (
        <>
          <SyllabusHeader
            onEditClick={() => handleEditClick(selectedSyllabus)}
            onDeleteClick={() => handleDeleteClick(selectedSyllabus._id)}
            syllabus={selectedSyllabus}
          />
          <SyllabusSection
            syllabus={selectedSyllabus}
            title={selectedSyllabus?.title}
            content={selectedSyllabus?.content}
          />
        </>
      );
    }

    // Centering no-data state within the right section
    return (
      <div className="h-full w-full flex items-center justify-center">
        <NoDataFound
          title={t("Syllabus")}
          desc={t(
            "Your syllabus section is waiting to be filled. Get started by clicking 'Add New Syllabus'."
          )}
          icon={AiOutlineFileAdd}
          iconColor="text-gray-500"
          textColor="text-gray-500"
          bgColor="bg-white"
        />
      </div>
    );
  };

  return (
    <div className="flex h-full w-full">
      <SubjectSideBar />
      <ProtectedSection
        title="Syllabus"
        requiredPermission={PERMISSIONS.VIEW_SYLLABUS}
      >
        {/* Updated container: flex layout ensures content is centered when needed */}
        <div className="border-l w-full py-1 px-4 relative flex flex-col h-full">
          {renderContent()}
        </div>
      </ProtectedSection>
    </div>
  );
};

export default MainSection;
