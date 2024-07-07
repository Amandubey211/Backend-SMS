import React, { useEffect } from "react";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import SyllabusHeader from "./Components/SyllabusHeader";
import SyllabusSection from "./Components/SyllabusSection";
import useFetchSyllabus from "../../../../../../Hooks/AuthHooks/Staff/Admin/Syllabus/useFetchSyllabus";
import { useParams } from "react-router-dom";

const MainSection = () => {
  const { fetchSyllabus, loading, error, syllabi } = useFetchSyllabus();
  const { cid, sid } = useParams();

  useEffect(() => {
    fetchSyllabus(sid, cid);
  }, [sid, cid, fetchSyllabus]);

  return (
    <div className="flex">
      <SubjectSideBar />
      <div className="border-l w-full p-4">
        <SyllabusHeader />
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {syllabi && syllabi.map((syllabus) => (
          <SyllabusSection key={syllabus._id} title={syllabus.title} content={syllabus.content} />
        ))}
      </div>
    </div>
  );
};

export default MainSection;
