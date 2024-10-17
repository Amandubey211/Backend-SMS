import React, { useState, useCallback, useEffect } from "react";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import FilterCard from "../../../Component/FilterCard";
import { RiListCheck3 } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useFetchAssignedAssignments from "../../../../../../../Hooks/AuthHooks/Student/Assignment/useFetchAssignedAssignments";
import List from "../../../Component/List";
import { stdGetFilteredAssignment } from "../../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Assignment/assignment.action";

const AssignmentMainSection = () => {
  const dispatch = useDispatch();
  const { cid, sid, subjectId } = useParams();

  const { assignmentData, loading } = useSelector((store) => store?.student?.studentAssignment);
  console.log("assignmentData", assignmentData);

  const [filters, setFilters] = useState({ moduleId: "", chapterId: "" });

  // Fetch assignments based on selected filters
  const refetchAssignments = useCallback(() => {
    const { moduleId, chapterId } = filters;
    //fetchFilteredAssignments(sid, moduleId, chapterId);
    dispatch(stdGetFilteredAssignment({ cid, subjectId: sid, moduleId, chapterId }))
  }, [filters, sid, dispatch]);

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
          data={assignmentData}
          icon={<RiListCheck3 />}
          loading={loading}
          //error={error}
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
