import React, { useState, useCallback, useEffect } from "react";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import List from "../../../Component/List";
import FilterCard from "../../../Component/FilterCard";
import { RiListCheck3 } from "react-icons/ri";
import useFetchAssignedAssignments from "../../../../../../../Hooks/AuthHooks/Student/Assignment/useFetchAssignedAssignments";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useGetFilteredAssignments from "../../../../../../../Hooks/AuthHooks/Student/Assignment/useFetchAssignedAssignments";

const MainSection = () => {
  const { selectedClass, selectedSection, selectedSubject } = useSelector(
    (state) => state.Common
  );

  const { cid, sid, subjectId } = useParams(); // Ensure subjectId is part of the route parameters

  const { loading, error, assignments, fetchFilteredAssignments } =
    useGetFilteredAssignments();

  const [filters, setFilters] = useState({
    moduleId: "",
    chapterId: "",
  });

  const refetchAssignments = useCallback(() => {
    const { moduleId, chapterId } = filters;
    fetchFilteredAssignments(sid, moduleId, chapterId);
  }, [filters, sid, fetchFilteredAssignments]);

  useEffect(() => {
    refetchAssignments();
  }, [refetchAssignments]);

  return (
    <div className="flex">
      <SubjectSideBar />
      <div className="w-[65%] border-l">
        <List
          type="Assignment"
          title="All Assignments"
          data={assignments}
          icon={<RiListCheck3 />}
          loading={loading}
          error={error}
          refetchData={refetchAssignments}
        />
      </div>
      <div className="w-[30%] p-2">
        <FilterCard filters={filters} setFilters={setFilters} />
      </div>
    </div>
  );
};

export default MainSection;
