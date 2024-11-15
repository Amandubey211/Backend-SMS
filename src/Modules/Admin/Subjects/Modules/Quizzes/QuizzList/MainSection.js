import React, { useEffect, useState, useCallback } from "react";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import List from "../../Assignments/Component/List";
import { RiAddFill, RiFileUnknowLine } from "react-icons/ri";
import { NavLink, useParams } from "react-router-dom";
import QuizFilterCard from "../Components/QuizFilterCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchFilteredQuizzesThunk } from "../../../../../../Store/Slices/Admin/Class/Quiz/quizThunks"; // Import the thunk
import FilterCard from "../../Assignments/Component/FilterCard";
import { useTranslation } from "react-i18next";

const MainSection = () => {
  const { cid, sid } = useParams();
  const { t } = useTranslation("admClass");

  const [filters, setFilters] = useState({
    moduleId: "",
    chapterId: "",
    publish: null,
  });

  const dispatch = useDispatch();
  const { quizzes, loading, error } = useSelector(
    (state) => state.admin.quizzes
  ); // Access state from slice

  // Function to refetch quizzes based on filters
  const refetchQuizzes = useCallback(() => {
    dispatch(fetchFilteredQuizzesThunk(filters));
  }, [dispatch, filters]);

  // Fetch quizzes when the component mounts or filters change
  useEffect(() => {
    refetchQuizzes();
  }, [refetchQuizzes]);

  return (
    <div className="flex">
      <SubjectSideBar />
      <div className="w-[65%] border-l">
        <List
          title={t("All Quizzes")}
          data={quizzes}
          icon={<RiFileUnknowLine />}
          type={t("Quiz")}
          loading={loading}
          error={error}
          refetchData={refetchQuizzes} // Pass the correct prop
        />
      </div>
      <div className="w-[30%] px-2 pt-2">
        <FilterCard filters={filters} setFilters={setFilters} />
      </div>
      <NavLink
        to={`/class/${cid}/${sid}/create_quiz`}
        aria-label={t("Create Quiz")}
        className="bg-gradient-to-r from-purple-400 to-pink-400 text-white p-4 fixed rounded-full shadow-md bottom-4 right-4"
      >
        <RiAddFill size={24} />
      </NavLink>
    </div>
  );
};

export default MainSection;
