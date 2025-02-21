import React, { useEffect, useState, useCallback } from "react";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import List from "../../Assignments/Component/List";
import { RiAddFill, RiFileUnknowLine } from "react-icons/ri";
import { NavLink, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchFilteredQuizzesThunk } from "../../../../../../Store/Slices/Admin/Class/Quiz/quizThunks"; // Import the thunk
import FilterCard from "../../Assignments/Component/FilterCard";
import { useTranslation } from "react-i18next";
import { clearQuizDetail } from "../../../../../../Store/Slices/Admin/Class/Quiz/quizSlice";
import ProtectedSection from "../../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../../config/permission";
import ProtectedAction from "../../../../../../Routes/ProtectedRoutes/ProtectedAction";

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

  // Optimized handleClear function
  const HandleClear = useCallback(() => {
    dispatch(clearQuizDetail());
  }, [dispatch]);

  // Function to refetch quizzes based on filters
  const refetchQuizzes = useCallback(() => {
    dispatch(
      fetchFilteredQuizzesThunk({
        sid, // Include sid in the payload
        ...filters, // Spread the existing filters
      })
    );
  }, [dispatch, sid, filters]); // Add sid to the dependency array

  // Fetch quizzes when the component mounts or filters change
  useEffect(() => {
    refetchQuizzes();
  }, [refetchQuizzes]);

  return (
    <div className="flex w-full h-full">
      <SubjectSideBar />
      <ProtectedSection
        title="Quiz List"
        requiredPermission={PERMISSIONS.FILTERED_QUIZZES_BY_SUBJECT}
      >
        <div className="flex">
          <div className="w-[65%] border-l">
            <List
              title={t("All Quizzes")}
              data={quizzes || []}
              icon={<RiFileUnknowLine />}
              type={t("Quiz")}
              loading={loading}
              error={error}
              refetchData={refetchQuizzes} // Pass the correct prop
              requiredPermission={PERMISSIONS.DELETE_QUIZ}
            />
          </div>
          <div className="w-[30%] px-2 pt-2">
            <FilterCard filters={filters} setFilters={setFilters} />
          </div>
          <ProtectedAction requiredPermission={PERMISSIONS.CREATE_QUIZ}>
            <NavLink
              onClick={HandleClear}
              to={`/class/${cid}/${sid}/create_quiz`}
              aria-label={t("Create Quiz")}
              className="bg-gradient-to-r from-purple-400 to-pink-400 text-white p-4 fixed rounded-full shadow-md bottom-4 right-4"
            >
              <RiAddFill size={24} />
            </NavLink>
          </ProtectedAction>
        </div>
      </ProtectedSection>
    </div>
  );
};

export default MainSection;
