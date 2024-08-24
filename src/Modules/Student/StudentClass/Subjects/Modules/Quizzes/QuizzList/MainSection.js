import React, { useState, useCallback, useEffect } from "react";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import List from "../Component/List";
import FilterCard from "../../../Component/FilterCard";
import { RiFileUnknowLine } from "react-icons/ri";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import useFetchQuizzes from "../../../../../../../Hooks/AuthHooks/Student/Quiz/useFetchQuizzes";
import { FaEllipsisV, FaExclamationTriangle } from "react-icons/fa";
import Spinner from "../../../../../../../Components/Common/Spinner";

const MainSection = () => {
  const { cid, sid } = useParams();
  const { selectedClass, selectedSubject } = useSelector(
    (state) => state.Common
  );

  const [filters, setFilters] = useState({
    moduleId: "",
    chapterId: "",
  });

  // Use the custom hook for fetching quizzes with filters
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

  // if (loading) {
  //   return (
  //     <Spinner/>
  //   )
  // }

  // if (error) {
  //   return (

  //     <div className="flex flex-col items-center justify-center py-10 text-gray-500">
  //       <FaExclamationTriangle className="w-12 h-12 mb-3" />
  //       <p className="text-lg font-semibold">No data found</p>
  //     </div>
  //   )
  // }

  return (
    <div className="flex">
      <SubjectSideBar />
      <div className="w-[65%] border-l">
        <List
          type="Quiz"
          title="All Quizes"
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
