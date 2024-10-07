import React, { useEffect } from "react";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import { AiOutlineFileAdd } from "react-icons/ai";
import { RiAddFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import SyllabusHeader from "./Components/SyllabusHeader";
import SyllabusSection from "./Components/SyllabusSection";
import {
  fetchSyllabus,
  deleteSyllabus,
} from "../../../../../../Store/Slices/Admin/Class/Syllabus/syllabusThunk";
import Spinner from "../../../../../../Components/Common/Spinner";
import NoDataFound from "../../../../../../Components/Common/NoDataFound";

const MainSection = () => {
  const dispatch = useDispatch();
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
      return <NoDataFound title="Syllabus" />;
    }

    if (syllabi && syllabi.length > 0) {
      return (
        <>
          <SyllabusHeader
            onEditClick={() => handleEditClick(syllabi[0])}
            onDeleteClick={() => handleDeleteClick(syllabi[0]._id)}
            syllabus={syllabi[0]}
          />
          <SyllabusSection
            title={syllabi[0].title}
            content={syllabi[0].content}
          />
        </>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full">
        <AiOutlineFileAdd size={64} className="text-gray-500" />
        <p className="text-gray-500 mt-4">No syllabus has been created yet.</p>
      </div>
    );
  };

  return (
    <div className="flex">
      <SubjectSideBar />
      <div className="border-l w-full p-4 relative">
        {renderContent()}
        {syllabi && syllabi.length === 0 && (
          <NavLink
            to={`/class/${cid}/${sid}/syllabus/create_syllabus`}
            className="bg-gradient-to-r from-purple-400 to-pink-400 text-white p-4 fixed rounded-full shadow-md bottom-4 right-4"
          >
            <RiAddFill size={24} />
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default MainSection;
