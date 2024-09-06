import React, { useState, useCallback, useEffect } from "react";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import FilterCard from "../../../Component/FilterCard";
import { RiFileUnknowLine } from "react-icons/ri";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import useFetchQuizzes from "../../../../../../../Hooks/AuthHooks/Student/Quiz/useFetchQuizzes";
import List from "../../../Component/List";

const QuizMainSection = () => {
  const { cid, sid } = useParams();
  const { selectedClass, selectedSubject } = useSelector(
    (state) => state.Common
  );

  const [filters, setFilters] = useState({
    moduleId: "",
    chapterId: "",
  });

  const { quizzes, loading, error, fetchFilteredQuizzes } = useFetchQuizzes(
    selectedClass,
    selectedSubject
  );

  const refetchQuizzes = useCallback(() => {
    const { moduleId, chapterId } = filters;
    fetchFilteredQuizzes(selectedClass, selectedSubject, moduleId, chapterId);
  }, [filters, selectedClass, selectedSubject, fetchFilteredQuizzes]);

  useEffect(() => {
    refetchQuizzes();
  }, [refetchQuizzes]);

  const getItemName = (item) => item.name;
  const getItemDetails = (item) =>
    `Total Points: ${item.totalPoints} | Type: ${item.quizType}`;
  const navLinkPath = (cid, sid, item) =>
    `/student_class/${cid}/${sid}/quizzes/${item._id}/view`;

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
          getItemName={getItemName}
          getItemDetails={getItemDetails}
          navLinkPath={navLinkPath}
        />
      </div>
      <div className="w-[30%] p-2">
        <FilterCard filters={filters} setFilters={setFilters} />
      </div>
    </div>
  );
};

export default QuizMainSection;
