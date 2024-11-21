import React, { useState, useEffect, useCallback } from "react";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import FilterCard from "../../../Component/FilterCard";
import { RiFileUnknowLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import List from "../../../Component/List";
import { useParams } from "react-router-dom";
import { stdGetQuiz } from "../../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Quizes/quizes.action";
import { getItemDetails, getItemName, navLinkPath } from "../Components/path";

const QuizMainSection = () => {

  const { cid, sid } = useParams();
  const { loading, error, quizData } = useSelector((store) => store?.student?.studentQuiz);
  const dispatch = useDispatch();


  const [filters, setFilters] = useState({ moduleId: "", chapterId: "" });


  useEffect(() => {
    dispatch(stdGetQuiz({cid, sid, moduleId:filters?.moduleId, chapterId:filters?.chapterId}))
  }, [dispatch,cid,sid,stdGetQuiz,filters])


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
        <FilterCard filters={filters} setFilters={setFilters}/>
      </div>
    </div>
  );
};



export default QuizMainSection;
