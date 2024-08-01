import React, { useEffect } from "react";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import { AiOutlineFileAdd } from "react-icons/ai";
import { RiAddFill } from "react-icons/ri";
import { FaSpinner } from "react-icons/fa";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import SyllabusHeader from "./Components/SyllabusHeader";
import SyllabusSection from "./Components/SyllabusSection";
import useFetchSyllabus from "../../../../../../Hooks/AuthHooks/Staff/Admin/Syllabus/useFetchSyllabus";
import useDeleteSyllabus from "../../../../../../Hooks/AuthHooks/Staff/Admin/Syllabus/useDeleteSyllabus";
import Spinner from "../../../../../../Components/Common/Spinner";
import NoDataFound from "../../../../../../Components/Common/NoDataFound";

const MainSection = () => {
  const { fetchSyllabus, loading, error, syllabi } = useFetchSyllabus();
  const {
    deleteSyllabus,
    loading: deleteLoading,
    error: deleteError,
  } = useDeleteSyllabus();
  const { cid, sid } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSyllabus(sid, cid);
  }, [sid, cid, fetchSyllabus]);

  const handleEditClick = (syllabus) => {
    navigate(`/class/${cid}/${sid}/syllabus/create_syllabus`, {
      state: { syllabus },
    });
  };

  const handleDeleteClick = async (syllabusId) => {
    await deleteSyllabus(syllabusId);
    fetchSyllabus(sid, cid); // Refresh the syllabus after deletion
  };

  return (
    <div className="flex">
      <SubjectSideBar />
      <div className="border-l w-full p-4 relative">
        {loading && <Spinner />}
        {!loading && error && <NoDataFound title="Syllabus" />}
        {!loading && deleteLoading && <Spinner />}
        {!loading && deleteError && <NoDataFound title="Syllabus" />}
        {!loading && syllabi && syllabi.length > 0 ? (
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
        ) : (
          !loading && (
            <div className="flex flex-col items-center justify-center h-full">
              <AiOutlineFileAdd size={64} className="text-gray-500" />
              <p className="text-gray-500 mt-4">
                No syllabus has been created yet.
              </p>
            </div>
          )
        )}
        <NavLink
          to={`/class/${cid}/${sid}/syllabus/create_syllabus`}
          className="bg-gradient-to-r from-purple-400 to-pink-400 text-white p-4 fixed rounded-full shadow-md bottom-4 right-4"
        >
          <RiAddFill size={24} />
        </NavLink>
      </div>
    </div>
  );
};

export default MainSection;
