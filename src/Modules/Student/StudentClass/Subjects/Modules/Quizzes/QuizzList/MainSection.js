import React, { useState, useCallback, useEffect } from "react";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import { RiFileUnknowLine } from "react-icons/ri";
import List from "../../../Component/List";
import FilterCard from "../../../Component/FilterCard";
import useFetchQuizzes from "../../../../../../../Hooks/AuthHooks/Student/Quiz/useFetchQuizzes";
import { useParams } from "react-router-dom";

const MainSection = () => {
  const { cid, sid } = useParams();
  const [filters, setFilters] = useState({
    moduleId: "",
    chapterId: "",
  });

  const { quizzes, error, loading, fetchFilteredQuizzes } = useFetchQuizzes(cid, sid);

  const refetchQuizzes = useCallback(() => {
    const { moduleId, chapterId } = filters;
    fetchFilteredQuizzes(cid, sid, moduleId, chapterId);
  }, [filters, cid, sid, fetchFilteredQuizzes]);

  useEffect(() => {
    refetchQuizzes();
  }, [refetchQuizzes]);

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
      <div className="w-[30%] p-4">
        <FilterCard filters={filters} setFilters={setFilters} />
      </div>
    </div>
  );
};

export default MainSection;
