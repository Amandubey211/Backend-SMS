import React, { useState, useCallback, useEffect } from "react";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import List from "../../../Component/List";
import FilterCard from "../../../Component/FilterCard";
import { RiListCheck3 } from "react-icons/ri";
import useFetchAssignedAssignments from "../../../../../../../Hooks/AuthHooks/Student/Assignment/useFetchAssignedAssignments";
import { useSelector } from "react-redux";

const MainSection = () => {
  const sectionId = useSelector((state) => state.Common.selectedSection);
  const [filters, setFilters] = useState({
    moduleId: "",
    chapterId: "",
  });

  const { assignments, error, loading, fetchFilteredAssignments } =
    useFetchAssignedAssignments(sectionId);

  const refetchAssignments = useCallback(() => {
    const { moduleId, chapterId } = filters;
    fetchFilteredAssignments(sectionId, moduleId, chapterId);
  }, [filters, sectionId, fetchFilteredAssignments]);

  useEffect(() => {
    refetchAssignments();
  }, [refetchAssignments]);

  return (
    <div className="flex">
      <SubjectSideBar />
      <div className="w-[65%] border-l p-4">
        <List
          type="Assignment"
          title="All Assignments"
          data={assignments}
          icon={<RiListCheck3 />}
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
