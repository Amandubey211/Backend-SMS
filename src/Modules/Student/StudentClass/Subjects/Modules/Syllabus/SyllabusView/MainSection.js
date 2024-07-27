// MainSection.js
import React, { useEffect } from "react";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import SyllabusHeader from "./Components/SyllabusHeader";
import SyllabusSection from "./Components/SyllabusSection";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AiOutlineFileAdd } from "react-icons/ai";
import useFetchSyllabus from "../../../../../../../Hooks/AuthHooks/Staff/Admin/Syllabus/useFetchSyllabus";
import Spinner from "../../../../../../../Components/Common/Spinner";

const MainSection = () => {
  const { cid } = useParams();
  const selectedSubjectId = useSelector(state => state.Common.selectedSubject);
  const { loading, error, syllabi, fetchSyllabus } = useFetchSyllabus();

  useEffect(() => {
    if (selectedSubjectId) {
      fetchSyllabus(selectedSubjectId, cid);
    }
  }, [selectedSubjectId, cid, fetchSyllabus]);

  if (loading) return <Spinner />;
  if (error) return <p>Error: {error}</p>;
  if (!syllabi.length)
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <AiOutlineFileAdd size={64} className="text-gray-500" />
        <p className="text-gray-500 mt-4">No syllabus has been created yet.</p>
      </div>
    );

  return (
    <div className="flex">
      <SubjectSideBar />
      <div className="border-l w-full p-4">
        <SyllabusHeader />
        {syllabi.map((syllabusItem) => (
          <SyllabusSection key={syllabusItem._id} syllabus={syllabusItem} />
        ))}
      </div>
    </div>
  );
};

export default MainSection;
