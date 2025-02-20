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

  const { syllabi, loading, error } = useSelector(
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
    dispatch(fetchSyllabus({ subjectId: sid, classId: cid }));
  };

  const renderContent = () => {
    if (loading) {
      return <Spinner />;
    }

    if (error) {
      return <div className="mt-10"><NoDataFound title={t("Syllabus")}  /></div>;
    }

    if (syllabi && syllabi?.length > 0) {
      return (
        <>
          <SyllabusHeader
            onEditClick={() => handleEditClick(syllabi[0])}
            onDeleteClick={() => handleDeleteClick(syllabi[0]._id)}
            syllabus={syllabi[0]}
          />
          <SyllabusSection
            title={syllabi[0]?.title}
            content={syllabi[0]?.content}
          />
        </>
      );
    }

    return (
      <div className="h-full w-full flex items-center justify-center">
        <NoDataFound
          title={t("Syllabus")}
          desc={t(
            "Your syllabus section is waiting to be filled. Get started by clicking 'Add New Syllabus .'"
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
        <div className="border-l w-full p-4 relative">
          {renderContent()}
          {syllabi && syllabi?.length === 0 && (
            <ProtectedAction requiredPermission={PERMISSIONS.CREATE_SYLLABUS}>
              <NavLink
                to={`/class/${cid}/${sid}/syllabus/create_syllabus`}
                className="bg-gradient-to-r from-purple-400 to-pink-400 text-white p-4 fixed rounded-full shadow-md bottom-4 right-4"
              >
                <RiAddFill size={24} />
              </NavLink>
            </ProtectedAction>
          )}
        </div>
      </ProtectedSection>
    </div>
  );
};

export default MainSection;
