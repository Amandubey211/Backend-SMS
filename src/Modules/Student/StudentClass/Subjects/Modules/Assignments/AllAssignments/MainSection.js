import React, { useState, useCallback, useEffect } from "react";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import FilterCard from "../../../Component/FilterCard";
import { RiListCheck3 } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useFetchAssignedAssignments from "../../../../../../../Hooks/AuthHooks/Student/Assignment/useFetchAssignedAssignments";
import List from "../../../Component/List";

const AssignmentMainSection = () => {
  const { selectedClass, selectedSection, selectedSubject } = useSelector(
    (state) => state.Common
  );
  const { cid, sid, subjectId } = useParams();

  const { loading, error, assignments, fetchFilteredAssignments } =
    useFetchAssignedAssignments();
  const [filters, setFilters] = useState({ moduleId: "", chapterId: "" });

  // Fetch assignments based on selected filters
  const refetchAssignments = useCallback(() => {
    const { moduleId, chapterId } = filters;
    fetchFilteredAssignments(sid, moduleId, chapterId);
  }, [filters, sid, fetchFilteredAssignments]);

  useEffect(() => {
    refetchAssignments();
  }, [refetchAssignments]);

  const getItemName = (item) => item.title;
  const getItemDetails = (item) =>
    `Module: ${item.module} | Chapter: ${item.chapter}`;
  const navLinkPath = (cid, sid, item) =>
    `/student_class/${cid}/${sid}/assignments/${item.assignmentId}/view`;

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

export default AssignmentMainSection;
