import React, { useEffect, useState, useCallback } from "react";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import List from "../../Assignments/Component/List";
import { RiAddFill, RiFileUnknowLine } from "react-icons/ri";
import { NavLink, useParams } from "react-router-dom";
import QuizFilterCard from "../Components/QuizFilterCard";
import useGetFilteredQuizzes from "../../../../../../Hooks/AuthHooks/Staff/Admin/Quiz/useGetFilteredQuizzes";

const MainSection = () => {
  const { cid, sid } = useParams();
  const [filters, setFilters] = useState({
    moduleId: "",
    chapterId: "",
    publish: null,
  });
  const { error, fetchFilteredQuizzes, loading, quizzes } = useGetFilteredQuizzes();

  const refetchQuizzes = useCallback(() => {
    fetchFilteredQuizzes(filters.moduleId, filters.chapterId, filters.publish);
  }, [fetchFilteredQuizzes, filters]);

  useEffect(() => {
    refetchQuizzes();
  }, [refetchQuizzes]);

  return (
    <div className="flex">
      <SubjectSideBar />
      <div className="w-[65%] border-l">
        <List
          title="All Quizzes"
          data={quizzes}
          icon={<RiFileUnknowLine />}
          type="Quiz"
          loading={loading}
          error={error}
          refetchQuizzes={refetchQuizzes}
        />
      </div>
      <div className="w-[30%] px-2 pt-2">
        <QuizFilterCard filters={filters} setFilters={setFilters} />
      </div>
      <NavLink
        to={`/class/${cid}/${sid}/create_quiz`}
        className="bg-gradient-to-r from-purple-400 to-pink-400 text-white p-4 fixed rounded-full shadow-md bottom-4 right-4"
      >
        <RiAddFill size={24} />
      </NavLink>
    </div>
  );
};

export default MainSection;
