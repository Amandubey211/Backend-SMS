import React, { useState, useEffect, useCallback } from "react";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import FilterCard from "../../../Component/FilterCard";
import { RiFileUnknowLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import useFetchQuizzes from "../../../../../../../Hooks/AuthHooks/Student/Quiz/useFetchQuizzes";
import List from "../../../Component/List";
import { useParams } from "react-router-dom";
import { stdGetQuiz } from "../../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Quizes/quizes.action";
import { setFilters } from "../../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Quizes/quizesSlice";

const QuizMainSection = () => {

  const { cid, sid } = useParams();
  const { loading, error, quizData, filters } = useSelector((store) => store?.student?.studentQuiz);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(stdGetQuiz({cid, sid, moduleId:filters?.moduleId, chapterId:filters?.chapterId}))
  }, [dispatch,cid,sid,stdGetQuiz])

  const getItemName = (item) => item?.name;
  const getItemDetails = (item) =>
    `Total Points: ${item?.totalPoints} | Type: ${item?.quizType}`;
  const navLinkPath = (cid, sid, item) =>
    `/student_class/${cid}/${sid}/quizzes/${item?._id}/view`;

  return (
    <div className="flex">
      <SubjectSideBar />
      <div className="w-[65%] border-l">
        <List
          type="Quiz"
          title="All Quizzes"
          data={quizData}
          icon={<RiFileUnknowLine />}
          loading={loading}
          error={error}
          getItemName={getItemName}
          getItemDetails={getItemDetails}
          navLinkPath={navLinkPath}
        />
      </div>
      <div className="w-[30%] p-2">
        {/* <FilterCard filters={filters} setFilters={setFilters}/> */}
      </div>
    </div>
  );
};

export default QuizMainSection;
