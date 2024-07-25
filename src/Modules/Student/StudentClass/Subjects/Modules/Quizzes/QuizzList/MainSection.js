import React, { useState } from "react";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import { RiFileUnknowLine } from "react-icons/ri";
import List from "../../../Component/List";
import FilterCard from "../../../Component/FilterCard";
import useFetchQuizzes from "../../../../../../../Hooks/AuthHooks/Student/Quiz/useFetchQuizzes";
import { useParams } from "react-router-dom";

const MainSection = () => {
  const { cid, sid } = useParams();
  const { quizzes, loading, error } = useFetchQuizzes(cid, sid);

  const [filters, setFilters] = useState({
    moduleId: "",
    chapterId: "",
  });

  return (
    <div className="flex">
      <SubjectSideBar />
      <div className="w-[65%] border-l">
        <List
          type="Quiz"
          title="All Quizzes"
          data={quizzes}
          icon={<RiFileUnknowLine />}
          loading={loading}
          error={error}
        />
      </div>
      <div className="w-[30%] p-2">
        <FilterCard filters={filters} setFilters={setFilters} />
      </div>
    </div>
  );
};

export default MainSection;
